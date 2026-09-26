import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHAOS_DURATION_MS,
  createChaosPlayTracker,
  pickChaosMeme,
} from "../src/game/cat-chaos";
import { MEMES } from "../src/game/memes";

describe("Cat Chaos presentation", () => {
  it("can pick every existing meme and allows repeats without taking a card or rank", () => {
    const ids = Object.keys(MEMES);
    assert.deepEqual(
      ids.map((_, i) => pickChaosMeme(() => (i + 0.5) / ids.length)),
      ids,
    );
    assert.equal(pickChaosMeme(() => 0.5), pickChaosMeme(() => 0.5));
    assert(CHAOS_DURATION_MS >= 500 && CHAOS_DURATION_MS <= 1500);
  });

  it("reacts once per new public play, not per selected card, render, response or sound toggle", () => {
    const observe = createChaosPlayTracker();
    const lobby = { scope: "table", round: 1, play: 0, pending: false };
    assert.equal(observe(lobby), false);
    const played = { ...lobby, play: 1, pending: true };
    assert.equal(observe(played), true);
    assert.equal(observe({ ...played }), false);
    assert.equal(observe({ ...played, pending: false }), false);
    assert.equal(observe({ ...played, play: 2 }), true);
  });

  it("does not react to failed submissions with no confirmed play", () => {
    const observe = createChaosPlayTracker();
    const table = { scope: "table", round: 1, play: 3, pending: false };
    observe(table);
    assert.equal(observe({ ...table }), false);
    assert.equal(observe({ ...table }), false);
  });

  it("does not replay existing claims when joining, reconnecting or switching rooms", () => {
    const observe = createChaosPlayTracker();
    const existing = { scope: "table", round: 1, play: 4, pending: true };
    assert.equal(observe(existing), false);
    assert.equal(observe(null), false);
    assert.equal(observe(existing), false);
    assert.equal(observe({ ...existing, scope: "another-table", play: 10 }), false);
    assert.equal(observe({ ...existing, scope: "another-table", play: 11 }), true);
  });

  it("resets for a rematch and skips claims already resolved before a poll", () => {
    const observe = createChaosPlayTracker();
    const table = { scope: "table", round: 1, play: 9, pending: false };
    observe(table);
    assert.equal(observe({ ...table, round: 2, play: 0 }), false);
    assert.equal(observe({ ...table, round: 2, play: 1, pending: true }), true);
    assert.equal(observe({ ...table, round: 2, play: 2 }), false);
  });
});
