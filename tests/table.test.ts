import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pureCircuits } from '../managed/secret-trail/contract/index.js';
import {
  ROUTES,
  routeProgress,
  shuffleHand,
  dealPractice,
  practiceAction,
} from '../src/game/table';

const start = 1_700_000_000_000;
const playRoute = () =>
  [3, 0, 4, 1, 2].reduce(
    (state, location) =>
      practiceAction(state, { kind: 'visit', location }, start),
    dealPractice(0),
  );

describe('Card table rules and practice mode', () => {
  it('uses the deployed contract routes for every secret mission', () => {
    for (let mission = 0; mission < ROUTES.length; mission++) {
      const id = BigInt(mission);
      assert.deepEqual(
        [...ROUTES[mission]],
        [
          pureCircuits.missionFirst(id),
          pureCircuits.missionSecond(id),
          pureCircuits.missionThird(id),
        ].map(Number),
      );
    }
  });
  it('recognizes ordered secret stops with interleaved decoys and rejects premature completion', () => {
    assert.deepEqual(routeProgress([3, 0, 4, 1, 2], ROUTES[0]), {
      matched: 3,
      decoysLeft: 0,
      possible: true,
      complete: true,
    });
    assert.equal(routeProgress([0, 1, 2], ROUTES[0]).complete, false);
    assert.equal(routeProgress([2, 1, 0, 3, 4], ROUTES[0]).complete, false);
    assert.equal(routeProgress([3, 4, 3], ROUTES[0]).possible, false);
  });
  it('deals exactly one of each location without mutating the secret route', () => {
    assert.deepEqual([...shuffleHand(() => 0)].sort(), [0, 1, 2, 3, 4]);
    assert.notDeepEqual(
      shuffleHand(() => 0),
      shuffleHand(() => 0.99),
    );
    assert.deepEqual([...ROUTES[0]], [0, 1, 2]);
  });
  it('automatically stakes a bot token and awards a valid practice claim only once', () => {
    const game = playRoute();
    assert.equal(game.player.challengeStatus, 1);
    assert.equal(game.bot.challengeTokens, 2);
    const won = practiceAction(game, { kind: 'claim' }, start + 100);
    assert.equal(won.player.score, 1);
    assert.equal(won.player.runStatus, 1);
    assert.equal(won.player.challengeStatus, 2);
    assert.equal(won.bot.challengeTokens, 2);
    assert.equal(practiceAction(won, { kind: 'claim' }, start + 101), won);
    assert.equal(
      practiceAction(won, { kind: 'visit', location: 0 }, start + 101),
      won,
    );
  });
  it('refuses invalid practice routes, sixth visits, invalid cards, and late claims', () => {
    const fresh = dealPractice(0);
    assert.equal(
      practiceAction(fresh, { kind: 'visit', location: -1 }, start),
      fresh,
    );
    const invalid = [4, 3, 2, 4, 1].reduce(
      (state, location) =>
        practiceAction(state, { kind: 'visit', location }, start),
      fresh,
    );
    assert.equal(
      practiceAction(invalid, { kind: 'claim' }, start + 100),
      invalid,
    );
    assert.equal(
      practiceAction(invalid, { kind: 'visit', location: 0 }, start + 100),
      invalid,
    );
    const valid = playRoute();
    assert.equal(
      practiceAction(valid, { kind: 'claim' }, start + 20 * 60_000),
      valid,
    );
    const timeout = practiceAction(
      valid,
      { kind: 'resolve' },
      start + 20 * 60_000,
    );
    assert.equal(timeout.bot.score, 1);
    assert.equal(timeout.bot.challengeTokens, 3);
    assert.equal(timeout.player.runStatus, 2);
  });
  it('awards the bot a point and refunds its stake after a forfeit', () => {
    const lost = practiceAction(playRoute(), { kind: 'forfeit' }, start + 100);
    assert.equal(lost.player.runStatus, 2);
    assert.equal(lost.bot.score, 1);
    assert.equal(lost.bot.challengeTokens, 3);
    assert.equal(practiceAction(lost, { kind: 'forfeit' }, start + 101), lost);
  });
  it('settles both challenge outcomes and rejects repeated stakes', () => {
    const first = practiceAction(dealPractice(0), { kind: 'challenge' }, start);
    assert.equal(first.player.challengeTokens, 2);
    assert.equal(first.bot.score, 1);
    assert.equal(first.bot.runStatus, 1);
    assert.equal(
      practiceAction(first, { kind: 'challenge' }, start + 1),
      first,
    );
    const next = dealPractice(1, first);
    const caught = practiceAction(next, { kind: 'challenge' }, start);
    assert.equal(caught.player.score, 1);
    assert.equal(caught.player.challengeTokens, 2);
    assert.equal(caught.bot.runStatus, 2);
  });
  it('keeps practice scores and tokens while clearing the previous trail on a new round', () => {
    const won = practiceAction(playRoute(), { kind: 'claim' }, start + 100);
    const next = dealPractice(7, won);
    assert.equal(next.player.round, 2);
    assert.equal(next.player.score, 1);
    assert.equal(next.player.challengeTokens, won.player.challengeTokens);
    assert.equal(next.player.challengeStatus, 0);
    assert.deepEqual(next.player.visits, []);
    assert.equal(next.mission, 7);
    assert.equal(won.player.visits.length, 5);
  });
});
