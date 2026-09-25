import { useCallback, useEffect, useMemo, useState } from 'react';
import { CONTRACT_ADDRESS, MIDNIGHT_NETWORK, useMidnight } from './hooks/useMidnight';
import type { GameAction, GameProfile, GameSnapshot, TransactionResult, TransactionStage } from './midnight/game';
import { friendlyCircuitError } from './utils/errors';

const PLACES = [
  { name: 'Museum', icon: '◇', tag: 'GALLERY', description: 'Blend with the crowd.' },
  { name: 'Cafe', icon: '☕', tag: 'CORNER', description: 'Pause for a coffee.' },
  { name: 'Stadium', icon: '✦', tag: 'ARENA', description: 'Join the noise.' },
  { name: 'Park', icon: '❋', tag: 'GARDEN', description: 'Take the long way.' },
  { name: 'Mall', icon: '◈', tag: 'SHOPS', description: 'Lose the watchers.' },
] as const;

const ROUTES = [
  [0, 1, 2], [1, 4, 3], [2, 0, 3], [3, 2, 1],
  [0, 4, 1], [1, 2, 3], [2, 3, 0], [4, 0, 2],
] as const;

const short = (value: string) => `${value.slice(0, 7)}…${value.slice(-5)}`;
const configured = /^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS);

function matchedStops(visits: number[], route: readonly number[]): number {
  let step = 0;
  for (const visit of visits) if (visit === route[step]) step += 1;
  return step;
}

const minutesLeft = (deadline: number | null, now: number) =>
  deadline === null ? '—' : `${Math.max(0, Math.ceil((deadline - now) / 60_000))} min`;

