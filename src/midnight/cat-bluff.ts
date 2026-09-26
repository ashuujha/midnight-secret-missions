import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import {
  deployContract,
  findDeployedContract,
} from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  fromHex,
  toHex,
  type ContractAddress,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  Binding,
  Proof,
  SignatureEnabled,
  Transaction,
  type FinalizedTransaction,
  type TransactionId,
} from "@midnight-ntwrk/midnight-js-protocol/ledger";
import {
  createProofProvider,
  type MidnightProviders,
  type ProofProvider,
  type UnboundTransaction,
} from "@midnight-ntwrk/midnight-js-types";
import * as Game from "../../managed/cat-bluff/contract/index.js";
import { inMemoryPrivateStateProvider } from "../in-memory-private-state-provider";
import { getErrorMessage, getProofServerOrigin } from "../utils/errors";
import { CachedZkConfigProvider } from "./cached-zk-config";
import { warmProofServer } from "./prover-readiness";

import { countsOf, drawCards, type Table } from "../game/cat-bluff";
export type HandState = {
  secret: string;
  id: string;
  counts: number[];
  salt: string;
  draws: number[];
  lastCard?: { cat: number; salt: string };
  candidate?: {
    counts: number[];
    salt: string;
    cat: number;
    cardSalt: string;
    commitment: string;
  };
};
export type Action =
  | { kind: "create" | "join" | "pass" | "call" | "prove" | "timeout" }
  | { kind: "play"; cat: number; claim: number };
export type TransactionStage =
  | "preparing"
  | "proving"
  | "balancing"
  | "submitting"
  | "confirming";
export type TransactionResult = {
  txId: string;
  blockHeight: string;
  milliseconds: number;
};
const PRIVATE_STATE_ID = "catBluffState";
type PrivateStateId = typeof PRIVATE_STATE_ID;
type CircuitKeys =
  | "createRoom"
  | "joinRoom"
  | "playCard"
  | "passClaim"
  | "callBluff"
  | "proveClaim"
  | "settleTimeout";
type PrivateState = {
  secret: Uint8Array;
  counts: bigint[];
  salt: Uint8Array;
  nextSalt: Uint8Array;
  cat: bigint;
  cardSalt: Uint8Array;
  draws: bigint[];
};
type Providers = MidnightProviders<CircuitKeys, PrivateStateId, PrivateState>;
let browserZkConfigProvider: CachedZkConfigProvider<CircuitKeys> | undefined;
function getBrowserZkConfigProvider() {
  return (browserZkConfigProvider ??= new CachedZkConfigProvider<CircuitKeys>(
    window.location.origin,
    fetch.bind(window),
  ));
}
export function prefetch(circuit: CircuitKeys) {
  return getBrowserZkConfigProvider().get(circuit);
}
const witnesses: Game.Witnesses<PrivateState> = {
  identitySecret: (c) => [c.privateState, c.privateState.secret],
  handCounts: (c) => [c.privateState, c.privateState.counts],
  handSalt: (c) => [c.privateState, c.privateState.salt],
  nextHandSalt: (c) => [c.privateState, c.privateState.nextSalt],
  playedCat: (c) => [c.privateState, c.privateState.cat],
  playedSalt: (c) => [c.privateState, c.privateState.cardSalt],
  drawnCats: (c) => [c.privateState, c.privateState.draws],
};
export const compiled = CompiledContract.make("cat-bluff", Game.Contract).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets("./managed/cat-bluff"),
);
export const randomHex = () =>
  toHex(crypto.getRandomValues(new Uint8Array(32)));
const key = (wallet: string, contract: string, room: string) =>
  `cat-bluff:v3:${contract}:${room}:${wallet}`;
