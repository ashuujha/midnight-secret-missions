// LOCAL ONLY: real compiled contract simulation + HTTP handler, simulated indexer latency.
// Does not submit transactions, run proofs, or load-test shared Midnight/Vercel services.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { createTableService } from "../server/table-service";
import { decodeSnapshot } from "../src/midnight/classic-public";
import { makeLoadFixture } from "../tests/helpers/classic-load-fixture";

const players = Number(process.env.LOAD_PLAYERS ?? 4);
assert([2, 3, 4].includes(players), "LOAD_PLAYERS must be 2, 3 or 4");
const clients = 100, rounds = 8, roomCount = Math.ceil(clients / players);
console.log(`Preparing ${roomCount} circuit-simulated rooms (${players} seats), ${clients} HTTP clients…`);
const fixture = makeLoadFixture(roomCount, players);
let upstream = 0;
const contract = "a".repeat(64);
const server = createServer(createTableService({ contract, network: "preprod", load: async () => {
  upstream++;
  await delay(100); // Explicit simulation, not a measured indexer latency.
  return fixture;
} }));
server.listen(0, "127.0.0.1");
await once(server, "listening");
const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
const latencies: number[] = [];
let bytes = 0, errors = 0;
const started = performance.now();
try {
  // Synchronized bursts are deliberately harsher than the jittered browser poller.
  for (let round = 0; round < rounds; round++) {
    await Promise.all(Array.from({ length: clients }, async (_, i) => {
      const at = performance.now(), room = fixture.rooms[Math.floor(i / players)];
      try {
        const response = await fetch(`${origin}/api/table?contract=${contract}&network=preprod&room=${room}`,
          { signal: AbortSignal.timeout(5000) });
        assert.equal(response.status, 200);
        const text = await response.text();
        const snapshot = decodeSnapshot(text, room);
        assert.equal(snapshot.players.length, players);
        assert.equal(snapshot.deck.length, 52);
        assert.equal(snapshot.state.status, 3n);
        bytes += Buffer.byteLength(text);
        latencies.push(performance.now() - at);
      } catch { errors++; }
    }));
    if (round < rounds - 1) await delay(Math.max(0, started + (round + 1) * 4000 - performance.now()));
  }
  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.ceil(latencies.length * .95) - 1] ?? Infinity;
  console.log(JSON.stringify({ scope: "local public-read service; simulated indexer, no proofs or chain submissions",
    clients, playersPerRoom: players, rooms: roomCount, requests: rounds * clients,
    errors, upstreamReads: upstream, previousUncachedReads: rounds * clients,
    upstreamReductionPercent: 100 * (1 - upstream / (rounds * clients)),
    p95Milliseconds: Math.round(p95), maxMilliseconds: Math.round(latencies.at(-1) ?? 0),
    averageRoomBytes: Math.round(bytes / Math.max(latencies.length, 1)),
    seconds: Math.round((performance.now() - started) / 1000),
  }, null, 2));
  assert.equal(errors, 0, "all room requests must succeed");
  assert(upstream <= rounds + 1, "requests must coalesce across rooms");
  assert(p95 < 1000, "local read p95 should stay below one second");
} finally {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
}
