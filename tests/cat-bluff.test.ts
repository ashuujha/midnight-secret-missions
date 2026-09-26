import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
} from "../managed/cat-bluff/contract/index.js";
type PS = {
  secret: Uint8Array;
  counts: bigint[];
  salt: Uint8Array;
  nextSalt: Uint8Array;
  cat: bigint;
  cardSalt: Uint8Array;
  draws: bigint[];
};
const bytes = (n: number) => new Uint8Array(32).fill(n);
const make = (n: number): PS => ({
  secret: bytes(n),
  counts: [1n, 1n, 1n, 1n, 1n],
  salt: bytes(n + 10),
  nextSalt: bytes(n + 20),
  cat: 0n,
  cardSalt: bytes(n + 30),
  draws: [0n, 0n, 0n, 0n, 0n],
});
const room = bytes(90),
  now = 1_700_000_000_000;
const witnesses: Witnesses<PS> = {
  identitySecret: (c) => [c.privateState, c.privateState.secret],
  handCounts: (c) => [c.privateState, c.privateState.counts],
  handSalt: (c) => [c.privateState, c.privateState.salt],
  nextHandSalt: (c) => [c.privateState, c.privateState.nextSalt],
  playedCat: (c) => [c.privateState, c.privateState.cat],
  playedSalt: (c) => [c.privateState, c.privateState.cardSalt],
  drawnCats: (c) => [c.privateState, c.privateState.draws],
};
function setup(players = 2) {
  const people = [make(1), make(2), make(3), make(4), make(5)];
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
    undefined,
    undefined,
    now,
  );
  const call = (
    p: PS,
    fn: (c: CircuitContext<PS>) => { context: CircuitContext<PS> },
    time = now,
  ) => {
    const next = createCircuitContext(
      address,
      ctx.currentZswapLocalState,
      ctx.currentQueryContext.state,
      p,
      undefined,
      undefined,
      time,
    );
    ctx = fn(next).context;
  };
  const act = (
    p: PS,
    name: keyof typeof contract.impureCircuits,
    args: unknown[] = [],
    time = now,
  ) =>
    call(
      p,
      (c) => (contract.impureCircuits[name] as Function)(c, ...args),
      time,
    );
  const id = (p: PS) => pureCircuits.playerId(p.secret);
  act(people[0], "createRoom", [room]);
  for (let i = 1; i < players; i++) act(people[i], "joinRoom", [room]);
  const play = (seat: number, cat: number, claim = cat, time = now) => {
    const p = people[seat];
    p.cat = BigInt(cat);
    p.nextSalt = bytes(Number(p.salt[0]) + 1);
    p.cardSalt = bytes(Number(p.cardSalt[0]) + 1);
    act(p, "playCard", [room, BigInt(claim), BigInt(time)], time);
    p.counts = p.counts.map((v, i) => v + p.draws[i] - (i === cat ? 1n : 0n));
    p.draws = [0n, 0n, 0n, 0n, 0n];
    p.salt = p.nextSalt;
  };
  return {
    people,
    contract,
    act,
    id,
    play,
    get state() {
      return ledger(ctx.currentQueryContext.state);
    },
  };
}
describe("Cat Bluff private card game", () => {
  it("deals equal five-card commitments and enforces room membership/capacity", () => {
    const g = setup(4);
    assert.equal(g.state.schemaVersion, 3n);
    assert.equal(g.state.roomSizes.lookup(room), 4n);
    for (const p of g.people.slice(0, 4)) {
      assert.equal(g.state.handSizes.lookup(g.id(p)), 5n);
      assert.deepEqual(
        g.state.hands.lookup(g.id(p)),
        pureCircuits.handCommitment(p.counts, p.salt),
      );
    }
    assert.throws(() => g.act(g.people[4], "joinRoom", [room]), /full/);
    assert.throws(
      () => g.act(g.people[4], "createRoom", [room]),
      /already exists/,
    );
  });
  it("does not accept a forged or oversized initial hand", () => {
    const g = setup(1);
    g.people[1].counts = [6n, 0n, 0n, 0n, 0n];
    assert.throws(() => g.act(g.people[1], "joinRoom", [room]), /exactly five/);
  });
  it("consumes the actual hidden card, permits a false claim, and publishes only a commitment", () => {
    const g = setup();
    g.play(0, 0, 3);
    assert.equal(g.state.claims.lookup(room), 3n);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[0])), 4n);
    assert.deepEqual(
      g.state.cards.lookup(room),
      pureCircuits.cardCommitment(0n, g.people[0].cardSalt),
    );
    assert.equal("playedCat" in g.state, false);
    assert.equal("handCounts" in g.state, false);
  });
  it("rejects other players turns, duplicate plays, absent cards, and changed hand witnesses", () => {
    const g = setup();
    assert.throws(() => g.play(1, 0), /not your turn/);
    g.people[0].counts = [0n, 2n, 1n, 1n, 1n];
    assert.throws(() => g.play(0, 0), /commitment/);
    g.people[0].counts = [1n, 1n, 1n, 1n, 1n];
    g.play(0, 0);
    assert.throws(() => g.play(0, 1), /current claim/);
    g.act(g.people[1], "passClaim", [room]);
    g.play(1, 1);
    g.act(g.people[0], "passClaim", [room]);
    assert.throws(() => g.play(0, 0), /not in your hand/);
  });
  it("waits for every other player to pass in seat order", () => {
    const g = setup(3);
    g.play(0, 0);
    assert.throws(
      () => g.act(g.people[2], "passClaim", [room]),
      /response turn/,
    );
    g.act(g.people[1], "passClaim", [room]);
    assert.equal(g.state.phases.lookup(room), 1n);
    g.act(g.people[2], "passClaim", [room]);
    assert.equal(g.state.phases.lookup(room), 0n);
    assert.equal(g.state.turns.lookup(room), 1n);
  });
  it("penalizes the challenger when a ZK circuit establishes a truthful claim", () => {
    const g = setup();
    g.play(0, 0);
    g.act(g.people[1], "callBluff", [room, BigInt(now)]);
    g.act(g.people[0], "proveClaim", [room]);
    assert.equal(g.state.outcomes.lookup(room), 2n);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[1])), 7n);
    assert.equal(g.state.penaltyDraws.lookup(g.id(g.people[1])), 2n);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[0])), 4n);
  });
  it("penalizes a liar without publishing the actual cat or other cards", () => {
    const g = setup();
    g.play(0, 0, 4);
    g.act(g.people[1], "callBluff", [room, BigInt(now)]);
    g.act(g.people[0], "proveClaim", [room]);
    assert.equal(g.state.outcomes.lookup(room), 3n);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[0])), 6n);
    assert.equal("revealedCat" in g.state, false);
  });
  it("rejects a substitute card opening and proof from the wrong player", () => {
    const g = setup();
    g.play(0, 0, 4);
    g.act(g.people[1], "callBluff", [room, BigInt(now)]);
    assert.throws(
      () => g.act(g.people[1], "proveClaim", [room]),
      /Only the player/,
    );
    g.people[0].cat = 4n;
    assert.throws(
      () => g.act(g.people[0], "proveClaim", [room]),
      /committed card/,
    );
  });
  it("absorbs exactly the penalty draws into the next private hand and blocks fabricated draws", () => {
    const g = setup();
    g.play(0, 0);
    g.act(g.people[1], "callBluff", [room, BigInt(now)]);
    g.act(g.people[0], "proveClaim", [room]);
    assert.throws(() => g.play(1, 1), /penalty draw/);
    g.people[1].draws = [2n, 0n, 0n, 0n, 0n];
    g.play(1, 0);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[1])), 6n);
    assert.equal(g.state.penaltyDraws.lookup(g.id(g.people[1])), 0n);
    assert.deepEqual(
      g.state.hands.lookup(g.id(g.people[1])),
      pureCircuits.handCommitment(g.people[1].counts, g.people[1].salt),
    );
  });
  it("settles a missed proof deadline as a timeout rather than pretending a false proof was accepted", () => {
    const g = setup();
    g.play(0, 0);
    g.act(g.people[1], "callBluff", [room, BigInt(now)]);
    assert.throws(
      () => g.act(g.people[1], "settleTimeout", [room]),
      /not run out/,
    );
    assert.throws(
      () => g.act(g.people[0], "proveClaim", [room], now + 1_200_000),
      /expired/,
    );
    g.act(g.people[1], "settleTimeout", [room], now + 1_200_000);
    assert.equal(g.state.outcomes.lookup(room), 4n);
    assert.equal(g.state.handSizes.lookup(g.id(g.people[0])), 6n);
  });
  it("declares an empty-hand winner only after the last claim is settled", () => {
    const g = setup();
    for (let cat = 0; cat < 5; cat++) {
      g.play(0, cat);
      assert.equal(g.state.roomStatus.lookup(room), 1n);
      g.act(g.people[1], "passClaim", [room]);
      if (cat < 4) {
        g.play(1, cat);
        g.act(g.people[0], "passClaim", [room]);
      }
    }
    assert.equal(g.state.roomStatus.lookup(room), 2n);
    assert.deepEqual(g.state.winners.lookup(room), g.id(g.people[0]));
    assert.throws(() => g.play(1, 4), /over/);
  });
  it("rejects future/stale timestamps and joining after play begins", () => {
    const g = setup();
    assert.throws(
      () => g.act(g.people[0], "playCard", [room, 0n, BigInt(now + 1)]),
      /future/,
    );
    assert.throws(
      () => g.act(g.people[0], "playCard", [room, 0n, BigInt(now - 300000)]),
      /too old/,
    );
    g.play(0, 0);
    assert.throws(
      () => g.act(g.people[2], "joinRoom", [room]),
      /already started/,
    );
  });
});