export function saveHand(
  wallet: string,
  contract: string,
  room: string,
  hand: HandState,
) {
  localStorage.setItem(key(wallet, contract, room), JSON.stringify(hand));
}
export function createHand(): HandState {
  const secret = randomHex();
  return {
    secret,
    id: toHex(Game.pureCircuits.playerId(fromHex(secret))),
    counts: countsOf(drawCards()),
    salt: randomHex(),
    draws: [0, 0, 0, 0, 0],
  };
}
export function loadHand(
  wallet: string,
  contract: string,
  room: string,
): HandState | null {
  const data = localStorage.getItem(key(wallet, contract, room));
  if (!data) return null;
  try {
    const h = JSON.parse(data) as HandState;
    const hex = (value: unknown) =>
      typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
    const counts = (value: unknown) =>
      Array.isArray(value) &&
      value.length === 5 &&
      value.every((n) => Number.isInteger(n) && n >= 0 && n <= 64) &&
      value.reduce((a, b) => a + b, 0) <= 64;
    const card = (value: { cat: number; salt: string }) =>
      Number.isInteger(value.cat) &&
      value.cat >= 0 &&
      value.cat < 5 &&
      hex(value.salt);
    if (
      !hex(h.secret) ||
      !hex(h.id) ||
      !hex(h.salt) ||
      !counts(h.counts) ||
      !counts(h.draws) ||
      h.id !== toHex(Game.pureCircuits.playerId(fromHex(h.secret)))
    )
      throw new Error();
    if (h.lastCard && !card(h.lastCard)) throw new Error();
    if (
      h.candidate &&
      (!counts(h.candidate.counts) ||
        !hex(h.candidate.salt) ||
        !card({ cat: h.candidate.cat, salt: h.candidate.cardSalt }) ||
        h.candidate.commitment !==
          toHex(
            Game.pureCircuits.handCommitment(
              h.candidate.counts.map(BigInt),
              fromHex(h.candidate.salt),
            ),
          ))
    )
      throw new Error();
    return h;
  } catch {
    throw new Error(
      "The saved private hand is damaged. It has not been overwritten. Return to your original browser or restore its private backup.",
    );
  }
}
export function reconcileHand(
  hand: HandState,
  commitment: string,
  penalties: number,
): HandState {
  let h = { ...hand };
  if (h.candidate?.commitment === commitment) {
    h = {
      ...h,
      counts: h.candidate.counts,
      salt: h.candidate.salt,
      draws: [0, 0, 0, 0, 0],
      lastCard: { cat: h.candidate.cat, salt: h.candidate.cardSalt },
      candidate: undefined,
    };
  }
  const current = toHex(
    Game.pureCircuits.handCommitment(h.counts.map(BigInt), fromHex(h.salt)),
  );
  if (current !== commitment)
    throw new Error(
      "Your saved hand does not match this table. Keep the original browser and wallet; do not clear its storage.",
    );
  const known = h.draws.reduce((a, b) => a + b, 0);
  if (known < penalties) {
    const added = countsOf(drawCards(penalties - known));
    h = { ...h, draws: h.draws.map((n, i) => n + added[i]) };
  }
  if (known > penalties) h = { ...h, draws: [0, 0, 0, 0, 0] };
  return h;
}
const stage = async <T>(
  label: string,
  operation: () => Promise<T>,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw new Error(`${label}: ${getErrorMessage(error) || "Unknown error"}`, {
      cause: error,
    });
  }
};

