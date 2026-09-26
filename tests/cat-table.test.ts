import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  countsOf,
  cardsOf,
  drawCards,
  inviteUrl,
  readInvite,
  localAction,
  newPractice,
} from "../src/game/cat-bluff";

describe("Cat Bluff table rules and invitations", () => {
  it("deals five valid cats to each practice player and supports duplicate cats", () => {
    for (let i = 0; i < 30; i++) {
      const s = newPractice(false);
      assert.deepEqual(
        s.hands.map((h) => h.length),
        [5, 5],
      );
      assert(s.hands.flat().every((n) => n >= 0 && n < 5));
    }
    assert.deepEqual(cardsOf(countsOf([1, 1, 4, 3, 0])), [0, 1, 1, 3, 4]);
    assert.throws(() => drawCards(65));
  });
  it("accepts a bluff as a play but rejects out-of-turn moves and invalid claims", () => {
    const start = newPractice();
    assert.equal(
      localAction(start, 1, { kind: "play", card: 0, claim: 0 }),
      start,
    );
    assert.equal(
      localAction(start, 0, { kind: "play", card: 0, claim: 5 }),
      start,
    );
    const s = localAction(start, 0, { kind: "play", card: 0, claim: 4 });
    assert.equal(s.actual, 0);
    assert.equal(s.table.claim, 4);
    assert.equal(s.table.players[0].count, 4);
    assert.equal(start.hands[0].length, 5);
  });
  it("awards the penalty to the challenger when the committed claim is true", () => {
    let s = localAction(newPractice(), 0, { kind: "play", card: 0, claim: 0 });
    s = localAction(s, 1, { kind: "call" });
    assert.equal(localAction(s, 1, { kind: "prove" }), s);
    s = localAction(s, 0, { kind: "prove" });
    assert.equal(s.table.outcome, 2);
    assert.deepEqual(
      s.table.players.map((p) => p.count),
      [4, 7],
    );
    assert.equal(s.table.turn, 1);
  });
  it("awards the penalty to the liar without putting the actual cat in public table state", () => {
    let s = localAction(newPractice(), 0, { kind: "play", card: 0, claim: 3 });
    s = localAction(s, 1, { kind: "call" });
    s = localAction(s, 0, { kind: "prove" });
    assert.equal(s.table.outcome, 3);
    assert.equal(s.table.loser, "you");
    assert.deepEqual(
      s.table.players.map((p) => p.count),
      [6, 5],
    );
    assert(!("actual" in s.table));
    assert(!("hands" in s.table));
  });
  it("requires final-card settlement before declaring a winner and freezes a completed game", () => {
    let s = newPractice();
    s.hands[0] = [0];
    s.table.players[0].count = 1;
    s = localAction(s, 0, { kind: "play", card: 0, claim: 4 });
    assert.equal(s.table.winner, "");
    s = localAction(s, 1, { kind: "pass" });
    assert.equal(s.table.winner, "you");
    assert.equal(s.table.status, 2);
    assert.equal(localAction(s, 1, { kind: "play", card: 0, claim: 1 }), s);
  });
  it("does not award a win to a last-card bluff that is caught", () => {
    let s = newPractice();
    s.hands[0] = [0];
    s.table.players[0].count = 1;
    s = localAction(s, 0, { kind: "play", card: 0, claim: 4 });
    s = localAction(s, 1, { kind: "call" });
    s = localAction(s, 0, { kind: "prove" });
    assert.equal(s.table.winner, "");
    assert.equal(s.table.players[0].count, 2);
  });
  it("invitations contain only public IDs, remove old URL data and survive copy/paste", () => {
    const room = "a".repeat(64),
      contract = "b".repeat(64);
    const link = inviteUrl(
      "https://example.org/old?secret=do-not-share#private",
      room,
      contract,
    );
    assert.deepEqual(readInvite(new URL(link).search), { room, contract });
    assert.equal(new URL(link).pathname, "/");
    assert(!link.includes("secret"));
    assert(!link.includes("private"));
    assert.throws(() => inviteUrl("https://example.org", "private", contract));
    assert.equal(readInvite("?table=bad&contract=" + contract), null);
  });
});
