export const CATS = [
  {
    name: "Pop Cat",
    image: "/memes/pop.png",
    quote: "absolutely speechless.",
    rank: "A",
    suit: "♠",
  },
  {
    name: "Huh Cat",
    image: "/memes/huh.jpg",
    quote: "the math is not mathing.",
    rank: "K",
    suit: "♥",
  },
  {
    name: "Polite Cat",
    image: "/memes/polite.jpg",
    quote: "would this face lie?",
    rank: "Q",
    suit: "♣",
  },
  {
    name: "Banana Cat",
    image: "/memes/banana.png",
    quote: "peel under pressure.",
    rank: "J",
    suit: "♦",
  },
  {
    name: "Crying Cat",
    image: "/memes/crying.png",
    quote: "totally fine. totally.",
    rank: "10",
    suit: "♠",
  },
] as const;
export type Seat = { id: string; count: number; penalties: number };
export type Table = {
  id: string;
  players: Seat[];
  host: string;
  status: number;
  turn: number;
  phase: number;
  responder: number;
  passes: number;
  play: number;
  claim: number;
  commitment: string;
  actor: string;
  challenger: string;
  deadline: number;
  winner: string;
  outcome: number;
  loser: string;
};
export type LocalTable = {
  table: Table;
  hands: number[][];
  actual: number;
  guide: boolean;
};
export type LocalAction =
  | { kind: "play"; card: number; claim: number }
  | { kind: "pass" | "call" | "prove"; honest?: boolean };
export function drawCards(count = 5): number[] {
  if (!Number.isInteger(count) || count < 0 || count > 64)
    throw new Error("Invalid draw count");
  const cards: number[] = [];
  while (cards.length < count) {
    const bytes = crypto.getRandomValues(new Uint8Array(count - cards.length));
    for (const value of bytes) {
      if (value < 255) cards.push(value % 5);
    }
  }
  return cards;
}
export function countsOf(cards: number[]): number[] {
  return CATS.map((_, cat) => cards.filter((c) => c === cat).length);
}
export function cardsOf(counts: readonly number[]): number[] {
  return counts.flatMap((n, cat) => Array.from({ length: n }, () => cat));
}
export function newPractice(guide = true): LocalTable {
  const hands = [guide ? [0, 1, 2, 3, 4] : drawCards(), drawCards()];
  return {
    guide,
    hands,
    actual: 0,
    table: {
      id: "practice",
      players: [
        { id: "you", count: 5, penalties: 0 },
        { id: "miso", count: 5, penalties: 0 },
      ],
      host: "you",
      status: 1,
      turn: 0,
      phase: 0,
      responder: 1,
      passes: 0,
      play: 0,
      claim: 0,
      commitment: "",
      actor: "",
      challenger: "",
      deadline: 0,
      winner: "",
      outcome: 0,
      loser: "",
    },
  };
}
export function localAction(
  state: LocalTable,
  seat: number,
  action: LocalAction,
): LocalTable {
  const next = {
    ...state,
    table: {
      ...state.table,
      players: state.table.players.map((p) => ({ ...p })),
    },
    hands: state.hands.map((h) => [...h]),
  };
  const t = next.table;
  if (t.status === 2) return state;
  const finish = () => {
    const actor = t.players.findIndex((p) => p.id === t.actor);
    if (next.hands[actor].length === 0) {
      t.status = 2;
      t.winner = t.actor;
    }
    t.turn = (t.turn + 1) % t.players.length;
    t.phase = 0;
  };
  if (action.kind === "play") {
    if (
      t.phase !== 0 ||
      t.turn !== seat ||
      action.card < 0 ||
      action.card >= next.hands[seat].length ||
      !Number.isInteger(action.claim) ||
      action.claim < 0 ||
      action.claim >= 5
    )
      return state;
    next.actual = next.hands[seat].splice(action.card, 1)[0];
    t.players[seat].count--;
    t.actor = t.players[seat].id;
    t.claim = action.claim;
    t.phase = 1;
    t.responder = (seat + 1) % t.players.length;
    t.passes = 0;
    t.play++;
    t.outcome = 0;
    t.challenger = "";
    t.deadline = Date.now() + 1_200_000;
  } else if (action.kind === "pass") {
    if (t.phase !== 1 || t.responder !== seat) return state;
    t.passes++;
    if (t.passes === t.players.length - 1) {
      t.outcome = 1;
      finish();
    } else t.responder = (seat + 1) % t.players.length;
  } else if (action.kind === "call") {
    if (t.phase !== 1 || t.responder !== seat) return state;
    t.challenger = t.players[seat].id;
    t.phase = 2;
  } else {
    if (t.phase !== 2 || t.actor !== t.players[seat].id) return state;
    const honest = next.actual === t.claim;
    const loser = honest
      ? t.players.findIndex((p) => p.id === t.challenger)
      : seat;
    next.hands[loser].push(...drawCards(2));
    t.players[loser].count += 2;
    t.loser = t.players[loser].id;
    t.outcome = honest ? 2 : 3;
    finish();
  }
  return next;
}
export function inviteUrl(
  origin: string,
  room: string,
  contract: string,
): string {
  if (!/^[0-9a-f]{64}$/i.test(room) || !/^[0-9a-f]{64}$/i.test(contract))
    throw new Error("Create a live table before inviting friends.");
  const url = new URL(origin);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  url.searchParams.set("table", room);
  url.searchParams.set("contract", contract);
  return url.toString();
}
export function readInvite(
  search: string,
): { room: string; contract: string } | null {
  const params = new URLSearchParams(search);
  const room = params.get("table"),
    contract = params.get("contract");
  return room &&
    contract &&
    /^[0-9a-f]{64}$/i.test(room) &&
    /^[0-9a-f]{64}$/i.test(contract)
    ? { room: room.toLowerCase(), contract: contract.toLowerCase() }
    : null;
}
