// Public ledger projection only. Never import wallet sessions, witnesses or private keys here.
import { fromHex, toHex } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as Game from "../../managed/cat-bluff52/contract/index.js";
import type { TurnRecord } from "../game/classic-rules";

export type Snapshot = {
  room: string;
  blockHeight: number;
  state: Game.Room;
  players: string[];
  keys: ReturnType<typeof Game.pureCircuits.publicKey>[];
  deck: Game.CipherCard[];
  owners: number[];
  custodians: number[];
  selected: boolean[];
  history: TurnRecord[];
  revision: string;
};
// Multiple moves may share a block. Compare progress within the same round too.
// A settled play (phase 0) follows respond/reveal/transfer for that play number.
export function isOlderSnapshot(next: Snapshot, previous: Snapshot | null, confirmedHeight = 0): boolean {
  if (next.blockHeight < confirmedHeight) return true;
  if (!previous || previous.room !== next.room) return false;
  if (next.blockHeight !== previous.blockHeight) return next.blockHeight < previous.blockHeight;
  const progress = ({ state: t }: Snapshot) => [t.round, t.status,
    t.status === 0n ? t.size : t.status < 3n ? t.step : t.play,
    t.phase === 0n ? 4n : t.phase, t.passes, 52n - t.pile];
  const a = progress(next), b = progress(previous);
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}
export function projectTable(ledger: ReturnType<typeof Game.ledger>, roomId: string, blockHeight: number): Snapshot {
  if (ledger.schemaVersion !== 4n)
    throw new Error(
      "This address uses different game rules. Classic 52 needs its V4 contract; earlier five-cat tables remain separate.",
    );
  const room = fromHex(roomId);
  if (!ledger.rooms.member(room))
    throw new Error(
      "This room is not confirmed yet. Wait for the host’s creation transaction.",
    );
  const t = ledger.rooms.lookup(room);
  const history: TurnRecord[] = [];
  for (let i = Math.max(1, Number(t.play) - 19); i <= Number(t.play); i++) {
    const r = ledger.turns.lookup(
      Game.pureCircuits.turnKey(room, t.round, BigInt(i)),
    );
    const revealed = r.revealed.filter((c) => c !== 255n).map(Number);
    history.push({
      number: i,
      actor: Number(r.actor),
      rank: Number(r.rank),
      quantity: Number(r.quantity),
      pileSize: Number(r.pileSize),
      passed: Array.from(
        { length: Number(r.passes) },
        (_, n) => (Number(r.actor) + n + 1) % Number(t.size),
      ),
      ...(r.challenger === 255n ? {} : { challenger: Number(r.challenger) }),
      outcome: (["pending", "passed", "truth", "bluff"] as const)[
        Number(r.outcome)
      ],
      ...(r.receiver === 255n ? {} : { receiver: Number(r.receiver) }),
      ...(revealed.length ? { revealed } : {}),
    });
  }
  return {
    room: roomId,
    blockHeight,
    state: t,
    players: ledger.players.lookup(room).slice(0, Number(t.size)).map(toHex),
    keys: ledger.playerKeys.lookup(room),
    deck: ledger.decks.member(room) ? ledger.decks.lookup(room) : [],
    owners: ledger.owners.member(room)
      ? ledger.owners.lookup(room).map(Number)
      : [],
    custodians: ledger.custodians.member(room)
      ? ledger.custodians.lookup(room).map(Number)
      : [],
    selected: ledger.lastSelections.member(room)
      ? ledger.lastSelections.lookup(room)
      : [],
    history,
    revision: JSON.stringify(t, (_, v) =>
      typeof v === "bigint" ? v.toString() : v,
    ),
  };
}

export const encodeSnapshot = (snapshot: Snapshot) => JSON.stringify(snapshot, (_, value) =>
  typeof value === "bigint" ? { $bigint: value.toString() } : value,
);
export function decodeSnapshot(text: string, room: string): Snapshot {
  const snapshot = JSON.parse(text, (_, value) =>
    value && typeof value === "object" && Object.keys(value).length === 1 &&
    typeof value.$bigint === "string" && /^\d{1,80}$/.test(value.$bigint)
      ? BigInt(value.$bigint) : value,
  ) as Snapshot;
  if (snapshot.room !== room || !Number.isSafeInteger(snapshot.blockHeight) || snapshot.blockHeight < 0 ||
      typeof snapshot.state?.round !== "bigint" || !Array.isArray(snapshot.players) ||
      !Array.isArray(snapshot.deck) || !Array.isArray(snapshot.history) || typeof snapshot.revision !== "string")
    throw new Error("The table response was incomplete. Try refreshing again.");
  return snapshot;
}
