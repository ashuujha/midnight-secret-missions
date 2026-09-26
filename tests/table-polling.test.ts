import assert from "node:assert/strict";
import { it } from "node:test";
import { startTablePolling } from "../src/utils/table-polling";

it("pauses hidden/offline tabs, resumes, and removes listeners on cleanup", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let visible = true, online = true, reads = 0, removed = false;
  let changed = () => {};
  const stop = startTablePolling(async () => { reads++; }, {
    visible: () => visible, online: () => online, random: () => 0,
    subscribe: (listener) => { changed = listener; return () => { removed = true; }; },
  });
  const advance = async (ms: number) => { t.mock.timers.tick(ms); await Promise.resolve(); };
  await advance(0); assert.equal(reads, 1);
  visible = false; changed(); await advance(30000); assert.equal(reads, 1);
  visible = true; changed(); await advance(0); assert.equal(reads, 2);
  online = false; changed(); await advance(30000); assert.equal(reads, 2);
  online = true; changed(); await advance(0); assert.equal(reads, 3);
  stop(); await advance(30000); assert.equal(reads, 3); assert(removed);
});

it("backs off failed reads, resets after recovery, and never overlaps slow requests", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let reads = 0, healthy = false, finish: ((value: boolean) => void) | undefined;
  const stop = startTablePolling(() => {
    reads++;
    if (healthy) return new Promise<boolean>((resolve) => { finish = resolve; });
    return Promise.resolve(false);
  }, { visible: () => true, online: () => true, random: () => 0, subscribe: () => () => {} });
  const advance = async (ms: number) => { t.mock.timers.tick(ms); await Promise.resolve(); };
  await advance(0); assert.equal(reads, 1);
  await advance(7999); assert.equal(reads, 1);
  await advance(1); assert.equal(reads, 2);
  await advance(15999); assert.equal(reads, 2);
  healthy = true; await advance(1); assert.equal(reads, 3);
  await advance(60000); assert.equal(reads, 3);
  finish!(true); await Promise.resolve();
  await advance(3999); assert.equal(reads, 3);
  await advance(1); assert.equal(reads, 4);
  stop(); finish!(true); await Promise.resolve();
  await advance(60000); assert.equal(reads, 4);
});