export default function App() {
  const wallet = useMidnight();
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [phase, setPhase] = useState<'idle' | 'preparing' | TransactionStage>('idle');
  const [actionLabel, setActionLabel] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async () => {
    if (!configured) return;
    try {
      const { readGameSnapshot } = await import('./midnight/game');
      const next = await readGameSnapshot(CONTRACT_ADDRESS, MIDNIGHT_NETWORK);
      setSnapshot(next);
      setSnapshotError(null);
    } catch (error) {
      setSnapshotError(error instanceof Error ? error.message : 'Could not load the public game board.');
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!import.meta.env.VITE_PROOF_SERVER_URL) return;
    // Wake Render's sleeping free instance while the player reads the game.
    void import('./midnight/prover-readiness').then(({ warmProofServer }) =>
      warmProofServer().catch(() => undefined));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    if (!wallet.address || !configured) { setProfile(null); return; }
    void import('./midnight/game').then(({ loadProfile }) => {
      if (active) setProfile(loadProfile(wallet.address!, CONTRACT_ADDRESS));
    });
    return () => { active = false; };
  }, [wallet.address]);

  const player = snapshot?.players.find((entry) => entry.id === profile?.id);
  const route = profile ? ROUTES[profile.mission] : null;
  const matched = player && route ? matchedStops(player.visits, route) : 0;
  const decoysUsed = player ? player.visits.length - matched : 0;
  const decoysLeft = Math.max(0, 2 - decoysUsed);
  const routeStillPossible = !!player && player.visits.length + (3 - matched) <= 5;
  const challengeExpired = !!player && player.challengeStatus === 1 &&
    player.challengeDeadline !== null && now >= player.challengeDeadline;
  const readyToClaim = !!player && player.runStatus === 0 && matched === 3 &&
    player.visits.length === 5 && !challengeExpired;
  const busy = phase !== 'idle';
  const canPlay = wallet.status === 'connected' && !!wallet.connectedAPI && configured && !!snapshot && !busy;

  useEffect(() => {
    if (wallet.status !== 'connected' || !configured) return;
    const circuit = !player ? 'join' : player.runStatus !== 0 ? 'nextRound'
      : player.visits.length >= 4 ? 'claim' : 'visit';
    void import('./midnight/game').then(({ prefetchGameCircuit }) =>
      prefetchGameCircuit(circuit).catch(() => undefined));
  }, [wallet.status, player?.visits.length, player?.runStatus]);

  useEffect(() => {
    if (!player || player.challengeTokens < 1 || !snapshot?.players.some((entry) =>
      entry.id !== player.id && entry.runStatus === 0 && entry.visits.length > 0 && entry.challengeStatus === 0)) return;
    void import('./midnight/game').then(({ prefetchGameCircuit }) =>
      prefetchGameCircuit('challenge').catch(() => undefined));
  }, [player?.id, player?.challengeTokens, snapshot]);

  const perform = async (action: GameAction, label: string) => {
    if (!wallet.connectedAPI || !wallet.address || !configured || busy) return;
    setActionError(null);
    setResult(null);
    setPhase('preparing');
    setActionLabel(label);
    try {
      const game = await import('./midnight/game');
      let current = profile;
      if (action.kind === 'join' && !current) {
        current = game.createProfile();
        game.saveProfile(wallet.address, CONTRACT_ADDRESS, current);
        setProfile(current);
      }
      if (!current) throw new Error('Your private mission was not found in this browser. Join a new round.');
      if (action.kind === 'nextRound') {
        current = game.nextRoundProfile(current);
        game.saveProfile(wallet.address, CONTRACT_ADDRESS, current);
        setProfile(current);
      }
      const submitted = await game.callGameCircuit(
        wallet.connectedAPI, wallet.networkId, CONTRACT_ADDRESS, current, action,
        setPhase,
      );
      setResult(submitted);
      await refresh();
      window.setTimeout(() => void refresh(), 4_000);
      void wallet.refreshDustBalance();
    } catch (error) {
      setActionError(friendlyCircuitError(error, wallet.networkId));
    } finally {
      setPhase('idle');
    }
  };

  const deployLocally = async () => {
    if (!wallet.connectedAPI || busy || !import.meta.env.DEV) return;
    setActionError(null);
    setPhase('preparing');
    setActionLabel('Deploying game contract');
    try {
      const { deployGameContract } = await import('./midnight/game');
      const address = await deployGameContract(wallet.connectedAPI, wallet.networkId, setPhase);
      localStorage.setItem('secret-trail-dev-contract', address);
      setDeployedAddress(address);
    } catch (error) {
      setActionError(friendlyCircuitError(error, wallet.networkId));
    } finally {
      setPhase('idle');
    }
  };

  const leaderboard = useMemo(() => snapshot?.players.filter((entry) => entry.score > 0) ?? [], [snapshot]);
  const otherPlayers = useMemo(() => snapshot?.players.filter((entry) => entry.visits.length > 0).slice(0, 12) ?? [], [snapshot]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Secret Trail home"><span className="logo-mark">✧</span><span>SECRET<span>TRAIL</span></span></a>
        <nav aria-label="Main navigation"><a href="#play">Play</a><a href="#challenges">Challenge</a><a href="#leaderboard">Leaderboard</a><a href="#privacy">Privacy</a></nav>
        <span className="network-badge"><i /> MIDNIGHT {MIDNIGHT_NETWORK.toUpperCase()}</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow"><i /> EVERYONE SEES YOUR TRAIL. NOBODY SEES YOUR MISSION.</span>
            <h1>Leave a trail.<br /><em>Hide the truth.</em></h1>
            <p>Five public moves. Three secret stops. Two private decoy tokens. Bluff the watchers, survive a challenge, and prove your route without revealing it.</p>
            <a className="primary-link" href="#play">Start your run <span>↗</span></a>
            <div className="hero-proof"><span>01 / SECRET ROUTE</span><span>02 / PUBLIC TRAIL</span><span>03 / PROOF OR CHALLENGE</span></div>
          </div>
          <div className="hero-orbit" aria-hidden="true"><div className="orbital-ring ring-one" /><div className="orbital-ring ring-two" /><div className="orbital-ring ring-three" /><span className="orbit-center">✧</span><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">✧</span><span className="orbit-star star-three">✦</span></div>
        </section>

        <section id="play" className="play-section">
          <div className="section-heading"><div><span className="section-kicker">LEVEL 1 / FIVE MOVES</span><h2>Your next move is public.<br /><em>Your reason is yours.</em></h2></div><p>Complete your three secret stops in order. Use two extra moves as decoys. Other players can stake a token to challenge you.</p></div>

          {!configured && <div className="notice" role="alert"><strong>Deployment needed</strong><span>Set VITE_CONTRACT_ADDRESS to a deployed Secret Trail contract to enable live play. {import.meta.env.DEV && wallet.status === 'connected' && <button type="button" disabled={busy} onClick={() => void deployLocally()}>Deploy with Lace</button>}</span></div>}
          {deployedAddress && <div className="notice success" role="status"><strong>Contract deployed</strong><span><code>{deployedAddress}</code> — save this address for Vercel, then reload the page to play locally.</span><button type="button" onClick={() => window.location.reload()}>Reload</button></div>}
          {configured && !snapshot && !snapshotError && <div className="notice" role="status"><strong>Syncing world</strong><span>Reading the public contract state from Midnight…</span></div>}
          {snapshotError && configured && <div className="notice warning" role="alert"><strong>World sync interrupted</strong><span>{snapshotError}</span><button type="button" onClick={() => void refresh()}>Retry</button></div>}

          <div className="stats-row"><div><span>PLAYERS</span><strong>{snapshot?.joined ?? '—'}</strong></div><div><span>MISSIONS PROVED</span><strong>{snapshot?.completed ?? '—'}</strong></div><div><span>CHALLENGES WON</span><strong>{snapshot?.challengesWon ?? '—'}</strong></div><div><span>YOUR SCORE</span><strong>{player?.score ?? 0}</strong></div></div>

          <div className="game-grid">
            <div className="world-card">
              <div className="card-heading"><div><span className="section-kicker">01 / SHARED WORLD</span><h3>Choose a location</h3></div><span className="live-pill"><i /> PUBLIC LEDGER</span></div>
              <p className="card-description">Everyone sees where you go. Only you know which stops count. Decoys look exactly like real visits to other players.</p>
              <div className="map-grid">{PLACES.map((place, index) => <button className="place" type="button" key={place.name} disabled={!canPlay || !player || player.runStatus !== 0 || challengeExpired || player.visits.length >= 5} onClick={() => void perform({ kind: 'visit', location: index }, `Visiting ${place.name}`)}><span className="place-icon">{place.icon}</span><span className="place-tag">{place.tag}</span><strong>{place.name}</strong><small>{place.description}</small><span className="place-action">Visit ↗</span></button>)}</div>
              <div className="visit-trail"><span>YOUR PUBLIC TRAIL</span><div>{Array.from({ length: 5 }, (_, index) => <div className={`trail-stop ${player?.visits[index] !== undefined ? 'filled' : ''}`} key={index}>{player?.visits[index] !== undefined ? PLACES[player.visits[index]].name : `0${index + 1}`}</div>)}</div></div>
            </div>

            <aside className="mission-card">
              <div className="card-heading"><div><span className="section-kicker">02 / ONLY YOU CAN SEE THIS</span><h3>Secret briefing</h3></div><span className="lock-icon">✳</span></div>
              {wallet.status === 'connected' && profile && route ? (
                <>
                  <p className="mission-intro">Round {player?.round ?? 1}: visit these three locations in order within five public moves.</p>
                  <div className="mission-route">{route.map((location, index) => <div key={index}><span>0{index + 1}</span><strong>{PLACES[location].name}</strong></div>)}</div>
                  <div className="token-budget" aria-label={`${decoysLeft} of 2 private decoy tokens remain`}>
                    <div><strong>PRIVATE DECOY TOKENS</strong><small>{decoysLeft} / 2 left</small></div>
                    <div className="token-dots">{[0, 1].map((token) => <i key={token} className={token < decoysLeft ? 'available' : ''} />)}</div>
                  </div>
                  <p className="mission-note">An extra stop spends a decoy. The public trail never labels which moves were decoys.</p>
                  {player?.challengeStatus === 1 && <div className={`challenge-alert ${challengeExpired ? 'expired' : ''}`} role="status">
                    <strong>Someone challenged your run</strong>
                    <span>{challengeExpired ? 'Proof window expired. The challenger can collect the point.' : `Prove before the deadline — about ${minutesLeft(player.challengeDeadline, now)} left.`}</span>
                  </div>}
                  <div className="mission-status"><span className={player?.runStatus === 1 ? 'complete' : readyToClaim ? 'ready' : ''}>
                    {player?.runStatus === 1 ? '✦ MISSION PROVED' : player?.runStatus === 2 ? '✦ RUN LOST' : readyToClaim ? '✦ READY TO PROVE' : `${player?.visits.length ?? 0} OF 5 MOVES RECORDED`}
                  </span></div>
                  {player?.runStatus === 0 && !routeStillPossible && <p className="inline-error">Your remaining moves cannot complete this route. Forfeit to start a new round.</p>}
                  {player?.runStatus === 0 && <>
                    <button className="claim-button" type="button" disabled={!canPlay || !readyToClaim} onClick={() => void perform({ kind: 'claim' }, 'Proving your mission')}>Generate proof & claim point <span>↗</span></button>
                    <button className="quiet-action" type="button" disabled={!canPlay} onClick={() => void perform({ kind: 'forfeit' }, 'Forfeiting this run')}>Forfeit this run</button>
                  </>}
                  {player && player.runStatus !== 0 && <button className="claim-button" type="button" disabled={!canPlay} onClick={() => void perform({ kind: 'nextRound' }, 'Starting a new round')}>Start a new round <span>↗</span></button>}
                </>
              ) : <div className="mission-locked"><span>✧</span><strong>Your mission is waiting.</strong><p>Connect Lace, then receive a private route generated in your browser.</p></div>}
              <div className="wallet-area"><span>YOUR WALLET</span>{wallet.status === 'connected' ? <><code>{wallet.address ? short(wallet.address) : 'Connected'}</code><button type="button" className="wallet-button secondary" onClick={wallet.disconnect}>Disconnect</button></> : <button className="wallet-button" type="button" disabled={wallet.status === 'detecting' || wallet.status === 'connecting'} onClick={() => void wallet.connect()}>{wallet.status === 'detecting' ? 'Detecting Lace…' : wallet.status === 'connecting' ? 'Connecting…' : 'Connect Lace wallet'}</button>}{wallet.error && <p className="inline-error" role="alert">{wallet.error}</p>}{wallet.status === 'connected' && !player && <button className="join-button" type="button" disabled={!canPlay} onClick={() => void perform({ kind: 'join' }, 'Joining the game')}>{profile ? 'Retry joining game' : 'Receive secret mission'} <span>↗</span></button>}{player && <small className="wallet-hint">Challenge tokens: {player.challengeTokens} / 3. Stake one to challenge another player; lose it if they prove their route.</small>}{wallet.status === 'connected' && <small className="wallet-hint">{wallet.dustBalance?.balance === 0n ? 'Generate tDUST in Lace before playing.' : 'Each public action requires a Lace transaction and tDUST.'}</small>}</div>
            </aside>
          </div>

          {busy && <div className="progress" role="status" aria-live="polite"><span className="spinner" /><div><strong>{phase === 'proving' ? 'Generating your zero knowledge proof…' : phase === 'balancing' ? 'Preparing your Lace transaction…' : phase === 'submitting' ? 'Submitting to Midnight…' : phase === 'confirming' ? 'Waiting for Preprod confirmation…' : `${actionLabel}…`}</strong><p>Keep this tab open and approve the transaction in Lace when prompted.</p></div></div>}
          {actionError && <div className="notice warning" role="alert"><strong>Action could not finish</strong><span>{actionError}</span></div>}
          {result && <div className="notice success" role="status"><strong>Action recorded on Midnight</strong><span>Transaction <code>{short(result.txId)}</code> · Block {result.blockHeight}</span></div>}
        </section>

        <section id="challenges" className="community-section challenge-section">
          <div className="section-heading"><div><span className="section-kicker">BLUFF / CALL / PROVE</span><h2>Call their bluff.<br /><em>Risk a token.</em></h2></div><p>Watch a public trail. Stake one challenge token if you think the runner cannot prove their hidden route. A valid proof burns your stake; a forfeit or missed deadline earns you a point.</p></div>
          <div className="challenge-list">
            {otherPlayers.length ? otherPlayers.map((entry) => {
              const canChallenge = canPlay && !!player && player.id !== entry.id && player.challengeTokens > 0 &&
                entry.runStatus === 0 && entry.challengeStatus === 0;
              const canResolve = canPlay && !!player && entry.challengeStatus === 1 &&
                entry.challengeDeadline !== null && now >= entry.challengeDeadline;
              return <div className="challenge-run" key={entry.id}>
                <div><span>ROUND {entry.round} · {short(entry.id)}</span><strong>{entry.visits.map((location) => PLACES[location]?.name ?? '?').join(' → ')}</strong><small>{entry.runStatus === 1 ? 'Proof accepted — runner wins.' : entry.runStatus === 2 ? 'Run lost.' : entry.challengeStatus === 1 ? `Challenge open · ${minutesLeft(entry.challengeDeadline, now)} to prove` : `${entry.visits.length}/5 moves · open to challenge`}</small></div>
                {canChallenge && <button type="button" disabled={busy} onClick={() => void perform({ kind: 'challenge', targetId: entry.id }, 'Challenging this run')}>Challenge · stake 1 token</button>}
                {canResolve && <button type="button" disabled={busy} onClick={() => void perform({ kind: 'resolve', targetId: entry.id }, 'Settling expired challenge')}>{entry.challengerId === player?.id ? 'Collect your point' : 'Settle expired challenge'}</button>}
                {!canChallenge && !canResolve && <span className="row-status">{entry.runStatus === 1 ? 'PROVED' : entry.runStatus === 2 ? 'SETTLED' : entry.challengeStatus === 1 ? 'CHALLENGED' : 'WATCHING'}</span>}
              </div>;
            }) : <p className="empty-state">No public trails yet. Make the first move and give others something to doubt.</p>}
          </div>
          <p className="challenge-rule">An invalid ZK proof cannot be posted to the chain. A challenger wins only if the runner forfeits or fails to prove within the on-chain deadline.</p>
        </section>

        <section id="leaderboard" className="community-section leaderboard-section"><div className="section-heading"><div><span className="section-kicker">THE SHARED STORY</span><h2>Visible actions.<br /><em>Hidden intentions.</em></h2></div><p>Score a point by proving your own mission or by winning a challenge. The hidden route stays private even when a proof wins.</p></div><div className="community-grid"><div className="community-card"><div className="card-heading"><h3>Public trails</h3><span>LIVE LEDGER</span></div>{otherPlayers.length ? otherPlayers.map((entry) => <div className="player-row" key={entry.id}><span className="avatar">✧</span><div><strong>{short(entry.id)} · R{entry.round}</strong><small>{entry.visits.map((location) => PLACES[location]?.name ?? '?').join(' → ')}</small></div><span className="row-status">{entry.runStatus === 1 ? 'PROVED' : entry.runStatus === 2 ? 'LOST' : `${entry.visits.length}/5`}</span></div>) : <p className="empty-state">No public visits yet. Be the first explorer.</p>}</div><div className="community-card"><div className="card-heading"><h3>Leaderboard</h3><span>PROVED POINTS</span></div>{leaderboard.length ? leaderboard.map((entry, index) => <div className="player-row" key={entry.id}><span className="rank">{String(index + 1).padStart(2, '0')}</span><div><strong>{short(entry.id)}</strong><small>Round {entry.round} · {entry.challengeTokens} challenge tokens</small></div><strong className="points">{entry.score} PT</strong></div>) : <p className="empty-state">The first proved mission or successful challenge takes the lead.</p>}</div></div></section>

        <section id="privacy" className="privacy-section"><span className="section-kicker">HOW THE PROOF WORKS</span><h2>They see the journey.<br /><em>Not the assignment.</em></h2><div className="privacy-grid"><div><span className="privacy-number">01</span><h3>Private mission</h3><p>Your browser chooses one of eight routes and a fresh random salt. Only a commitment appears on the public ledger before you move.</p></div><div><span className="privacy-number">02</span><h3>Public actions</h3><p>All five visits are visible. Which three fulfill the mission and which two are decoys remain private.</p></div><div><span className="privacy-number">03</span><h3>Verified result</h3><p>A zero knowledge proof checks the committed route against the visits. Challenges settle on-chain without publishing the route.</p></div></div><p className="privacy-fineprint">Observers can still infer possible missions from a public trail. A hosted proof service may see private proving inputs, so use a prover you trust. This level proves a committed route, not that the browser assigned missions fairly.</p>
          <div className="level-roadmap"><div><span>LEVEL 1 · LIVE IN THIS VERSION</span><strong>Three secret stops, two decoys, player challenges</strong></div><div><span>LEVEL 2 · NEXT</span><strong>Four secret stops, three decoys</strong></div><div><span>LEVEL 3 · PLANNED</span><strong>Order and time constraints</strong></div><div><span>LEVEL 4 · PLANNED</span><strong>Multiple valid mission branches</strong></div></div>
        </section>
      </main>
      <footer><span>✧ SECRET TRAIL</span><span>Built on Midnight · {MIDNIGHT_NETWORK.toUpperCase()}</span><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
