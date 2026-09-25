import { useCallback, useEffect, useMemo, useState } from 'react';
import { CONTRACT_ADDRESS, MIDNIGHT_NETWORK, useMidnight } from './hooks/useMidnight';
import type { GameAction, GameProfile, GameSnapshot, TransactionResult } from './midnight/game';
import { friendlyCircuitError } from './utils/errors';

const PLACES = [
  { name: 'Harbor', icon: '◈', tag: 'DOCKS', description: 'Follow the tide.' },
  { name: 'Library', icon: '⌘', tag: 'ARCHIVE', description: 'Read between the lines.' },
  { name: 'Observatory', icon: '✧', tag: 'TOWER', description: 'Watch the night sky.' },
  { name: 'Market', icon: '◇', tag: 'BAZAAR', description: 'Blend into the crowd.' },
] as const;

const ROUTES = [
  [0, 1, 2], [1, 3, 0], [2, 0, 3], [3, 2, 1],
  [0, 3, 1], [1, 2, 3], [2, 1, 0], [3, 0, 2],
] as const;

const short = (value: string) => `${value.slice(0, 7)}…${value.slice(-5)}`;
const configured = /^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS);

function followsRoute(visits: number[], route: readonly number[]): boolean {
  let step = 0;
  for (const visit of visits) if (visit === route[step]) step += 1;
  return step === route.length;
}

