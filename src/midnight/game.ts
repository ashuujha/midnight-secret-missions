import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex, toHex, type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Binding,
  Proof,
  SignatureEnabled,
  Transaction,
  type FinalizedTransaction,
  type TransactionId,
} from '@midnight-ntwrk/midnight-js-protocol/ledger';
import {
  createProofProvider,
  type MidnightProviders,
  type ProofProvider,
  type UnboundTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import * as Game from '../../managed/secret-trail/contract/index.js';
import { inMemoryPrivateStateProvider } from '../in-memory-private-state-provider';
import { getErrorMessage, getProofServerOrigin } from '../utils/errors';
import { CachedZkConfigProvider } from './cached-zk-config';
import { warmProofServer } from './prover-readiness';

export const LOCATIONS = ['Museum', 'Cafe', 'Stadium', 'Park', 'Mall'] as const;
export type GameProfile = { secret: string; mission: number; salt: string; id: string };
export type Player = {
  id: string; visits: number[]; score: number; round: number; runStatus: number;
  challengeTokens: number; challengeStatus: number; challengerId: string | null;
  challengeDeadline: number | null;
};
export type GameSnapshot = { players: Player[]; completed: number; joined: number; challengesWon: number };
export type GameAction =
  | { kind: 'join' }
  | { kind: 'visit'; location: number }
  | { kind: 'claim' }
  | { kind: 'challenge'; targetId: string }
  | { kind: 'resolve'; targetId: string }
  | { kind: 'forfeit' }
  | { kind: 'nextRound' };
export type TransactionResult = { txId: string; blockHeight: string };
export type TransactionStage = 'proving' | 'balancing' | 'submitting' | 'confirming';

const PRIVATE_STATE_ID = 'secretTrailState';
type PrivateStateId = typeof PRIVATE_STATE_ID;
type CircuitKeys = 'join' | 'visit' | 'claim' | 'challenge' | 'resolveChallenge' | 'forfeit' | 'nextRound';
type PrivateState = { secret: Uint8Array; mission: bigint; salt: Uint8Array };
type Providers = MidnightProviders<CircuitKeys, PrivateStateId, PrivateState>;
let browserZkConfigProvider: CachedZkConfigProvider<CircuitKeys> | undefined;

function getBrowserZkConfigProvider(): CachedZkConfigProvider<CircuitKeys> {
  return browserZkConfigProvider ??= new CachedZkConfigProvider<CircuitKeys>(window.location.origin, fetch.bind(window));
}

export function prefetchGameCircuit(circuit: CircuitKeys): Promise<unknown> {
  return getBrowserZkConfigProvider().get(circuit);
}

const witnesses: Game.Witnesses<PrivateState> = {
  identitySecret(context) { return [context.privateState, context.privateState.secret]; },
  hiddenMission(context) { return [context.privateState, context.privateState.mission]; },
  missionSalt(context) { return [context.privateState, context.privateState.salt]; },
};

export const compiledGameContract = CompiledContract.make('secret-trail', Game.Contract).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets('./managed/secret-trail'),
);

export function createProfile(): GameProfile {
  const secret = crypto.getRandomValues(new Uint8Array(32));
  const mission = crypto.getRandomValues(new Uint8Array(1))[0] % 8;
  const salt = crypto.getRandomValues(new Uint8Array(32));
  return { secret: toHex(secret), mission, salt: toHex(salt), id: toHex(Game.pureCircuits.playerId(secret)) };
}

export function nextRoundProfile(profile: GameProfile): GameProfile {
  return { ...profile, mission: crypto.getRandomValues(new Uint8Array(1))[0] % 8,
    salt: toHex(crypto.getRandomValues(new Uint8Array(32))) };
}

export function missionRoute(mission: number): number[] {
  if (!Number.isInteger(mission) || mission < 0 || mission > 7) throw new Error('Invalid mission.');
  const value = BigInt(mission);
  return [
    Number(Game.pureCircuits.missionFirst(value)),
    Number(Game.pureCircuits.missionSecond(value)),
    Number(Game.pureCircuits.missionThird(value)),
  ];
}

const storageKey = (wallet: string, contract: string) => `secret-trail:v2:${contract}:${wallet}`;

