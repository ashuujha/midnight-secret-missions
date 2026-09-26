import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ecMulGenerator,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
  type CircuitContext,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  ledger,
  pureCircuits,
  type Witnesses,
} from "../managed/cat-bluff52/contract/index.js";
type Private = {
  secret: Uint8Array;
  key: bigint;
  order: bigint[];
  randomness: bigint[];
  opened: bigint[];
};
const bytes = (n: number) => new Uint8Array(32).fill(n);
const make = (n: number): Private => ({
  secret: bytes(n),
  key: BigInt(n) * 7987349837498347349n,
  order: Array.from({ length: 52 }, (_, i) => BigInt((i + n) % 52)),
  randomness: Array.from({ length: 52 }, (_, i) =>
    BigInt((n + 1) * 900 + i + 1),
  ),
  opened: Array(52).fill(255n),
});
const witnesses: Witnesses<Private> = {
  identitySecret: (c) => [c.privateState, c.privateState.secret],
  encryptionSecret: (c) => [c.privateState, c.privateState.key],
  permutation: (c) => [c.privateState, c.privateState.order],
  blindingFactors: (c) => [c.privateState, c.privateState.randomness],
  openedCards: (c) => [c.privateState, c.privateState.opened],
};
const room = bytes(99);
const pointString = (p: { x: bigint; y: bigint }) => `${p.x}:${p.y}`;
const cardLookup = new Map(
  Array.from({ length: 52 }, (_, i) => [
    pointString(pureCircuits.cardPoint(BigInt(i))),
    i,
  ]),
);
function setup(size = 2, prepare = true) {
  const people = Array.from({ length: 5 }, (_, i) => make(i + 1));
  const contract = new Contract(witnesses);
  const initial = contract.initialState(
    createConstructorContext(people[0], "0".repeat(64)),
  );
  const address = sampleContractAddress();
  let ctx = createCircuitContext(
    address,
    initial.currentZswapLocalState,
    initial.currentContractState,
    people[0],
  );
  const act = (
    seat: number,
    fn: keyof typeof contract.impureCircuits,
    args: unknown[] = [room],
  ) => {
    const c = createCircuitContext(
      address,
      ctx.currentZswapLocalState,
      ctx.currentQueryContext.state,
      people[seat],
    );
    ctx = (contract.impureCircuits[fn] as Function)(c, ...args).context;
  };
  const state = () => ledger(ctx.currentQueryContext.state);
  const cards = (seat: number) =>
    state()
      .decks.lookup(room)
      .flatMap((cipher, slot) => {
        if (state().owners.lookup(room)[slot] !== BigInt(seat)) return [];
        const id = cardLookup.get(
          pointString(pureCircuits.decryptCard(cipher, people[seat].key)),
        );
        assert.notEqual(id, undefined, "owner decrypts a valid physical card");
        return [{ slot, id: id! }];
      });
  const reveal = (seat: number) => {
    people[seat].opened = state()
      .decks.lookup(room)
      .map((cipher, slot) =>
        state().lastSelections.lookup(room)[slot]
          ? BigInt(
              cardLookup.get(
                pointString(pureCircuits.decryptCard(cipher, people[seat].key)),
              )!,
            )
          : 255n,
      );
    act(seat, "revealTurn");
  };
  const play = (seat: number, slots: number[]) =>
    act(seat, "playCards", [
      room,
      Array.from({ length: 52 }, (_, i) => slots.includes(i)),
    ]);
  const pass = () => {
    while (state().rooms.lookup(room).phase === 1n)
      act(Number(state().rooms.lookup(room).responder), "passClaim");
  };
  act(0, "createRoom");
  for (let i = 1; i < size; i++) act(i, "joinRoom");
  if (prepare) {
    act(0, "startRound");
    for (let i = 0; i < size; i++) act(i, "shuffleDeck");
    for (let i = 0; i < size; i++) act(i, "shareDeal");
  }
  return { people, act, state, cards, play, pass, reveal, contract };
}
describe("Classic 52 Midnight circuits", () => {
  it("uses exactly the 52 expected public curve encodings", () => {
    const points = Array.from({ length: 52 }, (_, i) =>
      pureCircuits.cardPoint(BigInt(i)),
    );
    points.forEach((point, i) =>
      assert.deepEqual(point, ecMulGenerator(BigInt(i + 1))),
    );
    assert.equal(new Set(points.map(pointString)).size, 52);
  });
  for (const size of [2, 3, 4])
    it(`jointly shuffles/deals ${size} players with 52 distinct decryptable cards and hidden opponent hands`, () => {
      const g = setup(size);
      const state = g.state();
      assert.equal(state.schemaVersion, 4n);
      assert.equal(state.rooms.lookup(room).status, 3n);
      const cards = Array.from({ length: size }, (_, i) => g.cards(i));
      const ids = cards.flat().map((c) => c.id);
      assert.equal(new Set(ids).size, 52);
      assert.equal(ids.length, 52);
      const counts = cards.map((h) => h.length);
      assert(Math.max(...counts) - Math.min(...counts) <= 1);
      const other = cards[1][0];
      assert.equal(
        cardLookup.has(
          pointString(
            pureCircuits.decryptCard(
              state.decks.lookup(room)[other.slot],
              g.people[0].key,
            ),
          ),
        ),
        false,
      );
      assert.equal("hands" in state, false);
      assert.equal("permutation" in state, false);
      assert.equal("encryptionSecret" in state, false);
    });
  it("enforces 2–4 players, host-only start and no late join", () => {
    const g = setup(1, false);
    assert.throws(() => g.act(0, "startRound"), /friend/);
    g.act(1, "joinRoom");
    assert.throws(() => g.act(1, "startRound"), /host/);
    g.act(2, "joinRoom");
    g.act(3, "joinRoom");
    assert.throws(() => g.act(4, "joinRoom"), /full/);
    g.act(0, "startRound");
    assert.throws(() => g.act(4, "joinRoom"), /started/);
  });
  it("rejects duplicated/out-of-range permutation entries and zero rerandomizers", () => {
    const g = setup(2, false);
    g.act(0, "startRound");
    g.people[0].order = Array(52).fill(0n);
    assert.throws(() => g.act(0, "shuffleDeck"), /duplicated/);
    g.people[0].order = Array.from({ length: 52 }, (_, i) => BigInt(i));
    g.people[0].order[51] = 52n;
    assert.throws(() => g.act(0, "shuffleDeck"), /range/);
    g.people[0].order[51] = 51n;
    g.people[0].randomness[0] = 0n;
    assert.throws(() => g.act(0, "shuffleDeck"), /randomness/);
    assert.equal(g.state().rooms.lookup(room).step, 0n);
  });
  it("requires all shuffle/deal contributions and rejects an incorrect private key", () => {
    const g = setup(2, false);
    g.act(0, "startRound");
    assert.throws(() => g.act(1, "shuffleDeck"), /shuffle turn/);
    assert.throws(() => g.act(0, "shareDeal"), /deal turn/);
    g.act(0, "shuffleDeck");
    g.act(1, "shuffleDeck");
    const key = g.people[0].key;
    g.people[0].key++;
    assert.throws(() => g.act(0, "shareDeal"), /key/);
    g.people[0].key = key;
    assert.throws(() => g.play(0, [0]), /current turn/);
  });
  it("moves exact physical slots once, fixes the required rank, and keeps passed cards in the pile", () => {
    const g = setup(3);
    const slots = g
      .cards(0)
      .slice(0, 3)
      .map((c) => c.slot);
    g.play(0, slots);
    assert.equal(g.state().rooms.lookup(room).pile, 3n);
    assert.throws(() => g.play(0, slots), /current turn/);
    assert.throws(() => g.act(2, "passClaim"), /response turn/);
    g.pass();
    assert.equal(g.state().rooms.lookup(room).rank, 1n);
    assert.equal(g.state().rooms.lookup(room).pile, 3n);
    assert.throws(() => g.play(1, slots), /not in your hand/);
    assert.throws(() => g.play(1, []), /at least one/);
  });
  it("opens only the challenged turn, privately transfers the whole pile, and prevents double pickup", () => {
    const g = setup();
    const first = g.cards(0).slice(0, 3);
    g.play(
      0,
      first.map((c) => c.slot),
    );
    g.pass();
    const second = g
      .cards(1)
      .filter((c) => Math.floor(c.id / 4) !== 1)
      .slice(0, 2);
    g.play(
      1,
      second.map((c) => c.slot),
    );
    g.act(0, "callBluff");
    g.reveal(1);
    let state = g.state();
    const record = state.turns.lookup(pureCircuits.turnKey(room, 1n, 2n));
    assert.equal(record.outcome, 3n);
    assert.deepEqual(
      record.revealed
        .filter((c) => c !== 255n)
        .map(Number)
        .sort((a, b) => a - b),
      second.map((c) => c.id).sort((a, b) => a - b),
    );
    assert(
      state.turns
        .lookup(pureCircuits.turnKey(room, 1n, 1n))
        .revealed.every((c) => c === 255n),
    );
    assert.equal(state.rooms.lookup(room).phase, 3n);
    assert.throws(() => g.act(1, "transferPile"), /already been returned/);
    g.act(0, "transferPile");
    state = g.state();
    assert.equal(state.rooms.lookup(room).pile, 0n);
    assert.equal(state.rooms.lookup(room).phase, 0n);
    assert.equal(g.cards(1).length, 29);
    assert.equal(g.cards(0).length, 23);
    assert.equal(
      new Set([...g.cards(0), ...g.cards(1)].map((c) => c.id)).size,
      52,
    );
    assert.throws(() => g.act(0, "transferPile"), /no pile/);
  });
  it("sends a truthful claim penalty to the challenger and keeps the card encrypted to its new owner", () => {
    const g = setup();
    const aces = g.cards(0).filter((c) => c.id < 4);
    assert(aces.length);
    g.play(
      0,
      aces.map((c) => c.slot),
    );
    g.act(1, "callBluff");
    g.reveal(0);
    assert.equal(g.state().rooms.lookup(room).loser, 1n);
    g.act(0, "transferPile");
    assert.equal(g.cards(1).length, 26 + aces.length);
    const c = g.state().decks.lookup(room)[aces[0].slot];
    assert.equal(
      cardLookup.has(pointString(pureCircuits.decryptCard(c, g.people[0].key))),
      false,
    );
    assert.equal(
      cardLookup.get(pointString(pureCircuits.decryptCard(c, g.people[1].key))),
      aces[0].id,
    );
  });
  it("rejects substituted challenge openings and wrong players", () => {
    const g = setup();
    const card = g.cards(0)[0];
    g.play(0, [card.slot]);
    g.act(1, "callBluff");
    assert.throws(() => g.act(1, "revealTurn"), /challenged player/);
    g.people[0].opened = Array(52).fill(255n);
    g.people[0].opened[card.slot] = BigInt((card.id + 1) % 52);
    assert.throws(() => g.act(0, "revealTurn"), /encrypted card/);
    assert.equal(g.state().rooms.lookup(room).phase, 2n);
  });
  it("does not award a last-hand bluff and returns all those exact cards on a challenge", () => {
    const g = setup();
    const hand = g.cards(0);
    g.play(
      0,
      hand.map((c) => c.slot),
    );
    assert.equal(g.state().rooms.lookup(room).winner, 255n);
    g.act(1, "callBluff");
    g.reveal(0);
    assert.equal(g.state().rooms.lookup(room).status, 3n);
    assert.equal(g.state().rooms.lookup(room).winner, 255n);
    assert.deepEqual(
      g
        .cards(0)
        .map((c) => c.id)
        .sort((a, b) => a - b),
      hand.map((c) => c.id).sort((a, b) => a - b),
    );
  });
  it("wins only after every opponent passes and supports another round in the same room", () => {
    const g = setup(3);
    g.play(
      0,
      g.cards(0).map((c) => c.slot),
    );
    g.act(1, "passClaim");
    assert.equal(g.state().rooms.lookup(room).winner, 255n);
    g.act(2, "passClaim");
    assert.equal(g.state().rooms.lookup(room).winner, 0n);
    assert.equal(g.state().rooms.lookup(room).status, 4n);
    g.act(0, "startRound");
    assert.equal(g.state().rooms.lookup(room).round, 2n);
    assert.equal(g.state().rooms.lookup(room).status, 1n);
    assert.equal(g.state().rooms.lookup(room).rank, 0n);
  });
});
