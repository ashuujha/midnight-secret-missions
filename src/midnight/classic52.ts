import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import {
  deployContract,
  findDeployedContract,
} from "@midnight-ntwrk/midnight-js-contracts";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  fromHex,
  toHex,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as Game from "../../managed/cat-bluff52/contract/index.js";
import { CachedZkConfigProvider } from "./cached-zk-config";
import { createWalletProviders } from "./wallet-providers";
import {
  shuffledDeck,
  type ClassicView,
  type TurnRecord,
} from "../game/classic-rules";
import type { TransactionStage, TransactionResult } from "./cat-bluff";
export type Session = { secret: string; key: string; id: string };
export type Action =
  | {
      kind:
        | "create"
        | "join"
        | "start"
        | "shuffle"
        | "deal"
        | "pass"
        | "call"
        | "reveal"
        | "transfer";
    }
  | { kind: "play"; cards: number[] };
export type PrivateState = {
  secret: Uint8Array;
  key: bigint;
  order: bigint[];
  randomness: bigint[];
  opened: bigint[];
};
export type Circuit = keyof Game.ProvableCircuits<PrivateState>;
export const ACTION_CIRCUIT = {
  create: "createRoom",
  join: "joinRoom",
  start: "startRound",
  shuffle: "shuffleDeck",
  deal: "shareDeal",
  play: "playCards",
  pass: "passClaim",
  call: "callBluff",
  reveal: "revealTurn",
  transfer: "transferPile",
} as const;
const PRIVATE_STATE_ID = "classic52State";
export const witnesses: Game.Witnesses<PrivateState> = {
  identitySecret: (c) => [c.privateState, c.privateState.secret],
  encryptionSecret: (c) => [c.privateState, c.privateState.key],
  permutation: (c) => [c.privateState, c.privateState.order],
  blindingFactors: (c) => [c.privateState, c.privateState.randomness],
  openedCards: (c) => [c.privateState, c.privateState.opened],
};
export const compiled = CompiledContract.make(
  "cat-bluff52",
  Game.Contract,
).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets("./managed/cat-bluff52"),
);
let assets: CachedZkConfigProvider<Circuit> | undefined;
const config = () =>
  (assets ??= new CachedZkConfigProvider<Circuit>(
    `${location.origin}/classic52`,
    fetch.bind(window),
  ));
export const prefetch = (circuit: Circuit) => config().get(circuit);
export const randomHex = () =>
  toHex(crypto.getRandomValues(new Uint8Array(32)));
const scalar = () => {
  let value = 0n;
  while (value === 0n)
    value = BigInt("0x" + toHex(crypto.getRandomValues(new Uint8Array(31))));
  return value;
};
export function newSession(): Session {
  const secret = randomHex();
  return {
    secret,
    key: scalar().toString(16).padStart(62, "0"),
    id: toHex(Game.pureCircuits.playerId(fromHex(secret))),
  };
}
const storageKey = (wallet: string, address: string, room: string) =>
  `cat-bluff:v4:${address}:${room}:${wallet}`;