export function loadProfile(wallet: string, contract: string): GameProfile | null {
  try {
    const raw = localStorage.getItem(storageKey(wallet, contract));
    if (!raw) return null;
    const value = JSON.parse(raw) as GameProfile;
    if (!/^[0-9a-f]{64}$/.test(value.secret) || !/^[0-9a-f]{64}$/.test(value.salt)
      || !Number.isInteger(value.mission) || value.mission < 0 || value.mission > 7) return null;
    const id = toHex(Game.pureCircuits.playerId(fromHex(value.secret)));
    return { secret: value.secret, mission: value.mission, salt: value.salt, id };
  } catch { return null; }
}

export function saveProfile(wallet: string, contract: string, profile: GameProfile): void {
  localStorage.setItem(storageKey(wallet, contract), JSON.stringify(profile));
}

const stage = async <T,>(label: string, operation: () => Promise<T>): Promise<T> => {
  try { return await operation(); }
  catch (error) { throw new Error(`${label}: ${getErrorMessage(error) || 'Unknown error'}`, { cause: error }); }
};

async function createProviders(api: ConnectedAPI, networkId: string, onStage?: (stage: TransactionStage) => void): Promise<Providers> {
  setNetworkId(networkId);
  const configuration = await stage('Reading Lace configuration failed', () => api.getConfiguration());
  if (configuration.networkId !== networkId) throw new Error(`Network mismatch. Switch Lace to ${networkId}.`);
  const keys = await stage('Reading Lace addresses failed', () => api.getShieldedAddresses());
  const zkConfigProvider = getBrowserZkConfigProvider();
  const hostedProver = import.meta.env.VITE_PROOF_SERVER_URL?.trim();
  if (hostedProver) await stage('Proof server could not become ready', warmProofServer);
  const proofProvider: ProofProvider = hostedProver
    ? httpClientProofProvider(hostedProver, zkConfigProvider)
    : createProofProvider(await stage('Initializing Lace proving failed', () => api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider())));
  const localState = inMemoryPrivateStateProvider<PrivateStateId, PrivateState>();
  return {
    privateStateProvider: localState,
    zkConfigProvider,
    proofProvider: { proveTx: (transaction, config) => {
      onStage?.('proving');
      return stage('Proof service request failed', () => proofProvider.proveTx(transaction, config));
    } },
    publicDataProvider: indexerPublicDataProvider(configuration.indexerUri, configuration.indexerWsUri),
    walletProvider: {
      getCoinPublicKey: () => keys.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => keys.shieldedEncryptionPublicKey,
      balanceTx: async (transaction: UnboundTransaction): Promise<FinalizedTransaction> => {
        onStage?.('balancing');
        const origin = getProofServerOrigin(configuration.proverServerUri);
        const balanced = await stage(`Lace transaction balancing failed${origin ? ` (wallet proof server: ${origin})` : ''}`,
          () => api.balanceUnsealedTransaction(toHex(transaction.serialize())));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>('signature', 'proof', 'binding', fromHex(balanced.tx));
      },
    },
    midnightProvider: {
      submitTx: async (transaction: FinalizedTransaction): Promise<TransactionId> => {
        onStage?.('submitting');
        await stage('Lace transaction submission failed', () => api.submitTransaction(toHex(transaction.serialize())));
        onStage?.('confirming');
        return transaction.identifiers()[0];
      },
    },
  };
}

