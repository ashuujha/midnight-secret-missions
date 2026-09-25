let pending: Promise<void> | undefined;
let readyAt = 0;
const READY_TTL_MS = 10 * 60_000;

export function warmProofServer(): Promise<void> {
  const base = import.meta.env.VITE_PROOF_SERVER_URL?.trim();
  if (!base) return Promise.resolve();
  if (Date.now() - readyAt < READY_TTL_MS) return Promise.resolve();
  if (pending) return pending;
  pending = fetch(new URL('/ready', base), { signal: AbortSignal.timeout(90_000) })
    .then((response) => {
      if (!response.ok) throw new Error(`Proof server returned HTTP ${response.status}.`);
      readyAt = Date.now();
      pending = undefined;
    })
    .catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
  return pending;
}