export function saveSession(
  wallet: string,
  address: string,
  room: string,
  s: Session,
) {
  localStorage.setItem(storageKey(wallet, address, room), JSON.stringify(s));
}
export function loadSession(
  wallet: string,
  address: string,
  room: string,
): Session | null {
  const raw = localStorage.getItem(storageKey(wallet, address, room));
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (
      !/^[a-f0-9]{64}$/.test(s.secret) ||
      !/^[a-f0-9]{62}$/.test(s.key) ||
      BigInt("0x" + s.key) === 0n ||
      s.id !== toHex(Game.pureCircuits.playerId(fromHex(s.secret)))
    )
      throw new Error();
    return s;
  } catch {
    throw new Error(
      "Your private table key is damaged. It has not been replaced. Return to the browser used to join this table.",
    );
  }
}
export type Snapshot = {
  room: string;
  state: Game.Room;
  players: string[];
  keys: ReturnType<typeof Game.pureCircuits.publicKey>[];
  deck: Game.CipherCard[];
  owners: number[];
  custodians: number[];
  selected: boolean[];
  history: TurnRecord[];
  revision: string;
};
const pointId = (p: { x: bigint; y: bigint }) => `${p.x}:${p.y}`;
const cardPoints = new Map(
  Array.from({ length: 52 }, (_, id) => [
    pointId(Game.pureCircuits.cardPoint(BigInt(id))),
    id,
  ]),
);
export function privateCards(
  snapshot: Snapshot,
  session: Session | null,
): { slot: number; id: number }[] {
  if (!session || snapshot.state.status < 3n) return [];
  const seat = snapshot.players.indexOf(session.id);
  if (seat < 0) return [];
  const key = BigInt("0x" + session.key);
  if (
    pointId(Game.pureCircuits.publicKey(key)) !== pointId(snapshot.keys[seat])
  )
    throw new Error(
      "The saved decryption key does not match your seat. Keep the original browser and wallet.",
    );
  return snapshot.deck.flatMap((cipher, slot) => {
    if (snapshot.owners[slot] !== seat) return [];
    const id = cardPoints.get(
      pointId(Game.pureCircuits.decryptCard(cipher, key)),
    );
    if (id === undefined)
      throw new Error(
        "Your encrypted cards could not be opened. Refresh the confirmed table state.",
      );
    return [{ slot, id }];
  });
}
export function toView(s: Snapshot, session: Session | null): ClassicView {
  const t = s.state;
  const viewer = session ? s.players.indexOf(session.id) : -1;
  const cards = privateCards(s, session);
  return {
    round: Number(t.round),
    players: s.players.map((id, i) => ({
      id,
      name: i === viewer ? "You" : `Player ${i + 1}`,
      count: s.owners.filter((o) => o === i).length,
    })),
    hand: cards.map((c) => c.id),
    viewer,
    turn: Number(t.turn),
    rank: Number(t.rank),
    phase:
      t.status === 4n
        ? "finished"
        : (["play", "respond", "reveal", "transfer"] as const)[Number(t.phase)],
    responder: Number(t.responder),
    pileSize: Number(t.pile),
    latest: s.history.at(-1),
    history: s.history,
    winner: t.winner === 255n ? null : Number(t.winner),
  };
}
export async function readTable(
  address: string,
  roomId: string,
  network: string,
): Promise<Snapshot> {
  setNetworkId(network);
  const host = network === "preview" ? "preview" : "preprod";
  const provider = indexerPublicDataProvider(
    `https://indexer.${host}.midnight.network/api/v4/graphql`,
    `wss://indexer.${host}.midnight.network/api/v4/graphql/ws`,
  );
  const state = await provider.queryContractState(address);
  if (!state) throw new Error("Classic 52 contract was not found.");
  const ledger = Game.ledger(state.data);
  if (ledger.schemaVersion !== 4n)
    throw new Error(
      "This address uses different game rules. Classic 52 needs its V4 contract; earlier five-cat tables remain separate.",
    );
  const room = fromHex(roomId);
  if (!ledger.rooms.member(room))
    throw new Error(
      "This room is not confirmed yet. Wait for the host’s creation transaction.",
    );
  const t = ledger.rooms.lookup(room);
  const history: TurnRecord[] = [];
  for (let i = Math.max(1, Number(t.play) - 19); i <= Number(t.play); i++) {
    const r = ledger.turns.lookup(
      Game.pureCircuits.turnKey(room, t.round, BigInt(i)),
    );
    const revealed = r.revealed.filter((c) => c !== 255n).map(Number);
    history.push({
      number: i,
      actor: Number(r.actor),
      rank: Number(r.rank),
      quantity: Number(r.quantity),
      pileSize: Number(r.pileSize),
      passed: Array.from(
        { length: Number(r.passes) },
        (_, n) => (Number(r.actor) + n + 1) % Number(t.size),
      ),
      ...(r.challenger === 255n ? {} : { challenger: Number(r.challenger) }),
      outcome: (["pending", "passed", "truth", "bluff"] as const)[
        Number(r.outcome)
      ],
      ...(r.receiver === 255n ? {} : { receiver: Number(r.receiver) }),
      ...(revealed.length ? { revealed } : {}),
    });
  }
  return {
    room: roomId,
    state: t,
    players: ledger.players.lookup(room).slice(0, Number(t.size)).map(toHex),
    keys: ledger.playerKeys.lookup(room),
    deck: ledger.decks.member(room) ? ledger.decks.lookup(room) : [],
    owners: ledger.owners.member(room)
      ? ledger.owners.lookup(room).map(Number)
      : [],
    custodians: ledger.custodians.member(room)
      ? ledger.custodians.lookup(room).map(Number)
      : [],
    selected: ledger.lastSelections.member(room)
      ? ledger.lastSelections.lookup(room)
      : [],
    history,
    revision: JSON.stringify(t, (_, v) =>
      typeof v === "bigint" ? v.toString() : v,
    ),
  };
}
function stateFor(
  session: Session,
  action?: Action,
  snapshot?: Snapshot,
): PrivateState {
  const opened = Array<bigint>(52).fill(255n);
  if (action?.kind === "reveal" && snapshot) {
    const key = BigInt("0x" + session.key);
    snapshot.selected.forEach((yes, slot) => {
      if (!yes) return;
      const id = cardPoints.get(
        pointId(Game.pureCircuits.decryptCard(snapshot.deck[slot], key)),
      );
      if (id === undefined)
        throw new Error("This browser cannot open the challenged cards.");
      opened[slot] = BigInt(id);
    });
  }
  return {
    secret: fromHex(session.secret),
    key: BigInt("0x" + session.key),
    order:
      action?.kind === "shuffle"
        ? shuffledDeck().map(BigInt)
        : Array.from({ length: 52 }, (_, i) => BigInt(i)),
    randomness: Array.from({ length: 52 }, () =>
      action?.kind === "shuffle" || action?.kind === "transfer" ? scalar() : 1n,
    ),
    opened,
  };
}
const providers = (
  api: ConnectedAPI,
  network: string,
  onStage: (s: TransactionStage) => void,
) =>
  createWalletProviders<Circuit, typeof PRIVATE_STATE_ID, PrivateState>(
    api,
    network,
    config(),
    onStage,
    import.meta.env.VITE_CLASSIC_PROOF_SERVER_URL?.trim(),
  );