export async function callGameCircuit(
  api: ConnectedAPI,
  networkId: string,
  address: string,
  profile: GameProfile,
  action: GameAction,
  onStage?: (stage: TransactionStage) => void,
): Promise<TransactionResult> {
  if (!/^[0-9a-fA-F]{64}$/.test(address)) throw new Error('The game contract address is not configured.');
  const connection = await stage('Reading Lace connection failed', () => api.getConnectionStatus());
  if (connection.status !== 'connected' || connection.networkId !== networkId) throw new Error(`Connect Lace to ${networkId} first.`);
  const dust = await stage('Reading DUST balance failed', () => api.getDustBalance());
  if (dust.cap <= 0n || dust.balance <= 0n) throw new Error('Lace has no usable tDUST. Generate tDUST and wait for the wallet to sync.');
  const providers = await createProviders(api, networkId, onStage);
  const contractAddress = address as ContractAddress;
  providers.privateStateProvider.setContractAddress(contractAddress);
  const deployed = await stage('Loading the game contract failed', () => findDeployedContract(providers, {
    contractAddress,
    compiledContract: compiledGameContract,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: { secret: fromHex(profile.secret), mission: BigInt(profile.mission), salt: fromHex(profile.salt) },
  }));
  onStage?.('proving');
  const tx = await stage('Proving or submitting the game action failed', () => {
    if (action.kind === 'join') return deployed.callTx.join();
    if (action.kind === 'visit') return deployed.callTx.visit(fromHex(profile.id), BigInt(action.location));
    if (action.kind === 'claim') return deployed.callTx.claim(fromHex(profile.id));
    if (action.kind === 'challenge') return deployed.callTx.challenge(fromHex(profile.id), fromHex(action.targetId), BigInt(Date.now()));
    if (action.kind === 'resolve') return deployed.callTx.resolveChallenge(fromHex(action.targetId));
    if (action.kind === 'forfeit') return deployed.callTx.forfeit(fromHex(profile.id));
    return deployed.callTx.nextRound(fromHex(profile.id));
  });
  return { txId: tx.public.txId, blockHeight: tx.public.blockHeight.toString() };
}

export async function deployGameContract(
  api: ConnectedAPI,
  networkId: string,
  onStage?: (stage: TransactionStage) => void,
): Promise<string> {
  const connection = await stage('Reading Lace connection failed', () => api.getConnectionStatus());
  if (connection.status !== 'connected' || connection.networkId !== networkId) throw new Error(`Connect Lace to ${networkId} first.`);
  const dust = await stage('Reading DUST balance failed', () => api.getDustBalance());
  if (dust.cap <= 0n || dust.balance <= 0n) throw new Error('Lace has no usable tDUST. Generate tDUST and wait for the wallet to sync.');
  const providers = await createProviders(api, networkId, onStage);
  onStage?.('balancing');
  const deployed = await stage('Deploying the game contract failed', () => deployContract(providers, {
    compiledContract: compiledGameContract,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: { secret: new Uint8Array(32), mission: 0n, salt: new Uint8Array(32) },
  }));
  return deployed.deployTxData.public.contractAddress;
}

export async function readGameSnapshot(address: string, networkId: string): Promise<GameSnapshot> {
  if (!/^[0-9a-fA-F]{64}$/.test(address)) throw new Error('Set VITE_CONTRACT_ADDRESS to a deployed game contract.');
  setNetworkId(networkId);
  const host = networkId === 'preview' ? 'preview' : 'preprod';
  const provider = indexerPublicDataProvider(
    `https://indexer.${host}.midnight.network/api/v4/graphql`,
    `wss://indexer.${host}.midnight.network/api/v4/graphql/ws`,
  );
  const state = await provider.queryContractState(address as ContractAddress);
  if (!state) throw new Error('The game contract was not found on the selected network.');
  const publicState = Game.ledger(state.data);
  const players: Player[] = Array.from(publicState.moveCounts, ([key, count]) => {
    const visits = [publicState.firstVisits, publicState.secondVisits, publicState.thirdVisits,
      publicState.fourthVisits, publicState.fifthVisits]
      .slice(0, Number(count))
      .map((map) => Number(map.lookup(key)));
    const challengeStatus = Number(publicState.challengeStatus.lookup(key));
    return {
      id: toHex(key), visits, score: Number(publicState.scores.lookup(key)),
      round: Number(publicState.rounds.lookup(key)),
      runStatus: Number(publicState.runStatus.lookup(key)),
      challengeTokens: Number(publicState.challengeTokens.lookup(key)),
      challengeStatus,
      challengerId: challengeStatus ? toHex(publicState.challengeBy.lookup(key)) : null,
      challengeDeadline: challengeStatus ? Number(publicState.challengeDeadlines.lookup(key)) : null,
    };
  });
  players.sort((a, b) => b.score - a.score || b.visits.length - a.visits.length);
  return { players, completed: Number(publicState.completedMissions), joined: Number(publicState.playerCount),
    challengesWon: Number(publicState.successfulChallenges) };
}
