import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toHex, fromHex } from "@midnight-ntwrk/compact-runtime";
import { pureCircuits } from "../managed/cat-bluff/contract/index.js";
import {
  createHand,
  reconcileHand,
  loadHand,
  saveHand,
} from "../src/midnight/cat-bluff";
const commitment = (counts: number[], salt: string) =>
  toHex(pureCircuits.handCommitment(counts.map(BigInt), fromHex(salt)));
const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  },
  configurable: true,
});
describe("private hand recovery", () => {
  it("preserves the old opening until the candidate commitment is confirmed", () => {
    const hand = createHand(),
      counts = [...hand.counts],
      cat = counts.findIndex((n) => n > 0);
    counts[cat]--;
    const salt = "a".repeat(64),
      cardSalt = "b".repeat(64);
    const candidate = {
      counts,
      salt,
      cat,
      cardSalt,
      commitment: commitment(counts, salt),
    };
    const pending = { ...hand, candidate };
    const waiting = reconcileHand(
      pending,
      commitment(hand.counts, hand.salt),
      0,
    );
    assert.deepEqual(waiting.counts, hand.counts);
    assert(waiting.candidate);
    const confirmed = reconcileHand(pending, candidate.commitment, 0);
    assert.deepEqual(confirmed.counts, counts);
    assert.equal(confirmed.candidate, undefined);
    assert.deepEqual(confirmed.lastCard, { cat, salt: cardSalt });
  });
  it("does not draw penalties twice on repeated polling", () => {
    const hand = createHand(),
      hash = commitment(hand.counts, hand.salt);
    const drawn = reconcileHand(hand, hash, 2);
    assert.equal(
      drawn.draws.reduce((a, b) => a + b, 0),
      2,
    );
    assert.deepEqual(reconcileHand(drawn, hash, 2), drawn);
    assert.throws(
      () => reconcileHand(hand, "0".repeat(64), 0),
      /does not match/,
    );
  });
  it("scopes hands by wallet, contract and table and refuses damaged data without overwriting", () => {
    const hand = createHand();
    saveHand("wallet", "contract", "table", hand);
    assert.deepEqual(loadHand("wallet", "contract", "table"), hand);
    assert.equal(loadHand("other", "contract", "table"), null);
    assert.equal(loadHand("wallet", "other", "table"), null);
    assert.equal(loadHand("wallet", "contract", "other"), null);
    saveHand("wallet", "contract", "table", { ...hand, id: "0".repeat(64) });
    assert.throws(() => loadHand("wallet", "contract", "table"), /damaged/);
    assert(
      storage.get("cat-bluff:v3:contract:table:wallet")?.includes("0000000000"),
    );
  });
});