async function createProviders(
  api: ConnectedAPI,
  networkId: string,
  onStage?: (stage: TransactionStage) => void,
): Promise<Providers> {
  setNetworkId(networkId);
  const [configuration, keys] = await Promise.all([
    stage("Reading Lace configuration failed", () => api.getConfiguration()),
    stage("Reading Lace addresses failed", () => api.getShieldedAddresses()),
  ]);
  if (configuration.networkId !== networkId)
    throw new Error(`Network mismatch. Switch Lace to ${networkId}.`);
  const zkConfigProvider = getBrowserZkConfigProvider();
  const hostedProver = import.meta.env.VITE_PROOF_SERVER_URL?.trim();

  const proofProvider: ProofProvider = hostedProver
    ? httpClientProofProvider(hostedProver, zkConfigProvider)
    : createProofProvider(
        await stage("Initializing Lace proving failed", () =>
          api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider()),
        ),
      );
  const localState = inMemoryPrivateStateProvider<
    PrivateStateId,
    PrivateState
  >();
  return {
    privateStateProvider: localState,
    zkConfigProvider,
    proofProvider: {
      proveTx: (transaction, config) => {
        onStage?.("proving");
        return stage("Proof service request failed", async () => {
          if (hostedProver) await warmProofServer();
          return proofProvider.proveTx(transaction, config);
        });
      },
    },
    publicDataProvider: indexerPublicDataProvider(
      configuration.indexerUri,
      configuration.indexerWsUri,
    ),
    walletProvider: {
      getCoinPublicKey: () => keys.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => keys.shieldedEncryptionPublicKey,
      balanceTx: async (
        transaction: UnboundTransaction,
      ): Promise<FinalizedTransaction> => {
        onStage?.("balancing");
        const origin = getProofServerOrigin(configuration.proverServerUri);
        const balanced = await stage(
          `Lace transaction balancing failed${origin ? ` (wallet proof server: ${origin})` : ""}`,
          () => api.balanceUnsealedTransaction(toHex(transaction.serialize())),
        );
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
          "signature",
          "proof",
          "binding",
          fromHex(balanced.tx),
        );
      },
    },
    midnightProvider: {
      submitTx: async (
        transaction: FinalizedTransaction,
      ): Promise<TransactionId> => {
        onStage?.("submitting");
        await stage("Lace transaction submission failed", () =>
          api.submitTransaction(toHex(transaction.serialize())),
        );
        onStage?.("confirming");
        return transaction.identifiers()[0];
      },
    },
  };
}

