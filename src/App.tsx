import { useEffect, useRef, useState } from 'react';
import { CONTRACT_ADDRESS, MIDNIGHT_NETWORK } from './hooks/useMidnight';
import { configured, useLiveGame } from './hooks/useLiveGame';
import type { GameAction, Player } from './midnight/game';
import {
  Cat,
  CardBack,
  LocationCard,
  PlaceArt,
  type CatMood,
} from './components/GameArt';
import { Dialog } from './components/Dialog';
import {
  PLACES,
  ROUTES,
  dealPractice,
  practiceAction,
  routeProgress,
  shuffleHand,
  type PracticeGame,
} from './game/table';
import { playSound, type Sound } from './game/sound';

const short = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
const clock = (deadline: number | null, now: number) => {
  const seconds = Math.max(0, Math.ceil(((deadline ?? now) - now) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};
const randomMission = () =>
  crypto.getRandomValues(new Uint8Array(1))[0] % ROUTES.length;
function preference(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function storePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
}

type Modal = 'rules' | 'privacy' | 'wallet' | 'forfeit' | null;
export default function App() {
  const live = useLiveGame();
  const { wallet } = live;
  const [mode, setMode] = useState<'live' | 'practice'>('live');
  const [practice, setPractice] = useState<PracticeGame | null>(null);
  const [theme, setTheme] = useState(() =>
    preference('secret-trail:theme', 'light') === 'dark' ? 'dark' : 'light',
  );
  const [sound, setSound] = useState(
    () => preference('secret-trail:sound', 'off') === 'on',
  );
  const [modal, setModal] = useState<Modal>(null);
  const [challengeTarget, setChallengeTarget] = useState<Player | null>(null);
  const [hand, setHand] = useState(() => shuffleHand());
  const [deal, setDeal] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [peek, setPeek] = useState(true);
  const [activeTab, setActiveTab] = useState<'trails' | 'scores'>('trails');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const practiceLock = useRef(false);
  const soundEnabled = useRef(sound);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#222b29' : '#f8f5ed');
    storePreference('secret-trail:theme', theme);
  }, [theme]);
  useEffect(() => {
    soundEnabled.current = sound;
    storePreference('secret-trail:sound', sound ? 'on' : 'off');
  }, [sound]);
  useEffect(() => {
    if (live.busy) setStartedAt(Date.now());
    else setStartedAt(null);
  }, [live.busy]);

  const isPractice = mode === 'practice';
  const player = isPractice ? practice?.player : live.player;
  const route = isPractice
    ? practice
      ? ROUTES[practice.mission]
      : null
    : live.route;
  const progress = routeProgress(player?.visits ?? [], route ?? []);
  const expired =
    !!player &&
    player.challengeStatus === 1 &&
    player.challengeDeadline !== null &&
    live.now >= player.challengeDeadline;
  const canAct = isPractice || live.canPlay;
  const canVisit =
    canAct &&
    !!player &&
    player.runStatus === 0 &&
    player.visits.length < 5 &&
    !expired;
  const canClaim =
    canAct &&
    !!player &&
    player.runStatus === 0 &&
    progress.complete &&
    !expired;
  const settled = !!player && player.runStatus !== 0;
  const opponents = isPractice
    ? practice
      ? [practice.bot]
      : []
    : (live.snapshot?.players.filter((p) => p.id !== live.player?.id) ?? []);
  const allPlayers = isPractice
    ? practice
      ? [practice.player, practice.bot]
      : []
    : (live.snapshot?.players ?? []);
  const scores = [...allPlayers]
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
  const mood: CatMood =
    player?.runStatus === 1
      ? 'happy'
      : player?.runStatus === 2 || (player && !progress.possible)
        ? 'panic'
        : player?.challengeStatus === 1
          ? 'watching'
          : 'smug';
  const catLine =
    player?.runStatus === 1
      ? 'Proof served. Ego damaged.'
      : player?.runStatus === 2
        ? 'We do not talk about that round.'
        : player && !progress.possible
          ? 'Bestie. The math is not mathing.'
          : player?.challengeStatus === 1
            ? 'That is a suspicious amount of walking.'
            : selected !== null
              ? `${PLACES[selected].name}? Interesting alibi.`
              : 'I trust you. That was a lie.';
  const cue = (value: Sound) => {
    if (soundEnabled.current) playSound(value);
  };
  const redeal = () => {
    setHand(shuffleHand());
    setDeal((d) => d + 1);
    setSelected(null);
    setPeek(true);
    cue('deal');
  };
  const switchMode = (next: 'live' | 'practice') => {
    if (live.busy) return;
    setMode(next);
    setSelected(null);
    setChallengeTarget(null);
    if (next === 'practice' && !practice) {
      setPractice(dealPractice(randomMission()));
      redeal();
    }
  };
  const act = async (action: GameAction, label: string) => {
    if (isPractice) {
      if (practiceLock.current) return;
      practiceLock.current = true;
      try {
        if (action.kind === 'join' || action.kind === 'nextRound') {
          setPractice(dealPractice(randomMission(), practice ?? undefined));
          redeal();
        } else if (practice) {
          const next = practiceAction(practice, action, Date.now());
          if (next === practice) return;
          setPractice(next);
          setSelected(null);
          cue(
            action.kind === 'claim'
              ? 'win'
              : action.kind === 'challenge'
                ? 'challenge'
                : action.kind === 'forfeit'
                  ? 'oops'
                  : next.player.challengeStatus === 1 &&
                      practice.player.challengeStatus === 0
                    ? 'challenge'
                    : 'play',
          );
        }
      } finally {
        practiceLock.current = false;
      }
      return;
    }
    const success = await live.perform(action, label);
    if (success) {
      setSelected(null);
      if (action.kind === 'join' || action.kind === 'nextRound') redeal();
      else
        cue(
          action.kind === 'claim'
            ? 'win'
            : action.kind === 'challenge'
              ? 'challenge'
              : action.kind === 'forfeit'
                ? 'oops'
                : 'play',
        );
    } else cue('oops');
  };
  const join = () => {
    if (!isPractice && wallet.status !== 'connected') {
      setModal('wallet');
      return;
    }
    void act({ kind: 'join' }, 'Dealing your secret mission');
  };
  const playerName = (entry: Player) =>
    entry.id === player?.id
      ? 'You'
      : entry.id === 'miso'
        ? 'Miso'
        : `Player ${entry.id.slice(0, 5)}`;
  const canChallenge = (entry: Player) =>
    canAct &&
    !!player &&
    player.id !== entry.id &&
    player.challengeTokens > 0 &&
    entry.runStatus === 0 &&
    entry.visits.length > 0 &&
    entry.challengeStatus === 0;
  const canResolve = (entry: Player) =>
    canAct &&
    !!player &&
    entry.challengeStatus === 1 &&
    entry.challengeDeadline !== null &&
    live.now >= entry.challengeDeadline;

  return (
    <div className="app-shell">
      <a href="#game" className="skip-link">
        Skip to game
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Secret Trail home">
          <span className="brand-cat">
            <Cat />
          </span>
          <span>
            secret<span>trail.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#game">Play the game</a>
          <button onClick={() => setModal('rules')}>How to play</button>
          <a href="#clubhouse">The clubhouse</a>
        </nav>
        <div className="header-controls">
          <button
            className="setting-button"
            aria-label={sound ? 'Mute sound effects' : 'Enable sound effects'}
            aria-pressed={sound}
            onClick={() => {
              setSound(!sound);
              if (!sound) playSound('deal');
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M4 9h4l5-4v14l-5-4H4Z" />
              {sound ? (
                <path d="M16 8q5 4 0 8m3-12q9 8 0 16" />
              ) : (
                <path d="m17 9 5 6m0-6-5 6" />
              )}
            </svg>
            <span>Sound {sound ? 'on' : 'off'}</span>
          </button>
          <button
            className="setting-button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              {theme === 'light' ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
                </>
              ) : (
                <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />
              )}
            </svg>
            <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>
          <button
            className="wallet-chip"
            disabled={live.busy}
            onClick={() => setModal('wallet')}
          >
            <span
              className={`status-dot ${wallet.status === 'connected' ? 'connected' : ''}`}
            />
            {wallet.status === 'connected'
              ? 'Wallet connected'
              : 'Connect wallet'}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="intro">
          <div>
            <p className="eyebrow">
              <span className="tiny-card" /> A GAME OF VERY INNOCENT DETOURS
            </p>
            <h1>
              Nice moves.
              <br />
              <span>What's the catch?</span>
            </h1>
          </div>
          <div className="intro-copy">
            <p>
              Three secret stops. Five public cards.
              <br />
              Play your route. Throw in a little chaos.
              <br />
              <strong>Give them something to doubt.</strong>
            </p>
            <button className="text-button" onClick={() => setModal('rules')}>
              Learn the game in 30 seconds <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="intro-sticker" aria-hidden="true">
            <span>
              trust issues?
              <br />
              you're in.
            </span>
            <Cat mood="watching" />
            <span className="sticker-caption">BRING YOUR POKER FACE.</span>
          </div>
        </section>

        <section
          id="game"
          className="game-section"
          aria-label="Secret Trail card table"
        >
          <div className="game-toolbar">
            <div
              className="mode-switch"
              role="group"
              aria-label="Choose game mode"
            >
              <button
                aria-pressed={!isPractice}
                disabled={live.busy}
                onClick={() => switchMode('live')}
              >
                Live table <span className="live-dot" />
              </button>
              <button
                aria-pressed={isPractice}
                disabled={live.busy}
                onClick={() => switchMode('practice')}
              >
                Practice with Miso
              </button>
            </div>
            <span className="table-label">
              {isPractice
                ? 'JUST YOU & ONE VERY JUDGY CAT'
                : `${MIDNIGHT_NETWORK.toUpperCase()} · ${live.snapshot ? `${live.snapshot.joined} PLAYERS DEALT IN` : 'CONNECTING TO THE TABLE'}`}
            </span>
          </div>
          {isPractice && (
            <div className="practice-banner">
              <strong>Practice table</strong>
              <span>
                Miso is a bot. Moves and points stay in this tab; no wallet or
                ZK proofs.
              </span>
              <button onClick={() => switchMode('live')}>
                Play for real →
              </button>
            </div>
          )}
          {!isPractice && live.snapshotError && (
            <div className="notice error" role="alert">
              <div>
                <strong>The table is having a moment.</strong>
                <p>{live.snapshotError}</p>
              </div>
              <button
                className="small-button"
                onClick={() => void live.refresh()}
              >
                Retry
              </button>
            </div>
          )}
          {!isPractice && !configured && (
            <div className="notice" role="status">
              <div>
                <strong>The live table isn't open yet.</strong>
                <p>
                  A deployed Secret Trail contract needs to be configured.
                  Practice is ready to play.
                </p>
              </div>
              {import.meta.env.DEV && wallet.status === 'connected' && (
                <button
                  className="small-button"
                  disabled={live.busy}
                  onClick={() => void live.deployLocally()}
                >
                  Deploy with Lace
                </button>
              )}
            </div>
          )}
          {live.deployedAddress && (
            <div className="notice" role="status">
              <div>
                <strong>Contract deployed</strong>
                <code>{live.deployedAddress}</code>
              </div>
              <button onClick={() => location.reload()}>Reload</button>
            </div>
          )}

          <div className="game-layout">
            <div className="main-table">
              <div className="felt">
                <div className="table-topline">
                  <div>
                    <span className="eyebrow">
                      EVERYONE CAN SEE THESE CARDS
                    </span>
                    <h2>Your public trail</h2>
                  </div>
                  <span className="round-tag">
                    ROUND {String(player?.round ?? 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="table-seats">
                  <div className="opponent-avatar">
                    <Cat
                      mood={
                        opponents[0]?.runStatus === 2 ? 'panic' : 'watching'
                      }
                    />
                  </div>
                  <div>
                    <strong>
                      {isPractice
                        ? 'Miso is watching your moves.'
                        : opponents.length
                          ? `${opponents.length} other ${opponents.length === 1 ? 'player is' : 'players are'} at the table.`
                          : 'A good bluff deserves an audience.'}
                    </strong>
                    <span>
                      {isPractice
                        ? 'Practice opponent · professional side-eye'
                        : opponents.length
                          ? 'Take a look at their trails in the clubhouse.'
                          : 'Invite a friend. Their public trail will appear below.'}
                    </span>
                  </div>
                  {isPractice && practice && (
                    <span className="seat-score">
                      MISO <b>{practice.bot.score}</b> / YOU{' '}
                      <b>{practice.player.score}</b>
                    </span>
                  )}
                </div>
                <div
                  className={`public-trail ${!player ? 'undealt' : ''}`}
                  aria-label={`Your public trail: ${player?.visits.length ?? 0} of 5 moves`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="trail-slot" key={`${player?.round}-${i}`}>
                      {player?.visits[i] !== undefined ? (
                        <div className="played-card">
                          <LocationCard
                            location={player.visits[i]}
                            index={i}
                            mini
                          />
                        </div>
                      ) : (
                        <div className="empty-slot">
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <small>
                            {!player && i === 2
                              ? 'YOUR STORY GOES HERE'
                              : 'PLAY A CARD'}
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                  {!player && (
                    <div className="table-welcome">
                      <span className="welcome-tag">THE TABLE IS YOURS.</span>
                      <h3>
                        A little bluff.
                        <br />A perfect alibi.
                      </h3>
                      <p>
                        Get your secret mission.
                        <br />
                        Make five moves. Keep them guessing.
                      </p>
                      <button
                        className="button-primary"
                        onClick={join}
                        disabled={
                          !isPractice &&
                          wallet.status === 'connected' &&
                          !live.canPlay
                        }
                      >
                        {!isPractice && wallet.status !== 'connected'
                          ? 'Connect & play'
                          : 'Deal me in'}{' '}
                        <span aria-hidden="true">↗</span>
                      </button>
                      {!isPractice && (
                        <button
                          className="welcome-practice"
                          onClick={() => switchMode('practice')}
                        >
                          Just looking? Try a practice round
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="table-bottomline">
                  <span>
                    {player
                      ? `${player.visits.length} of 5 cards on the table`
                      : '3 secret stops + 2 decoys = your perfect cover'}
                  </span>
                  <span className="table-stamp">LOOK CASUAL.</span>
                </div>
                {settled && (
                  <div className="round-result" role="status">
                    <strong>
                      {player.runStatus === 1
                        ? isPractice
                          ? 'Practice route checked. +1 point.'
                          : 'Alibi accepted. +1 point.'
                        : 'Round over. Fresh cards, fresh start.'}
                    </strong>
                    <span>
                      {player.runStatus === 1
                        ? 'Your secret stays off the table.'
                        : 'Your next mission is waiting.'}
                    </span>
                  </div>
                )}
                {player?.challengeStatus === 1 && player.runStatus === 0 && (
                  <div className="challenge-ribbon" role="status">
                    <strong>
                      {isPractice
                        ? 'Miso called your bluff!'
                        : 'Someone called your bluff!'}
                    </strong>
                    <span>
                      {expired
                        ? 'Time is up. This run cannot be claimed.'
                        : 'Finish your trail and back it up.'}
                    </span>
                    <b>{clock(player.challengeDeadline, live.now)}</b>
                  </div>
                )}
              </div>

              <div className="hand-area">
                <div className="hand-heading">
                  <div>
                    <h3>
                      {settled
                        ? 'A fresh alibi is one deal away.'
                        : 'Your hand. Your little secret.'}
                    </h3>
                    <p>
                      {player
                        ? 'Pick a card, then play it onto your public trail. Location cards can be reused.'
                        : 'Five places to go. Eight possible secret missions. One very suspicious you.'}
                    </p>
                  </div>
                  <span className="hand-badge">5 LOCATION CARDS</span>
                </div>
                <div
                  className={`card-hand ${canVisit ? 'playable' : ''}`}
                  key={deal}
                >
                  {hand.map((place, i) => (
                    <LocationCard
                      key={place}
                      location={place}
                      index={i}
                      selected={selected === place}
                      disabled={!canVisit}
                      onClick={() => {
                        setSelected(place);
                        cue('play');
                      }}
                    />
                  ))}
                </div>
                <div className="hand-action">
                  <span className="hand-hint">
                    {live.busy
                      ? 'Your move is being checked. Hold that poker face.'
                      : !player
                        ? 'Everyone gets the same move budget. The mission is yours alone.'
                        : settled
                          ? player.runStatus === 1
                            ? 'One point. Zero spilled secrets. Nicely played.'
                            : 'Bad round? Happens to the most suspicious of us.'
                          : expired
                            ? 'The challenge clock ran out. Settle this round to play again.'
                            : !progress.possible
                              ? 'Your secret route no longer fits. Fold this round and try again.'
                              : player.visits.length === 5
                                ? 'All cards down. Time to back up your story.'
                                : selected === null
                                  ? 'Tap a location card to choose your next move.'
                                  : `${PLACES[selected].caption} Ready to make that your next public move?`}
                  </span>
                  {settled ? (
                    <button
                      className="button-primary"
                      disabled={!canAct}
                      onClick={() =>
                        void act({ kind: 'nextRound' }, 'Dealing a fresh round')
                      }
                    >
                      Deal next round ↗
                    </button>
                  ) : player && player.visits.length === 5 ? (
                    <button
                      className="button-primary"
                      disabled={!canClaim}
                      onClick={() =>
                        void act({ kind: 'claim' }, 'Backing up your story')
                      }
                    >
                      {isPractice
                        ? 'Check my route'
                        : 'Prove it. Take the point.'}{' '}
                      ↗
                    </button>
                  ) : (
                    <button
                      className="button-primary"
                      disabled={!canVisit || selected === null}
                      onClick={() =>
                        selected !== null &&
                        void act(
                          { kind: 'visit', location: selected },
                          `Playing ${PLACES[selected].name}`,
                        )
                      }
                    >
                      {selected === null
                        ? 'Pick your next card'
                        : `Play ${PLACES[selected].name}`}{' '}
                      <span aria-hidden="true">↗</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <aside className="briefing" aria-label="Your private mission">
              <div className="briefing-heading">
                <span className="eyebrow">FOR YOUR EYES ONLY</span>
                <button
                  className="text-button"
                  onClick={() => setPeek(!peek)}
                  aria-pressed={!peek}
                  aria-label={
                    peek ? 'Hide secret mission' : 'Show secret mission'
                  }
                >
                  {peek ? 'Hide' : 'Peek'}
                </button>
              </div>
              <h2>The secret bit.</h2>
              <p className="briefing-subtitle">
                Visit these three places <strong>in this order.</strong>
                <br /> Mix in two extra moves as decoys.
              </p>
              <div className="secret-cards">
                {player && route && peek ? (
                  route.map((place, i) => (
                    <div
                      className={`secret-stop ${i < progress.matched ? 'done' : ''}`}
                      key={i}
                    >
                      <span className="secret-order">
                        {i < progress.matched ? '✓' : i + 1}
                      </span>
                      <div className={`secret-art ${PLACES[place].color}`}>
                        <PlaceArt place={place} />
                      </div>
                      <div>
                        <small>
                          {i < progress.matched
                            ? 'VISITED'
                            : `SECRET STOP ${i + 1}`}
                        </small>
                        <strong>{PLACES[place].name}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="secret-fan">
                    {[1, 2, 3].map((n) => (
                      <CardBack number={n} key={n} small />
                    ))}
                  </div>
                )}
              </div>
              {!player && (
                <p className="sealed-note">
                  A sealed mission, just for you.
                  <br />
                  Join the table to open it.
                </p>
              )}
              {player && !peek && (
                <p className="sealed-note">
                  Poker face mode. Tap Peek to look.
                </p>
              )}
              <div className="budget-row">
                <div>
                  <strong>Decoy moves</strong>
                  <small>
                    {player
                      ? `${progress.decoysLeft} of 2 left · private`
                      : 'Two chances to throw them off'}
                  </small>
                </div>
                <div
                  className="tokens"
                  aria-label={`${player ? progress.decoysLeft : 2} decoy moves remaining`}
                >
                  {[0, 1].map((n) => (
                    <span
                      key={n}
                      className={
                        n < (player ? progress.decoysLeft : 2) ? '' : 'spent'
                      }
                    >
                      D
                    </span>
                  ))}
                </div>
              </div>
              <div className="budget-row">
                <div>
                  <strong>Call-bluff tokens</strong>
                  <small>Stake one. Make them prove it.</small>
                </div>
                <div
                  className="tokens challenge-tokens"
                  aria-label={`${player?.challengeTokens ?? 3} challenge tokens`}
                >
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className={
                        n < (player?.challengeTokens ?? 3) ? '' : 'spent'
                      }
                    >
                      ?
                    </span>
                  ))}
                </div>
              </div>
              <div className="score-slip">
                <span>YOUR {isPractice ? 'PRACTICE ' : ''}SCORE</span>
                <strong>
                  {String(player?.score ?? 0).padStart(2, '0')}
                  <small>pts</small>
                </strong>
              </div>
              <div className="cat-commentary">
                <div className="speech-bubble" key={catLine}>
                  {catLine}
                </div>
                <Cat mood={mood} />
                <span>MISO, UNOFFICIAL TABLE JUDGE</span>
              </div>
              {player && player.runStatus === 0 && (
                <button
                  className="fold-button"
                  disabled={!canAct || live.busy}
                  onClick={() => setModal('forfeit')}
                >
                  Fold this round
                </button>
              )}
              {!player && (
                <button
                  className="text-button briefing-rules"
                  onClick={() => setModal('rules')}
                >
                  Wait, how does this work? →
                </button>
              )}
            </aside>
          </div>

          {live.busy && (
            <div
              className="transaction-progress"
              role="status"
              aria-live="polite"
            >
              <span className="spinner" />
              <div>
                <strong>
                  {live.phase === 'proving'
                    ? 'Backing up your move. Keeping your secret.'
                    : live.phase === 'balancing'
                      ? 'Lace is preparing your move.'
                      : live.phase === 'submitting'
                        ? 'Sending your move to the table.'
                        : live.phase === 'confirming'
                          ? 'Waiting for Midnight to confirm your move.'
                          : `${live.actionLabel}…`}
                </strong>
                <p>
                  {live.phase === 'balancing'
                    ? 'Approve the transaction in Lace when it asks.'
                    : 'Keep this tab open. The card lands after confirmation.'}{' '}
                  {startedAt &&
                    live.now - startedAt > 45_000 &&
                    'The proof service may be waking up; this can take a few minutes.'}
                </p>
              </div>
              <span className="elapsed">
                {startedAt
                  ? `${Math.max(0, Math.floor((live.now - startedAt) / 1000))}s`
                  : ''}
              </span>
            </div>
          )}
          {!isPractice && live.actionError && (
            <div className="notice error" role="alert">
              <Cat mood="panic" />
              <div>
                <strong>That move couldn't finish.</strong>
                <p>{live.actionError}</p>
              </div>
            </div>
          )}
          {!isPractice && live.result && (
            <div className="notice success" role="status">
              <div>
                <strong>On the table. Officially.</strong>
                <p>
                  Your move was recorded on Midnight.{' '}
                  <span>Transaction {short(live.result.txId)}</span> · Block{' '}
                  {live.result.blockHeight}
                </p>
              </div>
            </div>
          )}
          {isPractice && practice && (
            <div className="practice-message" role="status">
              <span className="miso-mini">
                <Cat mood={mood} />
              </span>
              <div>
                <strong>Meanwhile, at the practice table…</strong>
                <p>{practice.message}</p>
              </div>
              <span className="practice-tag">LOCAL PLAY</span>
            </div>
          )}
        </section>

        <section id="clubhouse" className="clubhouse">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                GOOD COMPANY. QUESTIONABLE ALIBIS.
              </span>
              <h2>The clubhouse.</h2>
            </div>
            <div className="club-tabs" role="group" aria-label="Clubhouse view">
              <button
                aria-pressed={activeTab === 'trails'}
                onClick={() => setActiveTab('trails')}
              >
                Watch & call bluff
              </button>
              <button
                aria-pressed={activeTab === 'scores'}
                onClick={() => setActiveTab('scores')}
              >
                Scoreboard
              </button>
            </div>
          </div>
          {activeTab === 'trails' ? (
            <div className="opponent-grid">
              {opponents.length ? (
                opponents.slice(0, 12).map((entry) => (
                  <article className="opponent-run" key={entry.id}>
                    <div className="opponent-heading">
                      <span className="opponent-avatar">
                        <Cat
                          mood={
                            entry.runStatus === 1
                              ? 'happy'
                              : entry.runStatus === 2
                                ? 'panic'
                                : 'watching'
                          }
                        />
                      </span>
                      <div>
                        <h3>{playerName(entry)}</h3>
                        <p>
                          {isPractice ? 'Practice bot' : short(entry.id)} ·
                          Round {entry.round}
                        </p>
                      </div>
                      <span className={`run-status status-${entry.runStatus}`}>
                        {entry.runStatus === 1
                          ? 'BACKED IT UP'
                          : entry.runStatus === 2
                            ? 'FOLDED / TIMED OUT'
                            : entry.challengeStatus === 1
                              ? 'BLUFF CALLED'
                              : 'LOOKS INNOCENT'}
                      </span>
                    </div>
                    <div
                      className="opponent-trail"
                      aria-label={`${playerName(entry)} public trail`}
                    >
                      {Array.from({ length: 5 }, (_, i) =>
                        entry.visits[i] !== undefined ? (
                          <div
                            className={`opponent-stop ${PLACES[entry.visits[i]].color}`}
                            key={i}
                          >
                            <PlaceArt place={entry.visits[i]} />
                            <span>{PLACES[entry.visits[i]].name}</span>
                          </div>
                        ) : (
                          <div className="opponent-empty" key={i}>
                            {i + 1}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="opponent-footer">
                      <span>
                        {entry.challengeStatus === 1 && entry.runStatus === 0
                          ? `Proof window: ${clock(entry.challengeDeadline, live.now)}`
                          : `${entry.visits.length} / 5 public moves · ${entry.score} ${entry.score === 1 ? 'point' : 'points'}`}
                      </span>
                      {canResolve(entry) ? (
                        <button
                          className="small-button"
                          onClick={() =>
                            void act(
                              { kind: 'resolve', targetId: entry.id },
                              'Settling the challenge',
                            )
                          }
                        >
                          Settle challenge
                        </button>
                      ) : (
                        <button
                          className="call-bluff"
                          disabled={!canChallenge(entry)}
                          onClick={() => setChallengeTarget(entry)}
                        >
                          Call bluff <span>−1 token</span>
                        </button>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-club">
                  <Cat />
                  <div>
                    <h3>Suspiciously quiet in here.</h3>
                    <p>
                      {isPractice
                        ? 'Deal a practice round to meet Miso.'
                        : 'No other players have joined yet. Bring a friend with Lace, or test your poker face against Miso.'}
                    </p>
                    <button
                      className="text-button"
                      onClick={() => switchMode('practice')}
                    >
                      Pull up a chair with Miso →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="scoreboard">
              {scores.length ? (
                scores.map((entry, i) => (
                  <div className="score-row" key={entry.id}>
                    <span className="rank">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <strong>{playerName(entry)}</strong>
                    <span>{entry.challengeTokens} bluff tokens</span>
                    <b>
                      {entry.score} <small>pts</small>
                    </b>
                  </div>
                ))
              ) : (
                <div className="empty-club">
                  <Cat mood="happy" />
                  <div>
                    <h3>The top spot has your name on it.</h3>
                    <p>
                      Complete your mission or win a challenge to earn a point.
                      {isPractice && ' These are practice scores only.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="club-note">
            {isPractice
              ? 'Practice checks happen locally. Live play uses Midnight proofs and real players.'
              : 'Live players take moves in their own time. The board refreshes every 15 seconds.'}{' '}
            A valid proof wins; a forfeit or missed deadline loses. Points have
            no cash value.
          </p>
        </section>

        <section className="rules-strip" aria-label="Game in four steps">
          <div>
            <span>01 / THE DEAL</span>
            <h3>Keep it close.</h3>
            <p>Get three secret stops, in order. Everyone has five moves.</p>
          </div>
          <div>
            <span>02 / THE DETOUR</span>
            <h3>Look busy.</h3>
            <p>
              Play your route with two extra moves. All five visits are public.
            </p>
          </div>
          <div>
            <span>03 / THE SIDE-EYE</span>
            <h3>Call their bluff.</h3>
            <p>Think they can't finish? Stake a token and start their timer.</p>
          </div>
          <div>
            <span>04 / THE RECEIPTS</span>
            <h3>Prove. Don't tell.</h3>
            <p>Back up your mission without publishing it. Take the point.</p>
          </div>
        </section>
        <div className="privacy-footnote">
          <span>YOUR MISSION ISN'T PRINTED ON THE TABLE.</span>
          <p>
            The proof keeps it off the public ledger. Your moves can still give
            clues.
          </p>
          <button className="text-button" onClick={() => setModal('privacy')}>
            The privacy fine print ↗
          </button>
        </div>
      </main>
      <footer className="site-footer">
        <a className="footer-brand" href="#top">
          secret trail.
        </a>
        <span>A little strategy. A lot of side-eye.</span>
        <div>
          <a
            href="https://github.com/ashuujha/midnight-secret-trail"
            target="_blank"
            rel="noreferrer"
          >
            The source ↗
          </a>
          <span>Powered by Midnight</span>
        </div>
      </footer>

      {modal === 'rules' && (
        <Dialog
          title="The art of looking innocent."
          onClose={() => setModal(null)}
        >
          <p className="dialog-lead">
            You're on a secret errand. Everyone can see where you go. Keep them
            guessing why.
          </p>
          <ol className="rule-list">
            <li>
              <strong>Open your mission.</strong>
              <p>
                You'll get three places, like Museum → Cafe → Stadium. Visit
                them in that order.
              </p>
            </li>
            <li>
              <strong>Play exactly five location cards.</strong>
              <p>
                Add two extra visits anywhere. Park → Museum → Mall → Cafe →
                Stadium works! Every visit is public; the secret stops aren't
                labelled.
              </p>
            </li>
            <li>
              <strong>Call bluff. Or keep a poker face.</strong>
              <p>
                Everyone starts with three challenge tokens. Stake one against
                another player after their first move. They get about 20 minutes
                to finish and prove.
              </p>
            </li>
            <li>
              <strong>Back up your story.</strong>
              <p>
                A valid proof earns you one point and costs your challenger
                their token. Forfeit or miss the timer and the challenger gets a
                point and their token back. Then deal a fresh round.
              </p>
            </li>
          </ol>
          <p className="dialog-aside">
            Location cards are reusable. These are virtual visits, not
            real-world travel. Players run their own trails; the shared
            scoreboard counts points across rounds.
          </p>
          <button
            className="button-primary"
            onClick={() => {
              setModal(null);
              switchMode('practice');
              document
                .getElementById('game')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Got it. Let me try with Miso ↗
          </button>
        </Dialog>
      )}
      {modal === 'privacy' && (
        <Dialog title="Secrets, with receipts." onClose={() => setModal(null)}>
          <div className="privacy-details">
            <h3>On the table</h3>
            <p>
              Your player ID, five visits, mission commitment, score, token
              balance and challenge results are public.
            </p>
            <h3>Under the table</h3>
            <p>
              Your mission, identity secret and random commitment salt stay in
              your browser and are supplied privately to the prover. The proof
              checks the route without publishing them to the ledger.
            </p>
            <h3>The honest bit</h3>
            <p>
              Your trail can narrow down the eight possible missions, sometimes
              to just one. A hosted prover can see your proving inputs. Browser
              storage contains your private mission; don't clear it mid-game or
              share your browser profile.
            </p>
            <p>
              The browser chooses your mission. This MVP proves you followed the
              committed route, not that the deal was fair against a modified
              browser. Practice uses local rule checks, not ZK proofs.
            </p>
          </div>
          <a
            className="text-button"
            href="https://github.com/ashuujha/midnight-secret-trail#privacy-model"
            target="_blank"
            rel="noreferrer"
          >
            Read the full privacy model ↗
          </a>
        </Dialog>
      )}
      {modal === 'wallet' && (
        <Dialog
          title={
            wallet.status === 'connected'
              ? 'Your seat at the table.'
              : 'Bring your wallet. Keep your secrets.'
          }
          onClose={() => setModal(null)}
        >
          <p className="dialog-lead">
            Live play uses Lace on Midnight {MIDNIGHT_NETWORK}. Each deal, visit
            and challenge needs a wallet approval and tDUST.
          </p>
          {wallet.status === 'connected' ? (
            <>
              <div className="wallet-details">
                <span>CONNECTED WALLET</span>
                <code>{wallet.address && short(wallet.address)}</code>
                <span>TABLE CONTRACT</span>
                <code>{CONTRACT_ADDRESS}</code>
                <p>
                  {wallet.dustBalance?.balance === 0n
                    ? 'No usable tDUST yet. Generate tDUST in Lace and let it sync before playing.'
                    : 'Keep Lace synced and its proof service running for live moves.'}
                </p>
              </div>
              <button
                className="button-primary"
                onClick={() => {
                  setModal(null);
                  switchMode('live');
                }}
              >
                Back to the table ↗
              </button>
              <button
                className="fold-button"
                disabled={live.busy}
                onClick={() => {
                  wallet.disconnect();
                  setModal(null);
                }}
              >
                Disconnect wallet
              </button>
            </>
          ) : (
            <>
              <button
                className="button-primary"
                disabled={
                  wallet.status === 'connecting' ||
                  wallet.status === 'detecting'
                }
                onClick={() => void wallet.connect()}
              >
                {wallet.status === 'connecting'
                  ? 'Waiting for Lace…'
                  : wallet.status === 'detecting'
                    ? 'Looking for Lace…'
                    : 'Connect Lace wallet'}{' '}
                ↗
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setModal(null);
                  switchMode('practice');
                }}
              >
                No wallet? Play a practice round →
              </button>
            </>
          )}
          {wallet.error && (
            <p className="wallet-error" role="alert">
              {wallet.error}
            </p>
          )}
          <details className="wallet-help">
            <summary>Wallet or proof service not ready?</summary>
            <p>
              Lace's own proof server must be reachable to balance a
              transaction. If Lace uses localhost:6300, start the local proof
              bridge. The site's hosted prover does not change Lace's setting.
            </p>
            <a
              className="text-button"
              href="https://github.com/ashuujha/midnight-secret-trail#setup--run-locally"
              target="_blank"
              rel="noreferrer"
            >
              Setup instructions ↗
            </a>
          </details>
        </Dialog>
      )}
      {modal === 'forfeit' && (
        <Dialog title="Fold this round?" onClose={() => setModal(null)}>
          <Cat mood="panic" className="dialog-cat" />
          <p className="dialog-lead">
            Your current run will end.{' '}
            {player?.challengeStatus === 1
              ? 'Your challenger gets a point and their token back.'
              : 'You can start a fresh round with a new secret mission.'}
          </p>
          <div className="dialog-actions">
            <button className="button-outline" onClick={() => setModal(null)}>
              Keep playing
            </button>
            <button
              className="button-primary"
              onClick={() => {
                setModal(null);
                void act({ kind: 'forfeit' }, 'Folding this round');
              }}
            >
              Yes, fold this round
            </button>
          </div>
        </Dialog>
      )}
      {challengeTarget && (
        <Dialog
          title="Feeling suspicious?"
          onClose={() => setChallengeTarget(null)}
        >
          <Cat mood="watching" className="dialog-cat" />
          <p className="dialog-lead">
            Stake one token to call {playerName(challengeTarget)}'s bluff.
          </p>
          <p>
            If they prove their route, you lose the token. If they fold or miss
            their deadline, you get a point and the token back.
            {isPractice && ' Miso responds immediately in this practice round.'}
          </p>
          <div className="dialog-actions">
            <button
              className="button-outline"
              onClick={() => setChallengeTarget(null)}
            >
              Let it slide
            </button>
            <button
              className="button-primary"
              disabled={!canChallenge(challengeTarget)}
              onClick={() => {
                const targetId = challengeTarget.id;
                setChallengeTarget(null);
                void act(
                  { kind: 'challenge', targetId },
                  'Calling their bluff',
                );
              }}
            >
              Call bluff · stake 1 token
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
