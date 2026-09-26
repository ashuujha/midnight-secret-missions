import type { IncomingMessage, ServerResponse } from "node:http";
import { fetchPublicLedger, isContractId, isNetwork, type PublicLedger } from "../src/midnight/public-ledger.js";
import { encodeSnapshot, projectTable } from "../src/midnight/classic-public.js";

export function createTableService(options: {
  contract: string;
  network: string;
  load?: typeof fetchPublicLedger;
  now?: () => number;
}) {
  const load = options.load ?? fetchPublicLedger;
  const now = options.now ?? Date.now;
  const contract = options.contract.trim().toLowerCase();
  let cached: PublicLedger | undefined, expires = 0, retryAfter = 0;
  let pending: Promise<PublicLedger> | undefined;
  // Bounded, public-only room projections; discarded whenever the ledger refreshes.
  const rooms = new Map<string, string>();
  const latest = () => {
    if (cached && now() < expires) return Promise.resolve(cached);
    if (pending) return pending;
    if (now() < retryAfter) return Promise.reject(new Error("Indexer cooling down"));
    pending = load(contract, options.network).then((value) => {
      if (cached && value.blockHeight < cached.blockHeight) throw new Error("Indexer is behind");
      cached = value;
      expires = now() + 2000;
      rooms.clear();
      return value;
    }).catch((error: unknown) => {
      retryAfter = now() + 5000;
      throw error;
    }).finally(() => { pending = undefined; });
    return pending;
  };
  return async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const fail = (status: number, message: string) => {
      res.statusCode = status;
      res.end(JSON.stringify({ error: message }));
    };
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return fail(405, "Only public table reads are supported.");
    }
    if (!isContractId(contract) || !isNetwork(options.network))
      return fail(503, "The table service is not configured.");
    const query = new URL(req.url ?? "/", "http://localhost").searchParams;
    if ([...query.keys()].length !== 3 ||
        [...query.keys()].some((key) => !["contract", "room", "network"].includes(key)) ||
        query.get("contract") !== contract || query.get("network") !== options.network ||
        !isContractId(query.get("room") ?? ""))
      return fail(400, "Use the configured public contract, network and room.");
    let value: PublicLedger;
    try { value = await latest(); }
    catch {
      res.setHeader("Retry-After", "5");
      return fail(503, "Table updates are temporarily unavailable. Retry shortly.");
    }
    const room = query.get("room")!;
    let body = rooms.get(room);
    if (!body) {
      try { body = encodeSnapshot(projectTable(value.ledger, room, value.blockHeight)); }
      catch { return fail(404, "This Classic 52 room is not confirmed yet."); }
      if (rooms.size >= 256) rooms.delete(rooms.keys().next().value!);
      rooms.set(room, body);
    }
    // Browser revalidates; Vercel may share a response briefly across room viewers.
    // No stale-while-revalidate: failed reads must not look like a live table.
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=2");
    res.statusCode = 200;
    res.end(body);
  };
}
