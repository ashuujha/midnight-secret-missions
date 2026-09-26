import { useEffect, useState } from "react";
import { CatCard } from "./CatCard";
import { DECK } from "../game/classic-cards";
import { CATS } from "../game/cat-bluff";
import { curiousCat, reactMeme } from "../game/sound";
import { readClassicInvite } from "../game/classic-invite";
import {
  freshMemeLineup,
  rememberMemeLineup,
  MEMES,
  type MemeId,
} from "../game/memes";
const reactions: MemeId[] = ["pop", "huh", "polite", "oiia", "crying"];
const bios = [
  "No thoughts. Just POP.",
  "Asks questions. Trusts nobody.",
  "The face of a repeat offender.",
  "Slips out of every accusation.",
  "Already preparing an apology.",
];
export function ArcadeHome({
  onPractice,
  onFriends,
  sound,
}: {
  onPractice: () => void;
  onFriends: () => void;
  sound: boolean;
}) {
  const [suspect, setSuspect] = useState(0);
  const [lineup, setLineup] = useState(() =>
    freshMemeLineup("cat-bluff-hero-cats", 3),
  );
  useEffect(() => rememberMemeLineup("cat-bluff-hero-cats", lineup), [lineup]);
  const [joinOpen, setJoinOpen] = useState(false);
  const [invite, setInvite] = useState("");
  const [joinError, setJoinError] = useState("");
  function joinRoom() {
    try {
      const url = new URL(invite.trim(), location.origin);
      if (url.origin !== location.origin || !readClassicInvite(url.search))
        throw new Error();
      location.assign(url.href);
    } catch {
      setJoinError("Paste a Cat Bluff invitation link from a friend.");
    }
  }
  return (
    <div className="arcade-home">
      <section className="arcade-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="mood-label">
            <img src="/memes/huh.jpg" alt="" /> A PARTY GAME WITH TRUST ISSUES
          </span>
          <h1 id="hero-title">
            Cute faces.
            <br />
            <span>Questionable claims.</span>
          </h1>
          <p>
            A private bluffing game for 2–4 suspicious friends.
            <br />
            52 cats. One very risky pile.
          </p>
          <div className="hero-actions">
            <button className="button primary hero-play" onClick={onFriends}>
              Create room <span aria-hidden="true">↗</span>
            </button>
            <button
              className="button secondary"
              onClick={() => setJoinOpen(!joinOpen)}
            >
              Join room <span aria-hidden="true">↗</span>
            </button>
          </div>
          {joinOpen && (
            <div className="join-box">
              <label htmlFor="invite-link">Invitation link</label>
              <div>
                <input
                  id="invite-link"
                  value={invite}
                  onChange={(e) => {
                    setInvite(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Paste the link your friend sent"
                />
                <button className="button primary" onClick={joinRoom}>
                  Join table
                </button>
              </div>
              {joinError && <p role="alert">{joinError}</p>}
            </div>
          )}
          <button className="text-button learn-link" onClick={onPractice}>
            Learn in one hand · practice with bots ↗
          </button>
          <div className="hero-notes">
            <span>INSTANT PRACTICE</span>
            <i />
            2–4 PLAYERS
            <i />
            100% SUSPICIOUS
          </div>
          <a className="scroll-nudge" href="#suspects">
            Meet your extremely innocent cards <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-scene" aria-label="Interactive cat-card stack">
          <div className="scene-board">
            <span className="board-corner">NO PEEKING.</span>
            <span className="board-corner lower">CAT BLUFF SOCIAL CLUB</span>
          </div>
          <span className="hero-stamp">
            CERTIFIED
            <br />
            <b>
              LITTLE
              <br />
              LIARS
            </b>
          </span>
          <div className="scene-cards">
            {lineup.map((cat, i) => (
              <button
                key={cat}
                className={`scene-card scene-card-${i}`}
                data-meme-silent
                aria-label={`React with ${MEMES[cat].name}`}
                onClick={() => reactMeme(cat, sound, undefined, 2200)}
              >
                <CatCard
                  face={{
                    ...DECK[[43, 20, 48][i]],
                    name: MEMES[cat].name,
                    image: MEMES[cat].image,
                    quote: MEMES[cat].caption,
                  }}
                />
              </button>
            ))}
          </div>
          <button
            className="hero-peeker"
            data-meme-silent
            aria-label="Make OIIA Cat spin"
            onClick={() => reactMeme("oiia", sound)}
          >
            <img src="/memes/oiia.png" alt="OIIA Cat" />
            <span>click me. trust me.</span>
          </button>
          <span className="hero-speech">
            “that is definitely
            <br />
            two Queens.”
          </span>
          <button
            className="lineup-shuffle"
            onClick={() => {
              setLineup(freshMemeLineup("cat-bluff-hero-cats", 3));
              curiousCat(sound);
            }}
          >
            New suspects <span aria-hidden="true">↻</span>
          </button>
        </div>
      </section>
      <div className="arcade-ticker" aria-hidden="true">
        <div>
          <span>PLAY A CAT</span>
          <img src="/memes/pop.png" alt="" />
          <span>TELL A LIE</span>
          <img src="/memes/huh.jpg" alt="" />
          <span>CALL A BLUFF</span>
          <img src="/memes/crying.png" alt="" />
          <span>LOSE YOUR FRIENDS*</span>
          <img src="/memes/polite.jpg" alt="" />
        </div>
        <small>*temporarily. probably.</small>
      </div>
      <section
        className="suspect-section"
        id="suspects"
        aria-labelledby="suspect-title"
      >
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">THE LINEUP</span>
            <h2 id="suspect-title">A deck full of alibis.</h2>
          </div>
          <p>
            Tap a suspect. Get acquainted.
            <br />
            They’ll be in your hand in a minute.
          </p>
        </div>
        <div className="suspect-lineup">
          {CATS.map((c, i) => (
            <button
              key={c.name}
              data-reveal
              data-reveal-order={i}
              className={`suspect suspect-${i} ${suspect === i ? "chosen" : ""}`}
              aria-label={`Meet ${c.name}`}
              aria-pressed={suspect === i}
              data-meme-silent
              onClick={() => {
                setSuspect(i);
                reactMeme(reactions[i], sound);
              }}
            >
              <span className="suspect-file">SUSPECT 0{i + 1}</span>
              <img src={c.image} alt="" loading="lazy" />
              <strong>{c.name}</strong>
              <span className="suspect-verdict">
                {i === suspect ? "UNDER INVESTIGATION" : "LOOKS INNOCENT"}
              </span>
            </button>
          ))}
        </div>
        <div className="suspect-caption" aria-live="polite">
          <span>{CATS[suspect].name}</span> {bios[suspect]}
          <small>52 different cat faces. 13 ranks. Four of each.</small>
        </div>
      </section>
      <section className="how-section" aria-labelledby="how-title">
        <div className="how-title" data-reveal>
          <span className="eyebrow">THE ENTIRE RULEBOOK</span>
          <h2 id="how-title">The game in three moves.</h2>
          <div className="scroll-cat">
            <img
              src="/memes/oiia.png"
              alt="OIIA Cat rolling as you scroll"
              loading="lazy"
            />
            <span>scrolling? i'm rolling.</span>
          </div>
        </div>
        <ol className="how-cards">
          <li data-reveal>
            <span className="step-number">01</span>
            <div>
              <h3>Drop a cat.</h3>
              <p>Play one or more cards face down. Your hand stays yours.</p>
            </div>
            <img src="/memes/pop.png" alt="" loading="lazy" />
          </li>
          <li data-reveal>
            <span className="step-number">02</span>
            <div>
              <h3>Sell the story.</h3>
              <p>
                Claim the required rank. Tell the truth, or lie with confidence.
              </p>
            </div>
            <img src="/memes/polite.jpg" alt="" loading="lazy" />
          </li>
          <li data-reveal>
            <span className="step-number">03</span>
            <div>
              <h3>Risk the “huh?”</h3>
              <p>
                Opponents trust or call BLUFF! Wrong side takes the whole pile.
                Your last claim must survive before you win.
              </p>
            </div>
            <img src="/memes/huh.jpg" alt="" loading="lazy" />
          </li>
        </ol>
      </section>
      <section className="curiosity-section" aria-labelledby="curiosity-title">
        <div data-reveal>
          <span className="eyebrow">A HEALTHY AMOUNT OF SUSPICION</span>
          <h2 id="curiosity-title">Wait. Can I actually do that?</h2>
          <p>Ask the important questions. The cats have opinions.</p>
        </div>
        <div className="curiosity-questions" data-reveal>
          {[
            [
              "Can I play a King and call it a Queen?",
              "Absolutely. Select any rank from your hand. Your claim always uses the required rank; your opponents decide whether to trust you. Get caught and the entire pile is yours.",
            ],
            [
              "Did that reaction just give away a card?",
              "Nope. Cat reactions are picked at random, independently of the cards and whether someone lied. A familiar cat is a coincidence. Trust nobody.",
            ],
            [
              "What if I call BLUFF and I’m wrong?",
              "Only the last submitted cards turn face up. If every card matches the claim, you take the entire pile. If even one doesn’t, the player who made the claim takes it.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary
                onClick={(event) => {
                  if (
                    !(event.currentTarget.parentElement as HTMLDetailsElement)
                      .open
                  )
                    curiousCat(sound);
                }}
              >
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="last-call" data-reveal>
        <img
          className="last-smudge"
          src="/memes/smudge.jpg"
          alt="Smudge judging the table"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">YOUR POKER FACE IS LOADING…</span>
          <h2>Deal me in. I look innocent.</h2>
          <button className="button primary" onClick={onPractice}>
            Deal me a practice hand <span aria-hidden="true">↗</span>
          </button>
        </div>
        <span className="last-sticker">
          NO WALLET.
          <br />
          NO WAIT.
          <br />
          <b>JUST CATS.</b>
        </span>
      </section>
    </div>
  );
}
