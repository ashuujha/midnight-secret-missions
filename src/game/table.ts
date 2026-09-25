import type { Player } from '../midnight/game';

export const PLACES = [
  { name: 'Museum', caption: 'Here for the art.', color: 'peach' },
  { name: 'Cafe', caption: 'Just a little coffee.', color: 'yellow' },
  { name: 'Stadium', caption: 'Big fan. Huge.', color: 'lilac' },
  { name: 'Park', caption: 'Touching some grass.', color: 'green' },
  { name: 'Mall', caption: 'Absolutely just browsing.', color: 'blue' },
] as const;

// Mirrored from the deployed circuit; contract parity is covered by table.test.ts.
export const ROUTES = [
  [0, 1, 2],
  [1, 4, 3],
  [2, 0, 3],
  [3, 2, 1],
  [0, 4, 1],
  [1, 2, 3],
  [2, 3, 0],
  [4, 0, 2],
] as const;

export function routeProgress(
  visits: readonly number[],
  route: readonly number[],
) {
  let matched = 0;
  for (const visit of visits)
    if (matched < route.length && visit === route[matched]) matched++;
  const decoys = visits.length - matched;
  return {
    matched,
    decoysLeft: Math.max(0, 2 - decoys),
    possible: visits.length + (route.length - matched) <= 5,
    complete: visits.length === 5 && matched === route.length,
  };
}

/** Cosmetic hand order only. This never changes a committed mission. */
export function shuffleHand(random = Math.random): number[] {
  const hand = [0, 1, 2, 3, 4];
  for (let i = hand.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [hand[i], hand[j]] = [hand[j], hand[i]];
  }
  return hand;
}

export type PracticeGame = {
  mission: number;
  botMission: number;
  player: Player;
  bot: Player;
  message: string;
};

const newPlayer = (id: string): Player => ({
  id,
  visits: [],
  score: 0,
  round: 1,
  runStatus: 0,
  challengeTokens: 3,
  challengeStatus: 0,
  challengerId: null,
  challengeDeadline: null,
});

export function dealPractice(
  mission: number,
  previous?: PracticeGame,
): PracticeGame {
  const player = newPlayer('you');
  const bot = newPlayer('miso');
  if (previous) {
    player.score = previous.player.score;
    player.challengeTokens = previous.player.challengeTokens;
    player.round = previous.player.round + 1;
    bot.score = previous.bot.score;
    bot.challengeTokens = previous.bot.challengeTokens;
    bot.round = player.round;
  }
  // A teaching opponent: alternating provable and impossible trails.
  const botMission = player.round % 2 === 1 ? 0 : 1;
  bot.visits = [3, 0, 4, 1, 2];
  return {
    mission,
    botMission,
    player,
    bot,
    message:
      'Miso has played five cards. Your turn. Keep your three secret stops in order.',
  };
}

export type PracticeAction =
  | { kind: 'visit'; location: number }
  | { kind: 'claim' | 'forfeit' | 'challenge' | 'resolve' };

/** Local rules tutorial only: no wallet, cryptographic proof, or chain transaction. */
export function practiceAction(
  state: PracticeGame,
  action: PracticeAction,
  now: number,
): PracticeGame {
  const next: PracticeGame = {
    ...state,
    player: { ...state.player, visits: [...state.player.visits] },
    bot: { ...state.bot },
  };
  const { player, bot } = next;
  const expired =
    player.challengeStatus === 1 &&
    player.challengeDeadline !== null &&
    now >= player.challengeDeadline;
  if (action.kind === 'visit') {
    if (
      player.runStatus !== 0 ||
      expired ||
      player.visits.length >= 5 ||
      !Number.isInteger(action.location) ||
      action.location < 0 ||
      action.location > 4
    )
      return state;
    player.visits.push(action.location);
    next.message = `${PLACES[action.location].name}. Very normal. Very unsuspicious.`;
    if (
      player.visits.length === 3 &&
      bot.challengeTokens > 0 &&
      player.challengeStatus === 0
    ) {
      bot.challengeTokens--;
      player.challengeStatus = 1;
      player.challengerId = bot.id;
      player.challengeDeadline = now + 20 * 60_000;
      next.message =
        'Miso called your bluff! Finish your five moves and check your route before the timer runs out.';
    }
  } else if (action.kind === 'claim') {
    if (
      player.runStatus !== 0 ||
      expired ||
      !routeProgress(player.visits, ROUTES[state.mission]).complete
    )
      return state;
    player.runStatus = 1;
    player.score++;
    player.challengeTokens = Math.min(3, player.challengeTokens + 1);
    if (player.challengeStatus === 1) player.challengeStatus = 2;
    next.message =
      'Route checks out. One practice point for you. Miso is emotionally unavailable.';
  } else if (action.kind === 'forfeit' || action.kind === 'resolve') {
    if (player.runStatus !== 0 || (action.kind === 'resolve' && !expired))
      return state;
    player.runStatus = 2;
    if (player.challengeStatus === 1) {
      player.challengeStatus = 3;
      bot.score++;
      bot.challengeTokens = Math.min(3, bot.challengeTokens + 1);
    }
    next.message = 'This round got away from you. Fresh cards, fresh alibi?';
  } else if (action.kind === 'challenge') {
    if (
      bot.runStatus !== 0 ||
      bot.challengeStatus !== 0 ||
      player.challengeTokens < 1
    )
      return state;
    player.challengeTokens--;
    bot.challengerId = player.id;
    if (routeProgress(bot.visits, ROUTES[state.botMission]).complete) {
      bot.runStatus = 1;
      bot.challengeStatus = 2;
      bot.score++;
      bot.challengeTokens = Math.min(3, bot.challengeTokens + 1);
      next.message =
        'Miso can complete that route! The practice check passes. Your staked token is gone.';
    } else {
      bot.runStatus = 2;
      bot.challengeStatus = 3;
      player.score++;
      player.challengeTokens = Math.min(3, player.challengeTokens + 1);
      next.message =
        'Caught! Miso forfeits. You get a practice point and your token back.';
    }
  }
  return next;
}