export async function deploy(
  api: ConnectedAPI,
  network: string,
  onStage: (s: TransactionStage) => void,
): Promise<string> {
  const providers = await createProviders(api, network, onStage);
  const h = createHand();
  const result = await deployContract(providers, {
    compiledContract: compiled,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {
      secret: fromHex(h.secret),
      counts: h.counts.map(BigInt),
      salt: fromHex(h.salt),
      nextSalt: fromHex(randomHex()),
      cat: 0n,
      cardSalt: fromHex(randomHex()),
      draws: [0n, 0n, 0n, 0n, 0n],
    },
  });
  return result.deployTxData.public.contractAddress;
}
export async function transact(
  api: ConnectedAPI,
  network: string,
  address: string,
  room: string,
  hand: HandState,
  action: Action,
  persist: (h: HandState) => void,
  onStage: (s: TransactionStage) => void,
): Promise<TransactionResult> {
  const begun = performance.now();
  const [connection, dust] = await Promise.all([
    api.getConnectionStatus(),
    api.getDustBalance(),
  ]);
  if (connection.status !== "connected" || connection.networkId !== network)
    throw new Error(`Connect Lace to ${network} first.`);
  if (dust.balance <= 0n || dust.cap <= 0n)
    throw new Error(
      "Lace has no usable tDUST. Generate tDUST and wait for the wallet to sync.",
    );
  let h = { ...hand };
  if (action.kind === "play") {
    if (h.candidate)
      throw new Error(
        "Your previous card may still be pending. Refresh the table and check Lace before playing another card.",
      );
    const counts = h.counts.map(
      (n, i) => n + h.draws[i] - (action.cat === i ? 1 : 0),
    );
    if (counts.some((n) => n < 0))
      throw new Error("That card is not in your hand.");
    const salt = randomHex(),
      cardSalt = randomHex();
    h = {
      ...h,
      candidate: {
        counts,
        salt,
        cardSalt,
        cat: action.cat,
        commitment: toHex(
          Game.pureCircuits.handCommitment(counts.map(BigInt), fromHex(salt)),
        ),
      },
    };
    persist(h); // Keep the old hand plus the candidate until the chain confirms it.
  }
  const card =
    action.kind === "play"
      ? { cat: action.cat, salt: h.candidate!.cardSalt }
      : (h.lastCard ?? { cat: 0, salt: randomHex() });
  const privateState: PrivateState = {
    secret: fromHex(h.secret),
    counts: h.counts.map(BigInt),
    salt: fromHex(h.salt),
    nextSalt: fromHex(h.candidate?.salt ?? randomHex()),
    cat: BigInt(card.cat),
    cardSalt: fromHex(card.salt),
    draws: h.draws.map(BigInt),
  };
  let mayBeSubmitted = false;
  try {
    const providers = await createProviders(api, network, (s) => {
      if (s === "submitting" || s === "confirming") mayBeSubmitted = true;
      onStage(s);
    });
    providers.privateStateProvider.setContractAddress(address);
    const contract = await findDeployedContract(providers, {
      contractAddress: address,
      compiledContract: compiled,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: privateState,
    });
    onStage("proving");
    const id = fromHex(room);
    const tx = await (action.kind === "create"
      ? contract.callTx.createRoom(id)
      : action.kind === "join"
        ? contract.callTx.joinRoom(id)
        : action.kind === "play"
          ? contract.callTx.playCard(
              id,
              BigInt(action.claim),
              BigInt(Date.now()),
            )
          : action.kind === "pass"
            ? contract.callTx.passClaim(id)
            : action.kind === "call"
              ? contract.callTx.callBluff(id, BigInt(Date.now()))
              : action.kind === "prove"
                ? contract.callTx.proveClaim(id)
                : contract.callTx.settleTimeout(id));
    // Keep both openings until the indexer exposes the confirmed commitment.
    // This also recovers a successful play after a browser refresh or RPC timeout.
    return {
      txId: tx.public.txId,
      blockHeight: tx.public.blockHeight.toString(),
      milliseconds: Math.round(performance.now() - begun),
    };
  } catch (error) {
    if (action.kind === "play" && !mayBeSubmitted)
      persist({ ...h, candidate: undefined });
    throw error;
  }
}
export async function readTable(
  address: string,
  roomId: string,
  network: string,
): Promise<{ table: Table; commitments: Record<string, string> }> {
  setNetworkId(network);
  const host = network === "preview" ? "preview" : "preprod";
  const provider = indexerPublicDataProvider(
    `https://indexer.${host}.midnight.network/api/v4/graphql`,
    `wss://indexer.${host}.midnight.network/api/v4/graphql/ws`,
  );
  const state = await provider.queryContractState(address);
  if (!state) throw new Error("Cat Bluff contract was not found.");
  const l = Game.ledger(state.data);
  if (l.schemaVersion !== 3n)
    throw new Error(
      "This is not the Cat Bluff card contract. The old Secret Trail address cannot be used.",
    );
  const room = fromHex(roomId);
  if (!l.roomSizes.member(room))
    throw new Error(
      "This table is not on-chain yet. Ask the host to finish creating it.",
    );
  const n = (m: {
    member: (k: Uint8Array) => boolean;
    lookup: (k: Uint8Array) => bigint;
  }) => (m.member(room) ? Number(m.lookup(room)) : 0);
  const hex = (m: {
    member: (k: Uint8Array) => boolean;
    lookup: (k: Uint8Array) => Uint8Array;
  }) => (m.member(room) ? toHex(m.lookup(room)) : "");
  const commitments: Record<string, string> = {};
  const players = Array.from({ length: n(l.roomSizes) }, (_, i) => {
    const id = l.seats.lookup(Game.pureCircuits.seatKey(room, BigInt(i)));
    commitments[toHex(id)] = toHex(l.hands.lookup(id));
    return {
      id: toHex(id),
      count: Number(l.handSizes.lookup(id)),
      penalties: Number(l.penaltyDraws.lookup(id)),
    };
  });
  return {
    commitments,
    table: {
      id: roomId,
      players,
      host: hex(l.roomHosts),
      status: n(l.roomStatus),
      turn: n(l.turns),
      phase: n(l.phases),
      responder: n(l.responders),
      passes: n(l.passes),
      play: n(l.playNumbers),
      claim: n(l.claims),
      commitment: hex(l.cards),
      actor: hex(l.lastActors),
      challenger: hex(l.challengers),
      deadline: n(l.deadlines),
      winner: hex(l.winners),
      outcome: n(l.outcomes),
      loser: hex(l.lastLosers),
    },
  };
}
