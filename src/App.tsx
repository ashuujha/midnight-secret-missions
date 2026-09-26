import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ClassicGame } from "./components/ClassicGame";
import { useCatChaos } from "./hooks/useCatChaos";
import { ClassicRules, ClassicPrivacy } from "./components/ClassicHelp";
import { readClassicInvite } from "./game/classic-invite";
import { ArcadeHome } from "./components/ArcadeHome";
import { CatAtmosphere } from "./components/CatAtmosphere";
import { CatControls } from "./components/CatControls";
import { CatCard } from "./components/CatCard";
import { Dialog } from "./components/Dialog";
import {
  CATS,
  cardsOf,
  inviteUrl,
  localAction,
  newPractice,
  readInvite,
  type LocalAction,
} from "./game/cat-bluff";
import { curiousCat, playSound, stopSound, type Sound } from "./game/sound";
import { useCatBluff } from "./hooks/useCatBluff";
import type { Action } from "./midnight/cat-bluff";

import { freshMemeLineup, rememberMemeLineup, MEMES } from "./game/memes";

type Mode = "home" | "practice" | "live" | "classic-practice" | "classic-live";
const stageCopy = {
  preparing: "Preparing your move",
  proving: "Proving the move privately",
  balancing: "Approve the transaction in Lace",
  submitting: "Sending your move",
  confirming: "Waiting for Midnight to confirm",
};
export default function App() {
  const [mode, setMode] = useState<Mode>(
    readClassicInvite(location.search)
      ? "classic-live"
      : readInvite(location.search)
        ? "live"
        : "home",
  );
  const [hostCat] = useState(() => freshMemeLineup("cat-bluff-door-cat", 1)[0]);
  useEffect(
    () => rememberMemeLineup("cat-bluff-door-cat", [hostCat]),
    [hostCat],
  );
  const [practice, setPractice] = useState(() => newPractice());
  const [selected, setSelected] = useState<number | null>(null);
  const [claim, setClaim] = useState(0);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cat-bluff-theme") || "dark",
  );
  const [sound, setSound] = useState(
    () => localStorage.getItem("cat-bluff-sound") !== "off",
  );
  const [gameSound, setGameSound] = useState(
    () => localStorage.getItem("cat-bluff-game-sound") !== "off",
  );
  const [motion, setMotion] = useState(
    () => localStorage.getItem("cat-bluff-motion") !== "off",
  );
  const [modal, setModal] = useState<
    "rules" | "invite" | "privacy" | "settings" | null
  >(null);
  const [toast, setToast] = useState("");
  const [pendingCard, setPendingCard] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());
  const live = useCatBluff(mode === "live");
  const table = mode === "practice" ? practice.table : live.table;
  useCatChaos({
    scope: mode === "live" ? `legacy:${live.contract}:${live.room}` : mode,
    round: (mode === "practice" || mode === "live") && table ? 0 : undefined,
    play: table?.play,
    pending: table?.phase === 1,
    sound,
  });
  const myId = mode === "practice" ? "you" : live.hand?.id;
  const seat = table?.players.findIndex((p) => p.id === myId) ?? -1;
  const mine =
    mode === "practice"
      ? practice.hands[0]
      : live.hand
        ? cardsOf(live.hand.counts.map((n, i) => n + live.hand!.draws[i]))
        : [];
  const myTurn =
    !!table &&
    seat >= 0 &&
    table.phase === 0 &&
    table.turn === seat &&
    table.status !== 2 &&
    table.players.length > 1;
  const myResponse =
    !!table && seat >= 0 && table.phase === 1 && table.responder === seat;
  const myProof = !!table && table.phase === 2 && table.actor === myId;
  const [classicBusy, setClassicBusy] = useState(false);
  const busy = (mode === "live" && live.busy) || classicBusy;
  const tableTarget = useRef<HTMLDivElement>(null);
  const previousOutcome = useRef("");
  const name = (id?: string) =>
    id === myId
      ? "You"
      : id === "miso"
        ? "Miso"
        : id && table
          ? `Player ${table.players.findIndex((p) => p.id === id) + 1}`
          : "A player";
  const say = (s: Sound) => {
    playSound(s, sound);
  };
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cat-bluff-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#201b2c" : "#fff5dc");
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("cat-bluff-sound", sound ? "on" : "off");
    if (!sound) stopSound();
  }, [sound]);
  useEffect(() => {
    localStorage.setItem("cat-bluff-game-sound", gameSound ? "on" : "off");
  }, [gameSound]);
  useEffect(() => {
    document.documentElement.dataset.fx = motion ? "on" : "off";
    localStorage.setItem("cat-bluff-motion", motion ? "on" : "off");
  }, [motion]);
  useEffect(() => {
    if (!busy && mode !== "live") return;
    setClock(Date.now());
    const id = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(id);
  }, [busy, mode]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    setSelected(null);
  }, [table?.play, table?.turn, mode]);
  useEffect(() => {
    if (!table) return;
    const key = `${mode}:${table.play}:${table.outcome}`;
    if (previousOutcome.current === key) return;
    previousOutcome.current = key;
    if (table.outcome === 3 || table.outcome === 4) say("caught");
    else if (table.outcome === 2) say("truth");
  }, [table?.outcome, table?.play, mode]);
  useEffect(() => {
    if (mode !== "practice" || practice.table.status === 2) return;
    const t = practice.table;
    if (!(
      (t.phase === 0 && t.turn === 1) ||
      (t.phase === 1 && t.responder === 1) ||
      (t.phase === 2 && t.actor === "miso")
    ))
      return;
    const timer = setTimeout(
      () =>
        setPractice((s) => {
          const p = s.table;
          if (p.phase === 0) {
            const actual = s.hands[1][0];
            const announced =
              Math.random() < 0.5
                ? actual
                : (actual + 1 + Math.floor(Math.random() * 4)) % 5;
            return localAction(s, 1, {
              kind: "play",
              card: 0,
              claim: announced,
            });
          }
          if (p.phase === 1)
            return localAction(s, 1, {
              kind:
                s.guide && p.play === 1
                  ? "call"
                  : Math.random() < 0.6
                    ? "call"
                    : "pass",
            });
          return localAction(s, 1, { kind: "prove" });
        }),
      t.phase === 2 ? 1300 : 1700,
    );
    return () => clearTimeout(timer);
  }, [mode, practice]);
  function startPractice(guide = true) {
    setPractice(newPractice(guide));
    setSelected(null);
    setPendingCard(null);
    setMode("practice");
    setModal(null);
  }
  function flyCard() {
    const source = document.querySelector<HTMLButtonElement>(
      ".hand-card.is-selected",
    );
    const target = tableTarget.current;
    if (
      !source ||
      !target ||
      !motion ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const a = source.getBoundingClientRect(),
      b = target.getBoundingClientRect();
    const card = document.createElement("div");
    card.className = "flying-card";
    card.textContent = "CAT BLUFF";
    Object.assign(card.style, {
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
    });
    document.body.append(card);
    card
      .animate(
        [
          { transform: "translate(0,0) rotate(-6deg) scale(1)" },
          {
            transform: `translate(${b.left + b.width / 2 - a.left - a.width / 2}px,${b.top + b.height / 2 - a.top - a.height / 2}px) rotate(4deg) scale(.8)`,
          },
        ],
        { duration: 500, easing: "cubic-bezier(.2,.7,.2,1)" },
      )
      .finished.finally(() => card.remove());
  }
  async function act(kind: "play" | "pass" | "call" | "prove" | "timeout") {
    if (busy) return;
    if (kind === "call") say("challenge");
    if (kind === "play") {
      if (selected === null) return;
      flyCard();
    }
    if (mode === "practice") {
      const action: LocalAction =
        kind === "play"
          ? { kind, card: selected!, claim }
          : { kind: kind === "timeout" ? "pass" : kind };
      setPractice((s) => localAction(s, 0, action));
      setSelected(null);
      return;
    }
    const action: Action =
      kind === "play" ? { kind, cat: mine[selected!], claim } : { kind };
    if (kind === "play") setPendingCard(selected);
    await live.act(action);
    setPendingCard(null);
    setSelected(null);
  }
  const invite =
    live.room && live.contract
      ? inviteUrl(location.origin, live.room, live.contract)
      : "";
  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(invite);
      setToast("Invite copied. Send it to your friends.");
    } catch {
      setToast("Select the invite link below and copy it.");
    }
  }
  const guide =
    mode === "practice" && practice.guide && table && table.play < 3;
  const outcome =
    table?.outcome === 1
      ? "Everyone passed. The card stays secret."
      : table?.outcome === 2
        ? `${name(table.actor)} told the truth. ${name(table.loser)} draw${table.loser === myId ? "" : "s"} two.`
        : table?.outcome === 3
          ? `Caught bluffing! ${name(table.loser)} draw${table.loser === myId ? "" : "s"} two.`
          : table?.outcome === 4
            ? `${name(table.loser)} missed the proof window. Draw two.`
            : "";
  let headline = "Take a seat.";
  let hint =
    "Invite a friend. Five secret cards each. One excellent poker face.";
  if (table) {
    if (table.status === 2) {
      headline = `${name(table.winner)} ${table.winner === myId ? "win" : "wins"}!`;
      hint = "An empty hand. A very suspicious smile.";
    } else if (table.players.length === 1) {
      headline = "A table for you + your accomplices.";
      hint =
        "Invite 1–3 friends. You can play your first card as soon as someone joins.";
    } else if (myTurn) {
      headline = "Your card. Your story.";
      hint = "Pick a card from your hand. Then decide which cat to claim.";
    } else if (myResponse) {
      headline = "Believe that face?";
      hint =
        "Pass to let the card go, or call bluff. The loser of a challenge draws two.";
    } else if (myProof) {
      headline = "Someone called your bluff.";
      hint =
        mode === "practice"
          ? "Let’s check the hidden card. In a live game, Midnight verifies this privately."
          : "Prove whether your claim is true. Your other cards stay hidden.";
    } else if (table.phase === 2) {
      headline = `${name(table.actor)} is settling the claim.`;
      hint =
        "The verdict reveals truth or bluff. It never shows the rest of their hand.";
    } else if (table.phase === 1) {
      headline = `Waiting for ${name(table.players[table.responder]?.id)}.`;
      hint = "Will they trust the claim or call bluff?";
    } else {
      headline = `${name(table.players[table.turn]?.id)} is choosing a card.`;
      hint = "Keep your hand close. Keep your poker face closer.";
    }
  }
  return (
    <div className={`app mode-${mode}`}>
      <CatAtmosphere motion={motion} mode={mode} />
      <header className="topbar">
        <button
          className="wordmark"
          disabled={busy}
          onClick={() => {
            if (mode === "home") curiousCat(sound);
            setMode("home");
          }}
          aria-label="Cat Bluff home"
          title={`${MEMES[hostCat].name} is on door duty today`}
        >
          <span className="wordmark-meme" aria-hidden="true">
            <img src={MEMES[hostCat].image} alt="" />
          </span>
          cat bluff<span className="wordmark-dot">.</span>
        </button>
        <nav aria-label="Game controls">
          <button
            className="text-button"
            onClick={() => {
              setModal("rules");
              if (mode === "home") curiousCat(sound);
            }}
          >
            How to play
          </button>
          <CatControls
            theme={theme}
            sound={sound}
            gameSound={gameSound}
            motion={motion}
            onTheme={() => setTheme(theme === "light" ? "dark" : "light")}
            onSound={() => setSound(!sound)}
            onGameSound={() => setGameSound(!gameSound)}
            onMotion={() => setMotion(!motion)}
          />
        </nav>
      </header>
      <main>
        {mode === "home" ? (
          <ArcadeHome
            onPractice={() => setMode("classic-practice")}
            onFriends={() => setMode("classic-live")}
            sound={sound}
          />
        ) : mode.startsWith("classic-") ? (
          <ClassicGame
            onBusy={setClassicBusy}
            key={mode}
            online={mode === "classic-live"}
            sound={sound}
            gameSound={gameSound}
            onHome={() => setMode("home")}
            onFriends={() => setMode("classic-live")}
            onPractice={() => setMode("classic-practice")}
            onLegacy={() => setMode("live")}
          />
        ) : (
          <section className="game-shell">
            <div className="table-toolbar">
              <span className="mode-chip">
                <i />
                {mode === "practice"
                  ? "Practice · Miso is a bot"
                  : "Friends · Midnight Preprod"}
              </span>
              <div>
                {mode === "practice" ? (
                  <button
                    className="text-button"
                    onClick={() => setMode("live")}
                  >
                    Play with friends ↗
                  </button>
                ) : (
                  <button
                    className="text-button"
                    disabled={!table}
                    onClick={() => setModal("invite")}
                  >
                    Invite friends ↗
                  </button>
                )}
                <button
                  className="text-button"
                  onClick={() => setModal("settings")}
                >
                  Settings
                </button>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() => setMode("home")}
                >
                  Leave table
                </button>
              </div>
            </div>
            {mode === "live" && !table ? (
              <div className="lobby">
                <div className="lobby-cat">
                  <img src={CATS[2].image} alt="Polite Cat smiling" />
                </div>
                <span className="eyebrow">Bring your best poker face</span>
                <h1>
                  {live.invited
                    ? "Your friends saved you a seat."
                    : "Bad lies. Good company."}
                </h1>
                <p>
                  Everyone gets five private cat cards. First empty hand wins.
                </p>
                {!live.contract ? (
                  <>
                    <p className="notice">
                      This table needs the five-cat (V3) contract. Open settings
                      to connect or deploy it.
                    </p>
                    <button
                      className="button primary"
                      onClick={() => setModal("settings")}
                    >
                      Set up live play
                    </button>
                  </>
                ) : live.wallet.status !== "connected" ? (
                  <>
                    <button
                      className="button primary"
                      disabled={live.wallet.status === "connecting"}
                      onClick={() => void live.wallet.connect()}
                    >
                      {live.wallet.status === "connecting"
                        ? "Opening Lace…"
                        : "Connect Lace"}
                    </button>
                    <p className="quiet">
                      Midnight Preprod · tDUST required · Keep this browser for
                      your private hand.
                    </p>
                  </>
                ) : (
                  <button
                    className="button primary"
                    disabled={busy || !!live.room}
                    onClick={() => void live.act({ kind: "create" })}
                  >
                    {live.room ? "Loading your table…" : "Create a table"}
                  </button>
                )}
                {live.room && (
                  <button
                    className="text-button"
                    disabled={busy}
                    onClick={live.clearRoom}
                  >
                    Start a different table
                  </button>
                )}
                <button className="text-button" onClick={() => startPractice()}>
                  Try a practice game first
                </button>
              </div>
            ) : (
              table && (
                <>
                  <div className="opponents">
                    {table.players.map((p, i) =>
                      i === seat ? null : (
                        <div
                          key={p.id}
                          className={`opponent ${(table.phase === 0 ? table.turn : table.phase === 1 ? table.responder : table.players.findIndex((p) => p.id === table.actor)) === i ? "active-seat" : ""}`}
                        >
                          <img
                            className="avatar"
                            src={CATS[(i + 1) % 5].image}
                            alt=""
                          />
                          <div>
                            <strong>{name(p.id)}</strong>
                            <span>
                              {p.count} cards{" "}
                              {p.id === "miso" ? "· practice bot" : ""}
                            </span>
                          </div>
                          <div className="mini-hand" aria-hidden="true">
                            {Array.from(
                              { length: Math.min(p.count, 5) },
                              (_, j) => (
                                <i
                                  key={j}
                                  style={{ "--j": j } as CSSProperties}
                                />
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                    {table.players.length === 1 && (
                      <button
                        className="empty-seat"
                        onClick={() => setModal("invite")}
                      >
                        ＋ Invite a friend to this seat
                      </button>
                    )}
                  </div>
                  <div className="felt">
                    <div className="table-heading">
                      <img
                        className="table-judge"
                        src={
                          myProof || myResponse
                            ? "/memes/huh.jpg"
                            : "/memes/smudge.jpg"
                        }
                        alt=""
                      />
                      <span className="eyebrow">
                        {table.status === 2
                          ? "That’s the game"
                          : table.play
                            ? `Play ${table.play}`
                            : "Five cards each. Let’s deal."}
                      </span>
                      <h1>{headline}</h1>
                      <p>{hint}</p>
                    </div>
                    {guide && (
                      <div className="guide">
                        <span>QUICK START</span>
                        {table.play === 0
                          ? "Pick any cat below. Keep its name as your claim for an honest first play."
                          : table.phase === 2 && myProof
                            ? "Miso challenged you. Tap “Check the claim” to see who draws two."
                            : myResponse
                              ? "Now you decide: trust Miso, or call bluff. Miso can really lie."
                              : "Your other cards stay private. That’s the whole trick."}
                      </div>
                    )}
                    <div className="center-stage">
                      <div className="deck" aria-label="Draw pile">
                        <CatCard back small />
                        <span>draw pile</span>
                      </div>
                      <div
                        className={`claim-spot ${table.phase ? "has-card" : ""}`}
                        ref={tableTarget}
                      >
                        {table.phase || pendingCard !== null ? (
                          <div
                            key={`${table.play}-${pendingCard !== null}`}
                            className="table-card"
                          >
                            <CatCard back />
                            <span className="claim-label">
                              {pendingCard !== null
                                ? "Your move is pending"
                                : `${name(table.actor)} claims`}
                              <strong>
                                {
                                  CATS[
                                    pendingCard !== null ? claim : table.claim
                                  ].name
                                }
                              </strong>
                            </span>
                          </div>
                        ) : (
                          <div className="empty-spot">
                            <span>{table.status === 2 ? "♠" : "?"}</span>
                            {table.status === 2
                              ? "Well played."
                              : "The next story goes here."}
                          </div>
                        )}
                      </div>
                      <div className="table-aside">
                        <img
                          className="house-cat"
                          src="/memes/oiia.png"
                          alt=""
                        />
                        <span className="little-label">HOUSE CAT SAYS</span>
                        <p>
                          {table.phase === 2
                            ? "No peeking. Just a verdict."
                            : "Look innocent. Play suspicious."}
                        </p>
                      </div>
                    </div>
                    {outcome && (
                      <div
                        className={`verdict ${table.outcome === 3 ? "bluff-verdict" : ""}`}
                        role="status"
                      >
                        <img
                          src={CATS[table.outcome === 3 ? 4 : 2].image}
                          alt=""
                        />
                        <span>
                          <strong>
                            {table.outcome === 1
                              ? "Got away with it."
                              : table.outcome === 2
                                ? "Honest cat."
                                : table.outcome === 3
                                  ? "FAHH. Busted."
                                  : "Time’s up."}
                          </strong>
                          {outcome}
                          {mode === "practice" && table.outcome > 1 ? (
                            <small>
                              Practice result · checked locally, no ZK proof
                            </small>
                          ) : null}
                        </span>
                      </div>
                    )}
                    {mode === "live" && seat < 0 && (
                      <div className="join-seat">
                        {live.wallet.status !== "connected" ? (
                          <button
                            className="button primary"
                            onClick={() => void live.wallet.connect()}
                          >
                            Connect Lace to join
                          </button>
                        ) : table.status === 0 && table.players.length < 4 ? (
                          <button
                            className="button primary"
                            disabled={busy}
                            onClick={() => void live.act({ kind: "join" })}
                          >
                            Take a seat · Deal my cards
                          </button>
                        ) : (
                          <p>
                            This table has started or is full. You can watch its
                            public claims.
                          </p>
                        )}
                      </div>
                    )}
                    {myResponse && (
                      <div className="response-actions">
                        <button
                          className="button secondary"
                          disabled={busy}
                          onClick={() => void act("pass")}
                        >
                          Pass. I believe it.
                        </button>
                        <button
                          className="button coral"
                          disabled={busy}
                          onClick={() => void act("call")}
                        >
                          Call bluff!
                        </button>
                      </div>
                    )}
                    {myProof && (
                      <div className="response-actions">
                        <button
                          className="button primary"
                          disabled={busy}
                          onClick={() => void act("prove")}
                        >
                          {mode === "practice"
                            ? "Check the claim"
                            : "Prove the claim privately"}
                        </button>
                      </div>
                    )}
                    {table.status === 2 && (
                      <div className="response-actions">
                        <button
                          className="button primary"
                          onClick={() =>
                            mode === "practice"
                              ? startPractice(false)
                              : live.clearRoom()
                          }
                        >
                          Another game?
                        </button>
                      </div>
                    )}
                    {mode === "live" &&
                      seat >= 0 &&
                      table.phase > 0 &&
                      clock > table.deadline && (
                        <button
                          className="text-button"
                          disabled={busy}
                          onClick={() => void act("timeout")}
                        >
                          Settle the expired turn
                        </button>
                      )}
                  </div>
                  {seat >= 0 && (
                    <section
                      className="your-hand"
                      aria-label="Your private cards"
                    >
                      <div className="hand-heading">
                        <h2>
                          Your hand <span>{mine.length}</span>
                        </h2>
                        <span>Only on your screen</span>
                      </div>
                      <div
                        className="hand-scroll"
                        tabIndex={0}
                        role="region"
                        aria-label="Scroll your private hand"
                      >
                        <div className="hand">
                          {mine.map((cat, i) => (
                            <button
                              key={`${i}-${cat}`}
                              className={`hand-card ${selected === i ? "is-selected" : ""} ${pendingCard === i ? "pending-card" : ""}`}
                              style={
                                {
                                  "--i": i,
                                  "--count": Math.min(mine.length, 7),
                                } as CSSProperties
                              }
                              disabled={!myTurn || busy}
                              aria-pressed={selected === i}
                              aria-label={`Select ${CATS[cat].name}, card ${i + 1}`}
                              onClick={() => {
                                setSelected(i);
                                setClaim(cat);
                              }}
                            >
                              <CatCard cat={cat} />
                            </button>
                          ))}
                        </div>
                      </div>
                      {myTurn && (
                        <div className="play-controls">
                          <label htmlFor="cat-claim">I’m claiming…</label>
                          <select
                            id="cat-claim"
                            value={claim}
                            disabled={busy || selected === null}
                            onChange={(e) => setClaim(Number(e.target.value))}
                          >
                            {CATS.map((c, i) => (
                              <option key={c.name} value={i}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <button
                            className="button primary"
                            disabled={selected === null || busy}
                            onClick={() => void act("play")}
                          >
                            Play face down ↗
                          </button>
                          <span className="claim-hint">
                            {selected === null
                              ? "Pick a card first."
                              : mine[selected] === claim
                                ? "An honest play. Suspiciously honest."
                                : "That’s a bluff. Keep a straight face."}
                          </span>
                        </div>
                      )}
                    </section>
                  )}
                </>
              )
            )}
            {busy && (
              <div className="transaction-status" role="status">
                <span className="spinner" />
                <div>
                  <strong>{stageCopy[live.stage]}</strong>
                  <p>
                    {Math.max(0, Math.floor((clock - live.started) / 1000))}s ·
                    Your move counts after confirmation. Keep this tab open.
                    {live.stage === "proving"
                      ? " A sleeping hosted prover can take longer to wake up."
                      : ""}
                  </p>
                </div>
              </div>
            )}
            {(live.error || live.readError) && mode === "live" && (
              <div className="error-message" role="alert">
                {live.error || live.readError}
                <button
                  className="text-button"
                  onClick={() => void live.refresh()}
                >
                  Refresh table
                </button>
              </div>
            )}
            {live.result && mode === "live" && !busy && (
              <div className="receipt">
                Move confirmed in {Math.round(live.result.milliseconds / 1000)}s
                · Block {live.result.blockHeight}
                <details>
                  <summary>Transaction receipt</summary>
                  <code>{live.result.txId}</code>
                </details>
              </div>
            )}
          </section>
        )}
      </main>
      <footer>
        <span>A card game. A cat problem. A very good time.</span>
        <button className="text-button" onClick={() => setModal("privacy")}>
          What stays private?
        </button>
        <a
          href="https://github.com/ashuujha/cat-bluff"
          target="_blank"
          rel="noreferrer"
        >
          Source ↗
        </a>
      </footer>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {modal === "rules" && (
        <Dialog
          title="Small rules. Big trust issues."
          onClose={() => setModal(null)}
        >
          {mode === "practice" || mode === "live" ? (
            <>
              <ol className="rules-list">
                <li>
                  <strong>Five cards each.</strong> Your hand contains random
                  meme cats. Repeats are allowed.
                </li>
                <li>
                  <strong>Play one face down.</strong> Announce a cat. You’re
                  allowed to lie about it.
                </li>
                <li>
                  <strong>The next player decides.</strong> Pass, or call bluff.
                  With more players, each gets a response turn.
                </li>
                <li>
                  <strong>Challenge? Settle it.</strong> Truth: the challenger
                  draws two. Bluff: the player who lied draws two.
                </li>
                <li>
                  <strong>First empty hand wins.</strong> Your last claim must
                  be passed or settled before you win.
                </li>
              </ol>
              <p className="notice">
                This earlier five-cat version uses a draw-two penalty. Live
                turns need a Midnight transaction. Practice is instant.
              </p>
              <button
                className="button primary"
                disabled={busy}
                onClick={() => startPractice()}
              >
                Got it. Let me try.
              </button>
            </>
          ) : (
            <ClassicRules />
          )}
        </Dialog>
      )}
      {modal === "invite" && (
        <Dialog title="Invite your accomplices." onClose={() => setModal(null)}>
          {mode === "live" && table ? (
            <>
              <p>
                Send this link to 1–3 friends. They connect Lace on Preprod and
                choose “Take a seat.” Start after everyone has joined.
              </p>
              <label className="field-label" htmlFor="invite-link">
                Public table invitation
              </label>
              <input
                id="invite-link"
                className="invite-input"
                readOnly
                value={invite}
                onFocus={(e) => e.target.select()}
              />
              <div className="dialog-actions">
                <button
                  className="button primary"
                  onClick={() => void copyInvite()}
                >
                  Copy invite
                </button>
                {!!navigator.share && (
                  <button
                    className="button secondary"
                    onClick={() =>
                      void navigator
                        .share({
                          title: "Join my Cat Bluff table",
                          url: invite,
                        })
                        .catch(() => {})
                    }
                  >
                    Share…
                  </button>
                )}
              </div>
              <p className="quiet">
                Only the table ID and contract address are shared. Your cards
                and wallet secrets stay out of the link.
              </p>
            </>
          ) : (
            <>
              <p>
                Create a live table to invite friends. Miso is a local practice
                bot.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setMode("live");
                  setModal(null);
                }}
              >
                Play with friends
              </button>
            </>
          )}
        </Dialog>
      )}
      {modal === "privacy" && (
        <Dialog
          title="A verdict. Not your whole hand."
          onClose={() => setModal(null)}
        >
          {mode === "practice" || mode === "live" ? (
            <>
              <p>
                Everyone sees player IDs, hand sizes, turns, your announced cat,
                and the result of a challenge. The played card and remaining
                hand are stored as salted commitments.
              </p>
              <p>
                A live proof checks the committed card. A true claim confirms
                that cat’s identity. A false claim rules out the announced cat;
                it does not name the actual cat. The rest of your hand stays
                hidden from on-chain observers.
              </p>
              <p>
                Private cards live in this browser. A remote proof service
                receives the inputs needed to prove them, so it must be trusted;
                use a local prover for device-only proving.
              </p>
              <p className="notice">
                MVP limits: the browser draws the cards; fair random dealing is
                not yet proved on-chain. Practice runs locally and creates no ZK
                proofs. There are no money stakes.
              </p>
            </>
          ) : (
            <ClassicPrivacy />
          )}
        </Dialog>
      )}
      {modal === "settings" && (
        <Dialog title="Table settings" onClose={() => setModal(null)}>
          <p>Cat Bluff · Midnight {live.wallet.networkId}</p>
          <p className="quiet">
            Live turns have a 20-minute response or proof window to allow for
            wallet and network delays. If a player misses a proof, they draw
            two. Silence is a timeout, not proof of a lie.
          </p>
          {live.wallet.status === "connected" ? (
            <>
              <p>
                Wallet connected.{" "}
                {live.wallet.dustBalance &&
                  `Available tDUST: ${live.wallet.dustBalance.balance.toString()}`}
              </p>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => live.wallet.disconnect()}
              >
                Disconnect wallet
              </button>
            </>
          ) : (
            <button
              className="button secondary"
              onClick={() => void live.wallet.connect()}
            >
              Connect Lace
            </button>
          )}
          <label className="field-label">Cat Bluff contract</label>
          <code className="address">{live.contract || "Not deployed yet"}</code>
          {import.meta.env.DEV && !live.contract && (
            <button
              className="button primary"
              disabled={!live.wallet.connectedAPI || busy}
              onClick={() => void live.deploy()}
            >
              Deploy Cat Bluff with Lace
            </button>
          )}
          {live.contract &&
            !import.meta.env.VITE_CAT_BLUFF_CONTRACT_ADDRESS && (
              <p className="notice">
                New address saved locally. Set VITE_CAT_BLUFF_CONTRACT_ADDRESS
                to this address for the hosted release.
              </p>
            )}
          <p>
            Keep this browser’s storage: it holds your private hand and card
            openings. Losing it may mean you can’t finish a game.
          </p>
          {mode === "live" && (
            <button
              className="text-button"
              disabled={busy}
              onClick={() => {
                live.clearRoom();
                setModal(null);
              }}
            >
              Open a new table
            </button>
          )}
          {live.error && (
            <p role="alert" className="error-message">
              {live.error}
            </p>
          )}
          {busy && (
            <p role="status">
              {stageCopy[live.stage]} ·{" "}
              {Math.max(0, Math.floor((clock - live.started) / 1000))}s
            </p>
          )}
        </Dialog>
      )}
    </div>
  );
}
