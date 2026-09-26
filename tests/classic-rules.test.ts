import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  newClassicState,
  applyClassic,
  classicView,
  dealDeck,
  shuffledDeck,
  rankOf,
  assertConservation,
  botDecision,
  type ClassicState,
} from "../src/game/classic-rules";
const ordered = Array.from({ length: 52 }, (_, i) => i);
function passAll(s: ClassicState) {
  while (s.phase === "respond")
    s = applyClassic(s, s.responder, { kind: "pass" });
  return s;
}
describe("Classic 52 rules", () => {
  for (const players of [2, 3, 4])
    it(`deals all 52 unique cards to ${players} players, preserving four of each rank`, () => {
      const s = newClassicState(players);
      assertConservation(s);
      assert.equal(s.hands.flat().length, 52);
      assert(
        Math.max(...s.hands.map((h) => h.length)) -
          Math.min(...s.hands.map((h) => h.length)) <=
          1,
      );
      for (let rank = 0; rank < 13; rank++)
        assert.equal(
          s.hands.flat().filter((c) => rankOf(c) === rank).length,
          4,
        );
    });
  it("rejects duplicate decks and invalid room sizes", () => {
    assert.throws(() => dealDeck([...ordered.slice(0, 51), 0], 2));
    for (const n of [1, 5, 2.5]) assert.throws(() => dealDeck(ordered, n));
  });
  it("uses bounded Fisher–Yates choices and conserves the deck", () => {
    const limits: number[] = [];
    const deck = shuffledDeck((n) => {
      limits.push(n);
      return 0;
    });
    assert.deepEqual(
      limits,
      Array.from({ length: 51 }, (_, i) => 52 - i),
    );
    assert.equal(new Set(deck).size, 52);
    assert.notDeepEqual(deck, ordered);
    assert.throws(() => shuffledDeck((n) => n));
  });
  it("allows a multi-card bluff and discloses only the declaration until challenged", () => {
    const s = applyClassic(newClassicState(2, 1, ordered), 0, {
      kind: "play",
      cards: [0, 8, 16],
    });
    const publicView = classicView(s, 1);
    assert.equal(publicView.latest!.quantity, 3);
    assert.equal(publicView.latest!.rank, 0);
    assert.equal(publicView.latest!.revealed, undefined);
    assert.equal("lastCards" in publicView, false);
    assert.equal("hands" in publicView, false);
    assert.equal(publicView.players[0].count, 23);
  });
  it("blocks forged cards, repeat cards, empty selections and out-of-turn play", () => {
    const s = newClassicState(2, 1, ordered);
    for (const cards of [[], [0, 0], [1], [52], [0.5]])
      assert.throws(() => applyClassic(s, 0, { kind: "play", cards }));
    assert.throws(() => applyClassic(s, 1, { kind: "play", cards: [1] }));
    assertConservation(s);
  });
  it("retains passed cards in the growing pile and advances A through K and back to A", () => {
    let s = newClassicState(3, 1, ordered);
    for (let turn = 0; turn < 14; turn++) {
      assert.equal(s.rank, turn % 13);
      const seat = s.turn;
      s = applyClassic(s, seat, { kind: "play", cards: [s.hands[seat][0]] });
      assert.equal(s.pile.length, turn + 1);
      assert.equal(s.phase, "respond");
      s = passAll(s);
      assert.equal(s.turn, (seat + 1) % 3);
      assert.equal(s.history.at(-1)!.revealed, undefined);
    }
    assert.equal(s.rank, 1);
    assertConservation(s);
  });
  it("requires every eligible player to pass and blocks self/out-of-order challenges", () => {
    let s = applyClassic(newClassicState(4, 1, ordered), 0, {
      kind: "play",
      cards: [0],
    });
    assert.throws(() => applyClassic(s, 0, { kind: "call" }));
    assert.throws(() => applyClassic(s, 2, { kind: "call" }));
    s = applyClassic(s, 1, { kind: "pass" });
    s = applyClassic(s, 2, { kind: "pass" });
    assert.equal(s.phase, "respond");
    s = applyClassic(s, 3, { kind: "pass" });
    assert.equal(s.phase, "play");
  });
  it("a caught bluff picks up the entire accumulated pile, exposing only the latest turn", () => {
    let s = applyClassic(newClassicState(2, 1, ordered), 0, {
      kind: "play",
      cards: [0, 2],
    });
    s = passAll(s);
    s = applyClassic(s, 1, { kind: "play", cards: [1, 3, 9] });
    s = applyClassic(s, 0, { kind: "call" });
    s = applyClassic(s, 1, { kind: "reveal" });
    assert.equal(s.hands[1].length, 28);
    assert.equal(s.pile.length, 0);
    assert.equal(s.history[0].revealed, undefined);
    assert.deepEqual(s.history[1].revealed, [1, 3, 9]);
    assert.equal(s.history[1].outcome, "bluff");
    assertConservation(s);
  });
  it("a failed challenge gives the whole pile to the challenger", () => {
    let s = applyClassic(newClassicState(2, 1, ordered), 0, {
      kind: "play",
      cards: [0, 2],
    });
    s = applyClassic(s, 1, { kind: "call" });
    s = applyClassic(s, 0, { kind: "reveal" });
    assert.equal(s.hands[1].length, 28);
    assert.equal(s.hands[0].length, 24);
    assert.equal(s.pile.length, 0);
    assert.equal(s.history[0].outcome, "truth");
    assertConservation(s);
  });
  for (const result of ["pass", "truth", "bluff"] as const)
    it(`settles the final card correctly when ${result}`, () => {
      let s = newClassicState(2, 1, ordered);
      const card = result === "bluff" ? 4 : 0;
      s.hands = [[card], ordered.filter((c) => c !== card)];
      s = applyClassic(s, 0, { kind: "play", cards: [card] });
      assert.equal(s.winner, null);
      assert.equal(s.phase, "respond");
      if (result === "pass") s = passAll(s);
      else {
        s = applyClassic(s, 1, { kind: "call" });
        s = applyClassic(s, 0, { kind: "reveal" });
      }
      assert.equal(s.winner, result === "bluff" ? null : 0);
      assert.equal(s.phase, result === "bluff" ? "play" : "finished");
      assertConservation(s);
    });
  it("does not publish private hand arrays in snapshots and snapshots cannot mutate the game", () => {
    const s = newClassicState(4, 1, ordered);
    const v = classicView(s, 0);
    assert.deepEqual(v.hand, s.hands[0]);
    assert(!JSON.stringify(v).includes("hands"));
    v.hand.splice(0);
    v.players[1].count = 0;
    assert.equal(s.hands[0].length, 13);
    assert.equal(s.hands[1].length, 13);
  });
  it("bots reason from their own cards and public quantities", () => {
    let s = applyClassic(newClassicState(2, 1, ordered), 0, {
      kind: "play",
      cards: [0, 2, 4],
    });
    const v = classicView(s, 1);
    assert.equal(v.hand.filter((c) => rankOf(c) === 0).length, 2);
    assert.equal(botDecision(v, () => 0.999).kind, "call");
  });
  it("conserves cards through long seeded 2/3/4 player matches", () => {
    let seed = 781;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (const n of [2, 3, 4]) {
      let s = newClassicState(
        n,
        1,
        shuffledDeck((limit) => Math.floor(random() * limit)),
      );
      for (let i = 0; i < 900 && s.phase !== "finished"; i++) {
        const seat =
          s.phase === "play"
            ? s.turn
            : s.phase === "respond"
              ? s.responder
              : s.history.at(-1)!.actor;
        s = applyClassic(s, seat, botDecision(classicView(s, seat), random));
        assertConservation(s);
      }
    }
  });
});
