import assert from "node:assert/strict";
import { before, after, describe, it } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { createTableService } from "../server/table-service";
import { decodeSnapshot, encodeSnapshot, projectTable, isOlderSnapshot } from "../src/midnight/classic-public";
import { makeLoadFixture } from "./helpers/classic-load-fixture";

describe("public table service under concurrent room traffic", () => {
  const contract = "a".repeat(64);
  let fixture: ReturnType<typeof makeLoadFixture>;
  let time = 0, reads = 0, failing = false, height = 100;
  const server = createServer(createTableService({ contract, network: "preprod", now: () => time,
    load: async () => {
      reads++;
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (failing) throw new Error("Private upstream diagnostic must not escape");
      return { ledger: fixture.ledger, blockHeight: height };
    },
  }));
  let origin: string;
  const url = (room = fixture.rooms[0]) => `${origin}/api/table?contract=${contract}&network=preprod&room=${room}`;
  before(async () => {
    fixture = makeLoadFixture(25, 4);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  });
  after(() => { server.closeAllConnections(); server.close(); });

  it("serves 100 clients across 25 real circuit-generated rooms with one upstream read", async () => {
    await Promise.all(Array.from({ length: 100 }, async (_, i) => {
      const room = fixture.rooms[i % 25];
      const response = await fetch(url(room));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("vercel-cdn-cache-control"), "public, s-maxage=2");
      const text = await response.text();
      const snapshot = decodeSnapshot(text, room);
      assert.deepEqual(snapshot, projectTable(fixture.ledger, room, 100));
      assert.equal(snapshot.players.length, 4);
      assert.equal(snapshot.state.status, 3n);
      assert.equal(snapshot.deck.length, 52);
      assert(!/"(secret|key|hand|randomness|order|opened)"/.test(text));
      for (const other of fixture.rooms) if (other !== room) assert(!text.includes(other));
      assert(Buffer.byteLength(text) < 32000);
    }));
    assert.equal(reads, 1);
  });
  it("bounds cache freshness, refreshes together, and never serves failures as success", async () => {
    time = 2500; height = 101;
    await Promise.all(Array.from({ length: 30 }, () => fetch(url()).then(async (r) => {
      assert.equal(decodeSnapshot(await r.text(), fixture.rooms[0]).blockHeight, 101);
    })));
    assert.equal(reads, 2);
    time = 5000; failing = true;
    const failures = await Promise.all(Array.from({ length: 100 }, () => fetch(url())));
    for (const r of failures) {
      assert.equal(r.status, 503);
      assert.equal(r.headers.get("cache-control"), "no-store");
      assert.equal(r.headers.get("retry-after"), "5");
      assert(!(await r.text()).includes("diagnostic"));
    }
    assert.equal(reads, 3);
    assert.equal((await fetch(url())).status, 503);
    assert.equal(reads, 3, "cooldown prevents upstream retry storm");
    time = 10001; failing = false; height = 102;
    assert.equal((await fetch(url())).status, 200);
    assert.equal(reads, 4);
    time = 13000; height = 100;
    assert.equal((await fetch(url())).status, 503, "regressing indexer is not served");
  });
  it("rejects writes, unconfigured targets and extra query input without reaching the indexer", async () => {
    const before = reads;
    assert.equal((await fetch(url(), { method: "POST", body: "private data" })).status, 405);
    for (const target of [url() + "&secret=x", url() + "&room=" + fixture.rooms[0],
      url().replace(contract, "b".repeat(64)), url().replace("preprod", "other"), url("invalid")])
      assert.equal((await fetch(target)).status, 400);
    assert.equal(reads, before);
  });
  it("round-trips only public fields and rejects a response for another room", () => {
    const a = projectTable(fixture.ledger, fixture.rooms[0], 100);
    const text = encodeSnapshot(a);
    assert.deepEqual(decodeSnapshot(text, a.room), a);
    assert.throws(() => decodeSnapshot(text, fixture.rooms[1]), /incomplete/);
  });
  it("prevents cached state rolling back confirmations, including multiple moves in one block", () => {
    const a = projectTable(fixture.ledger, fixture.rooms[0], 100);
    const respond = { ...a, state: { ...a.state, play: 1n, phase: 1n } };
    const reveal = { ...respond, state: { ...respond.state, phase: 2n } };
    const settled = { ...respond, state: { ...respond.state, phase: 0n } };
    assert(isOlderSnapshot(a, null, 101));
    assert(isOlderSnapshot(respond, reveal));
    assert(isOlderSnapshot(reveal, settled));
    assert(!isOlderSnapshot(settled, reveal));
    assert(!isOlderSnapshot({ ...a, blockHeight: 101 }, a));
    assert(!isOlderSnapshot({ ...a, room: fixture.rooms[1] }, settled));
  });
});
