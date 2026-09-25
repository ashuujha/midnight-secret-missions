import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTRACT_ADDRESS, MIDNIGHT_NETWORK, useMidnight } from './useMidnight';
import type {
  GameAction,
  GameProfile,
  GameSnapshot,
  TransactionResult,
  TransactionStage,
} from '../midnight/game';
import { friendlyCircuitError } from '../utils/errors';
import { ROUTES } from '../game/table';

export const configured = /^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS);

export function useLiveGame() {
  const actionLock = useRef(false);
  const wallet = useMidnight();
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'preparing' | TransactionStage>(
    'idle',
  );
  const [actionLabel, setActionLabel] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async () => {
    if (!configured) return;
    try {
      const { readGameSnapshot } = await import('../midnight/game');
      const next = await readGameSnapshot(CONTRACT_ADDRESS, MIDNIGHT_NETWORK);
      setSnapshot(next);
      setSnapshotError(null);
    } catch (error) {
      setSnapshotError(
        error instanceof Error
          ? error.message
          : 'Could not load the public game board.',
      );
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
    void import('../midnight/prover-readiness')
      .then(({ warmProofServer }) => warmProofServer())
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setProfileLoaded(false);
    if (!wallet.address || !configured) {
      setProfile(null);
      return;
    }
    void import('../midnight/game')
      .then(({ loadProfile }) => {
        if (active) {
          setProfile(loadProfile(wallet.address!, CONTRACT_ADDRESS));
          setProfileLoaded(true);
        }
      })
      .catch((error) => {
        if (active)
          setActionError(friendlyCircuitError(error, wallet.networkId));
      });
    return () => {
      active = false;
    };
  }, [wallet.address]);

  const player = snapshot?.players.find((entry) => entry.id === profile?.id);
  const route = profile ? ROUTES[profile.mission] : null;
  const busy = phase !== 'idle';
  const canPlay =
    wallet.status === 'connected' &&
    !!wallet.connectedAPI &&
    configured &&
    profileLoaded &&
    !!snapshot &&
    !snapshotError &&
    !busy;

  useEffect(() => {
    if (wallet.status !== 'connected' || !configured) return;
    const circuit = !player
      ? 'join'
      : player.runStatus !== 0
        ? 'nextRound'
        : player.visits.length >= 4
          ? 'claim'
          : 'visit';
    void import('../midnight/game')
      .then(({ prefetchGameCircuit }) => prefetchGameCircuit(circuit))
      .catch(() => undefined);
  }, [wallet.status, player?.visits.length, player?.runStatus]);

  useEffect(() => {
    if (
      !player ||
      player.challengeTokens < 1 ||
      !snapshot?.players.some(
        (entry) =>
          entry.id !== player.id &&
          entry.runStatus === 0 &&
          entry.visits.length > 0 &&
          entry.challengeStatus === 0,
      )
    )
      return;
    void import('../midnight/game')
      .then(({ prefetchGameCircuit }) => prefetchGameCircuit('challenge'))
      .catch(() => undefined);
  }, [player?.id, player?.challengeTokens, snapshot]);

  const perform = async (action: GameAction, label: string) => {
    if (
      !wallet.connectedAPI ||
      !wallet.address ||
      !canPlay ||
      actionLock.current
    )
      return false;
    actionLock.current = true;
    setActionError(null);
    setResult(null);
    setPhase('preparing');
    setActionLabel(label);
    try {
      const game = await import('../midnight/game');
      let current = profile;
      if (action.kind === 'join' && !current) {
        current = game.createProfile();
        game.saveProfile(wallet.address, CONTRACT_ADDRESS, current);
        setProfile(current);
      }
      if (!current)
        throw new Error(
          'Your private mission was not found in this browser. Join a new round.',
        );
      if (action.kind === 'nextRound') {
        current = game.nextRoundProfile(current);
        game.saveProfile(wallet.address, CONTRACT_ADDRESS, current);
        setProfile(current);
      }
      const submitted = await game.callGameCircuit(
        wallet.connectedAPI,
        wallet.networkId,
        CONTRACT_ADDRESS,
        current,
        action,
        setPhase,
      );
      setResult(submitted);
      await refresh();
      window.setTimeout(() => void refresh(), 4_000);
      void wallet.refreshDustBalance();
      return true;
    } catch (error) {
      setActionError(friendlyCircuitError(error, wallet.networkId));
      return false;
    } finally {
      actionLock.current = false;
      setPhase('idle');
    }
  };

  const deployLocally = async () => {
    if (
      !wallet.connectedAPI ||
      busy ||
      actionLock.current ||
      !import.meta.env.DEV
    )
      return;
    actionLock.current = true;
    setActionError(null);
    setPhase('preparing');
    setActionLabel('Deploying game contract');
    try {
      const { deployGameContract } = await import('../midnight/game');
      const address = await deployGameContract(
        wallet.connectedAPI,
        wallet.networkId,
        setPhase,
      );
      localStorage.setItem('secret-trail-dev-contract', address);
      setDeployedAddress(address);
    } catch (error) {
      setActionError(friendlyCircuitError(error, wallet.networkId));
      return false;
    } finally {
      actionLock.current = false;
      setPhase('idle');
    }
  };

  return {
    wallet,
    snapshot,
    snapshotError,
    profile,
    player,
    phase,
    actionLabel,
    actionError,
    result,
    deployedAddress,
    now,
    busy,
    canPlay,
    route,
    refresh,
    perform,
    deployLocally,
  };
}