export default function App() {
  const wallet = useMidnight();
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'proving'>('idle');
  const [actionLabel, setActionLabel] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

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
    let active = true;
    if (!wallet.address || !configured) { setProfile(null); return; }
    void import('./midnight/game').then(({ loadProfile }) => {
      if (active) setProfile(loadProfile(wallet.address!, CONTRACT_ADDRESS));
    });
    return () => { active = false; };
  }, [wallet.address]);

  const player = snapshot?.players.find((entry) => entry.id === profile?.id);
  const route = profile ? ROUTES[profile.mission] : null;
  const readyToClaim = !!player && !!route && player.visits.length === 5 && followsRoute(player.visits, route);
  const busy = phase !== 'idle';
  const canPlay = wallet.status === 'connected' && !!wallet.connectedAPI && configured && !!snapshot && !busy;

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
      const submitted = await game.callGameCircuit(
        wallet.connectedAPI, wallet.networkId, CONTRACT_ADDRESS, current, action,
        () => setPhase('proving'),
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

  const leaderboard = useMemo(() => snapshot?.players.filter((entry) => entry.score > 0) ?? [], [snapshot]);
  const otherPlayers = useMemo(() => snapshot?.players.filter((entry) => entry.visits.length > 0).slice(0, 8) ?? [], [snapshot]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Secret Missions home"><span className="logo-mark">✧</span><span>SECRET<span>MISSIONS</span></span></a>
        <nav aria-label="Main navigation"><a href="#play">Play</a><a href="#leaderboard">Leaderboard</a><a href="#privacy">Privacy</a></nav>
        <span className="network-badge"><i /> MIDNIGHT {MIDNIGHT_NETWORK.toUpperCase()}</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow"><i /> THE WORLD IS WATCHING. YOUR MISSION ISN'T.</span>
            <h1>Play in <em>plain sight.</em></h1>
            <p>Explore a shared world with everyone else. Complete an objective only you know. Prove you succeeded without showing your secret mission.</p>
            <a className="primary-link" href="#play">Enter the world <span>↗</span></a>
            <div className="hero-proof"><span>01 / PRIVATE MISSION</span><span>02 / PUBLIC MOVES</span><span>03 / VERIFIED CLAIM</span></div>
          </div>
          <div className="hero-orbit" aria-hidden="true"><div className="orbital-ring ring-one" /><div className="orbital-ring ring-two" /><div className="orbital-ring ring-three" /><span className="orbit-center">✧</span><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">✧</span><span className="orbit-star star-three">✦</span></div>
        </section>

        <section id="play" className="play-section">
          <div className="section-heading"><div><span className="section-kicker">THE LIVE GAME / SEASON ONE</span><h2>Your next move is public.<br /><em>Your reason is yours.</em></h2></div><p>Five visible visits. One hidden three stop route. A Midnight proof decides whether you completed it.</p></div>

          {!configured && <div className="notice" role="alert"><strong>Deployment needed</strong><span>Set VITE_CONTRACT_ADDRESS to the deployed Secret Missions contract to enable live play.</span></div>}
          {configured && !snapshot && !snapshotError && <div className="notice" role="status"><strong>Syncing world</strong><span>Reading the public contract state from Midnight…</span></div>}
          {snapshotError && configured && <div className="notice warning" role="alert"><strong>World sync interrupted</strong><span>{snapshotError}</span><button type="button" onClick={() => void refresh()}>Retry</button></div>}

          <div className="stats-row"><div><span>EXPLORERS</span><strong>{snapshot?.joined ?? '—'}</strong></div><div><span>MISSIONS PROVED</span><strong>{snapshot?.completed ?? '—'}</strong></div><div><span>YOUR VISITS</span><strong>{player?.visits.length ?? 0}<small> / 5</small></strong></div><div><span>YOUR SCORE</span><strong>{player?.score ?? 0}</strong></div></div>

          <div className="game-grid">
            <div className="world-card">
              <div className="card-heading"><div><span className="section-kicker">01 / SHARED WORLD</span><h3>Choose a location</h3></div><span className="live-pill"><i /> PUBLIC LEDGER</span></div>
              <p className="card-description">Everyone sees each visit. Choose your route carefully; extra stops can keep your mission less obvious.</p>
              <div className="map-grid">{PLACES.map((place, index) => <button className="place" type="button" key={place.name} disabled={!canPlay || !player || player.claimed || player.visits.length >= 5} onClick={() => void perform({ kind: 'visit', location: index }, `Visiting ${place.name}`)}><span className="place-icon">{place.icon}</span><span className="place-tag">{place.tag}</span><strong>{place.name}</strong><small>{place.description}</small><span className="place-action">Visit ↗</span></button>)}</div>
              <div className="visit-trail"><span>YOUR PUBLIC TRAIL</span><div>{Array.from({ length: 5 }, (_, index) => <div className={`trail-stop ${player?.visits[index] !== undefined ? 'filled' : ''}`} key={index}>{player?.visits[index] !== undefined ? PLACES[player.visits[index]].name : `0${index + 1}`}</div>)}</div></div>
            </div>

            <aside className="mission-card">
              <div className="card-heading"><div><span className="section-kicker">02 / ONLY YOU CAN SEE THIS</span><h3>Secret briefing</h3></div><span className="lock-icon">✳</span></div>
              {wallet.status === 'connected' && profile && route ? <><p className="mission-intro">Visit these locations in order somewhere within your five public moves:</p><div className="mission-route">{route.map((location, index) => <div key={index}><span>0{index + 1}</span><strong>{PLACES[location].name}</strong></div>)}</div><p className="mission-note">You may visit other places between these stops. The full mission stays in this browser.</p><div className="mission-status"><span className={player?.claimed ? 'complete' : readyToClaim ? 'ready' : ''}>{player?.claimed ? '✦ MISSION PROVED' : readyToClaim ? '✦ READY TO PROVE' : `${player?.visits.length ?? 0} OF 5 MOVES RECORDED`}</span></div>{player && !player.claimed && <button className="claim-button" type="button" disabled={!canPlay || player.visits.length !== 5 || !readyToClaim} onClick={() => void perform({ kind: 'claim' }, 'Proving your mission')}>Generate proof & claim point <span>↗</span></button>}</> : <div className="mission-locked"><span>✧</span><strong>Your mission is waiting.</strong><p>Connect Lace, then receive a private route generated in your browser.</p></div>}
              <div className="wallet-area"><span>YOUR WALLET</span>{wallet.status === 'connected' ? <><code>{wallet.address ? short(wallet.address) : 'Connected'}</code><button type="button" className="wallet-button secondary" onClick={wallet.disconnect}>Disconnect</button></> : <button className="wallet-button" type="button" disabled={wallet.status === 'detecting' || wallet.status === 'connecting'} onClick={() => void wallet.connect()}>{wallet.status === 'detecting' ? 'Detecting Lace…' : wallet.status === 'connecting' ? 'Connecting…' : 'Connect Lace wallet'}</button>}{wallet.error && <p className="inline-error" role="alert">{wallet.error}</p>}{wallet.status === 'connected' && !player && <button className="join-button" type="button" disabled={!canPlay} onClick={() => void perform({ kind: 'join' }, 'Joining the game')}>{profile ? 'Retry joining game' : 'Receive secret mission'} <span>↗</span></button>}{wallet.status === 'connected' && <small className="wallet-hint">{wallet.dustBalance?.balance === 0n ? 'Generate tDUST in Lace before playing.' : 'Each visit requires a Lace transaction and tDUST.'}</small>}</div>
            </aside>
          </div>

          {busy && <div className="progress" role="status" aria-live="polite"><span className="spinner" /><div><strong>{phase === 'proving' ? 'Generating your zero knowledge proof…' : `${actionLabel}…`}</strong><p>Keep this tab open and approve the transaction in Lace when prompted.</p></div></div>}
          {actionError && <div className="notice warning" role="alert"><strong>Action could not finish</strong><span>{actionError}</span></div>}
          {result && <div className="notice success" role="status"><strong>Action recorded on Midnight</strong><span>Transaction <code>{short(result.txId)}</code> · Block {result.blockHeight}</span></div>}
        </section>

        <section id="leaderboard" className="community-section"><div className="section-heading"><div><span className="section-kicker">THE SHARED STORY</span><h2>Visible actions.<br /><em>Hidden intentions.</em></h2></div><p>See where other players have traveled. Their objectives remain private even after a successful claim.</p></div><div className="community-grid"><div className="community-card"><div className="card-heading"><h3>Public routes</h3><span>LIVE LEDGER</span></div>{otherPlayers.length ? otherPlayers.map((entry) => <div className="player-row" key={entry.id}><span className="avatar">✧</span><div><strong>{short(entry.id)}</strong><small>{entry.visits.map((location) => PLACES[location]?.name ?? '?').join(' → ')}</small></div><span className="row-status">{entry.claimed ? 'PROVED' : `${entry.visits.length}/5`}</span></div>) : <p className="empty-state">No public visits yet. Be the first explorer.</p>}</div><div className="community-card"><div className="card-heading"><h3>Leaderboard</h3><span>PROVED POINTS</span></div>{leaderboard.length ? leaderboard.map((entry, index) => <div className="player-row" key={entry.id}><span className="rank">{String(index + 1).padStart(2, '0')}</span><div><strong>{short(entry.id)}</strong><small>Secret mission verified</small></div><strong className="points">{entry.score} PT</strong></div>) : <p className="empty-state">The first verified mission takes the lead.</p>}</div></div></section>

        <section id="privacy" className="privacy-section"><span className="section-kicker">HOW THE PROOF WORKS</span><h2>They see the journey.<br /><em>Not the assignment.</em></h2><div className="privacy-grid"><div><span className="privacy-number">01</span><h3>Private mission</h3><p>Your browser chooses a route and a random secret. Only a commitment is placed on the public ledger before you move.</p></div><div><span className="privacy-number">02</span><h3>Public actions</h3><p>Each visited location is published in order. Other players can follow your movements and try to guess your goal.</p></div><div><span className="privacy-number">03</span><h3>Verified result</h3><p>A zero knowledge proof checks your committed mission against your five visits. The chain stores the point, never the route itself.</p></div></div><p className="privacy-fineprint">Public routes can still reveal clues. Privacy here means the mission is not disclosed by the contract or proof; it does not promise that observers cannot infer it from gameplay.</p></section>
      </main>
      <footer><span>✧ SECRET MISSIONS</span><span>Built on Midnight · {MIDNIGHT_NETWORK.toUpperCase()}</span><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
