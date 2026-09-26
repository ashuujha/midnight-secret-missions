// Deterministic TEST witnesses only. Never used by the app or public endpoint.
import { createCircuitContext, createConstructorContext, sampleContractAddress } from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger, type Witnesses } from "../../managed/cat-bluff52/contract/index.js";
import { toHex } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export function makeLoadFixture(roomCount = 25, players = 4) {
  type Private = { secret: Uint8Array; key: bigint; order: bigint[]; randomness: bigint[]; opened: bigint[] };
  const witnesses: Witnesses<Private> = {
    identitySecret: (c) => [c.privateState, c.privateState.secret],
    encryptionSecret: (c) => [c.privateState, c.privateState.key],
    permutation: (c) => [c.privateState, c.privateState.order],
    blindingFactors: (c) => [c.privateState, c.privateState.randomness],
    openedCards: (c) => [c.privateState, c.privateState.opened],
  };
  const people = Array.from({ length: players }, (_, i): Private => ({
    secret: new Uint8Array(32).fill(i + 1), key: BigInt(i + 1) * 7987349837498347349n,
    order: Array.from({ length: 52 }, (_, n) => BigInt((n + i + 1) % 52)),
    randomness: Array.from({ length: 52 }, (_, n) => BigInt((i + 1) * 900 + n + 1)),
    opened: Array(52).fill(255n),
  }));
  const contract = new Contract(witnesses);
  const address = sampleContractAddress();
  const initial = contract.initialState(createConstructorContext(people[0], "0".repeat(64)));
  let context = createCircuitContext(address, initial.currentZswapLocalState, initial.currentContractState, people[0]);
  const rooms: string[] = [];
  for (let r = 1; r <= roomCount; r++) {
    const room = new Uint8Array(32);
    new DataView(room.buffer).setUint32(28, r);
    rooms.push(toHex(room));
    const act = (seat: number, circuit: "createRoom" | "joinRoom" | "startRound" | "shuffleDeck" | "shareDeal") => {
      const next = createCircuitContext(address, context.currentZswapLocalState, context.currentQueryContext.state, people[seat]);
      context = contract.impureCircuits[circuit](next, room).context;
    };
    act(0, "createRoom");
    for (let s = 1; s < players; s++) act(s, "joinRoom");
    act(0, "startRound");
    for (let s = 0; s < players; s++) act(s, "shuffleDeck");
    for (let s = 0; s < players; s++) act(s, "shareDeal");
  }
  return { ledger: ledger(context.currentQueryContext.state), blockHeight: 100, rooms };
}