export async function deploy(
  api: ConnectedAPI,
  network: string,
  onStage: (s: TransactionStage) => void,
): Promise<string> {
  const result = await deployContract(await providers(api, network, onStage), {
    compiledContract: compiled,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: stateFor(newSession()),
  });
  return result.deployTxData.public.contractAddress;
}
export async function transact(
  api: ConnectedAPI,
  network: string,
  address: string,
  room: string,
  session: Session,
  action: Action,
  snapshot: Snapshot | null,
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
      "Lace has no usable tDUST. Generate tDUST and wait for wallet sync.",
    );
  const p = await providers(api, network, onStage);
  p.privateStateProvider.setContractAddress(address);
  const contract = await findDeployedContract(p, {
    contractAddress: address,
    compiledContract: compiled,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: stateFor(session, action, snapshot ?? undefined),
  });
  onStage("proving");
  const id = fromHex(room);
  let tx;
  if (action.kind === "play") {
    if (!snapshot) throw new Error("Refresh your table first.");
    const mine = privateCards(snapshot, session);
    if (
      !action.cards.length ||
      new Set(action.cards).size !== action.cards.length ||
      action.cards.some((id) => !mine.some((c) => c.id === id))
    )
      throw new Error("Select distinct cards from your own hand.");
    const slots = mine
      .filter((c) => action.cards.includes(c.id))
      .map((c) => c.slot);
    tx = await contract.callTx.playCards(
      id,
      Array.from({ length: 52 }, (_, i) => slots.includes(i)),
    );
  } else {
    const circuit = ACTION_CIRCUIT[action.kind];
    tx = await contract.callTx[circuit](id);
  }
  return {
    txId: tx.public.txId,
    blockHeight: tx.public.blockHeight.toString(),
    milliseconds: Math.round(performance.now() - begun),
  };
}
