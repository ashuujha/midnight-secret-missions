/** Base game: 52 unique physical cards, 13 ranks, no replacement draws. */
export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
export const RANK_NAMES = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Jack",
  "Queen",
  "King",
] as const;
export const rankOf = (card: number) => Math.floor(card / 4);
export const nextRank = (rank: number) => (rank + 1) % 13;
export function randomIndex(limit: number): number {
  if (!Number.isInteger(limit) || limit < 1 || limit > 0x100000000)
    throw new Error("Invalid random range");
  const ceiling = Math.floor(0x100000000 / limit) * limit;
  const bytes = new Uint32Array(1);
  do {
    crypto.getRandomValues(bytes);
  } while (bytes[0] >= ceiling);
  return bytes[0] % limit;
}
export function shuffledDeck(choose = randomIndex): number[] {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  for (let i = 51; i > 0; i--) {
    const j = choose(i + 1);
    if (!Number.isInteger(j) || j < 0 || j > i)
      throw new Error("Invalid shuffle index");
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
export function dealDeck(deck: readonly number[], players: number): number[][] {
  if (!Number.isInteger(players) || players < 2 || players > 4)
    throw new Error("Invite 2–4 players");
  if (
    deck.length !== 52 ||
    new Set(deck).size !== 52 ||
    deck.some((c) => !Number.isInteger(c) || c < 0 || c >= 52)
  )
    throw new Error("A deck must contain each of the 52 cards exactly once");
  const hands = Array.from({ length: players }, () => [] as number[]);
  deck.forEach((card, i) => hands[i % players].push(card));
  return hands;
}
export type ClassicOutcome = "pending" | "passed" | "truth" | "bluff";
export type TurnRecord = {
  number: number;
  actor: number;
  rank: number;
  quantity: number;
  pileSize: number;
  passed: number[];
  challenger?: number;
  outcome: ClassicOutcome;
  receiver?: number;
  revealed?: number[];
};
export type ClassicView = {
  round: number;
  players: { id: string; name: string; count: number }[];
  hand: number[];
  viewer: number;
  turn: number;
  rank: number;
  phase: "play" | "respond" | "reveal" | "transfer" | "finished";
  responder: number;
  pileSize: number;
  latest?: TurnRecord;
  history: TurnRecord[];
  winner: number | null;
};
export type ClassicState = {
  round: number;
  names: string[];
  hands: number[][];
  pile: number[];
  turn: number;
  rank: number;
  phase: ClassicView["phase"];
  responder: number;
  lastCards: number[];
  history: TurnRecord[];
  winner: number | null;
};
export type ClassicAction =
  | { kind: "play"; cards: number[] }
  | { kind: "pass" | "call" | "reveal" };
export function newClassicState(
  players = 2,
  round = 1,
  deck = shuffledDeck(),
): ClassicState {
  return {
    round,
    names: ["You", "Miso", "Mochi", "Beans"].slice(0, players),
    hands: dealDeck(deck, players),
    pile: [],
    turn: 0,
    rank: 0,
    phase: "play",
    responder: 1,
    lastCards: [],
    history: [],
    winner: null,
  };
}
export function assertConservation(state: ClassicState): void {
  const all = [...state.hands.flat(), ...state.pile];
  if (
    all.length !== 52 ||
    new Set(all).size !== 52 ||
    all.some((c) => !Number.isInteger(c) || c < 0 || c > 51)
  )
    throw new Error("Card conservation failed");
}
export function classicView(state: ClassicState, viewer = 0): ClassicView {
  const history = state.history.map((r) => ({
    ...r,
    passed: [...r.passed],
    ...(r.revealed ? { revealed: [...r.revealed] } : {}),
  }));
  return {
    round: state.round,
    players: state.names.map((name, i) => ({
      id: `practice-${i}`,
      name,
      count: state.hands[i].length,
    })),
    hand: [...(state.hands[viewer] ?? [])],
    viewer,
    turn: state.turn,
    rank: state.rank,
    phase: state.phase,
    responder: state.responder,
    pileSize: state.pile.length,
    latest: history.at(-1),
    history,
    winner: state.winner,
  };
}
export function applyClassic(
  state: ClassicState,
  seat: number,
  action: ClassicAction,
): ClassicState {
  if (state.phase === "finished") throw new Error("This round is finished");
  if (!Number.isInteger(seat) || seat < 0 || seat >= state.hands.length)
    throw new Error("Not a player at this table");
  const next: ClassicState = {
    ...state,
    hands: state.hands.map((h) => [...h]),
    pile: [...state.pile],
    lastCards: [...state.lastCards],
    history: state.history.map((r) => ({
      ...r,
      passed: [...r.passed],
      ...(r.revealed ? { revealed: [...r.revealed] } : {}),
    })),
  };
  const size = next.hands.length;
  const finish = () => {
    const actor = next.history.at(-1)!.actor;
    if (next.hands[actor].length === 0) {
      next.winner = actor;
      next.phase = "finished";
    } else next.phase = "play";
    next.turn = (actor + 1) % size;
    next.rank = nextRank(next.rank);
  };
  if (action.kind === "play") {
    if (next.phase !== "play" || seat !== next.turn)
      throw new Error("It is not your turn to play");
    const cards = action.cards;
    if (
      !cards.length ||
      new Set(cards).size !== cards.length ||
      cards.some((c) => !Number.isInteger(c) || !next.hands[seat].includes(c))
    )
      throw new Error("Select distinct cards from your own hand");
    next.hands[seat] = next.hands[seat].filter((c) => !cards.includes(c));
    next.pile.push(...cards);
    next.lastCards = [...cards];
    next.phase = "respond";
    next.responder = (seat + 1) % size;
    next.history.push({
      number: next.history.length + 1,
      actor: seat,
      rank: next.rank,
      quantity: cards.length,
      pileSize: next.pile.length,
      passed: [],
      outcome: "pending",
    });
  } else if (action.kind === "pass" || action.kind === "call") {
    if (next.phase !== "respond" || seat !== next.responder)
      throw new Error("It is not your response turn");
    const record = next.history.at(-1)!;
    if (action.kind === "call") {
      record.challenger = seat;
      next.phase = "reveal";
    } else {
      record.passed.push(seat);
      if (record.passed.length === size - 1) {
        record.outcome = "passed";
        finish();
      } else next.responder = (seat + 1) % size;
    }
  } else {
    const record = next.history.at(-1)!;
    if (next.phase !== "reveal" || seat !== record.actor)
      throw new Error("Only the challenged player can open this turn");
    const truth = next.lastCards.every((c) => rankOf(c) === record.rank);
    const loser = truth ? record.challenger! : record.actor;
    record.outcome = truth ? "truth" : "bluff";
    record.revealed = [...next.lastCards];
    record.receiver = loser;
    next.hands[loser].push(...next.pile);
    next.pile = [];
    finish();
  }
  assertConservation(next);
  return next;
}
/** Receives only this bot's hand and public facts; never another player's cards. */
export function botDecision(
  view: ClassicView,
  random = Math.random,
): ClassicAction {
  if (view.phase === "reveal") return { kind: "reveal" };
  if (view.phase === "respond") {
    const latest = view.latest!;
    const held = view.hand.filter((c) => rankOf(c) === latest.rank).length;
    const impossible = held + latest.quantity > 4;
    const finalCard = view.players[latest.actor].count === 0;
    const risk = impossible
      ? 1
      : finalCard
        ? 0.78
        : Math.min(
            0.62,
            0.16 + latest.quantity * 0.07 - (view.pileSize > 18 ? 0.08 : 0),
          );
    return { kind: random() < risk ? "call" : "pass" };
  }
  const matching = view.hand.filter((c) => rankOf(c) === view.rank);
  const unwanted = [...view.hand].sort(
    (a, b) =>
      ((rankOf(b) - view.rank + 13) % 13) - ((rankOf(a) - view.rank + 13) % 13),
  );
  const options = matching.length && random() < 0.83 ? matching : unwanted;
  const count = Math.min(
    options.length,
    1 + Math.floor(random() * Math.min(3, options.length)),
  );
  return { kind: "play", cards: options.slice(0, count) };
}
export function declaration(quantity: number, rank: number): string {
  return `${quantity} ${RANK_NAMES[rank]}${quantity === 1 ? "" : "s"}`;
}
