import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createCircuitContext, createConstructorContext, sampleContractAddress,
  type CircuitContext, type WitnessContext,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger, pureCircuits, type Ledger, type Witnesses } from '../managed/secret-trail/contract/index.js';

type PrivateState = { secret: Uint8Array; mission: bigint; salt: Uint8Array };
const identity = (n: number, mission = 0n): PrivateState => ({
  secret: new Uint8Array(32).fill(n), mission, salt: new Uint8Array(32).fill(n + 20),
});
const alice = identity(1);
const bob = identity(2, 1n);
const aliceId = pureCircuits.playerId(alice.secret);
const bobId = pureCircuits.playerId(bob.secret);
const start = 1_700_000_000_000;

const witnesses: Witnesses<PrivateState> = {
  identitySecret(context: WitnessContext<Ledger, PrivateState>) { return [context.privateState, context.privateState.secret]; },
  hiddenMission(context: WitnessContext<Ledger, PrivateState>) { return [context.privateState, context.privateState.mission]; },
  missionSalt(context: WitnessContext<Ledger, PrivateState>) { return [context.privateState, context.privateState.salt]; },
};

function simulator() {
  const contract = new Contract<PrivateState>(witnesses);
  const initial = contract.initialState(createConstructorContext(alice, '0'.repeat(64)));
  const address = sampleContractAddress();
  let context: CircuitContext<PrivateState> = createCircuitContext(
    address, initial.currentZswapLocalState, initial.currentContractState, alice,
    undefined, undefined, start,
  );
  const at = (player: PrivateState, time = start) => {
    context = createCircuitContext(address, context.currentZswapLocalState,
      context.currentQueryContext.state, player, undefined, undefined, time);
  };
  return {
    contract,
    at,
    get state() { return ledger(context.currentQueryContext.state); },
    call(player: PrivateState, circuit: (context: CircuitContext<PrivateState>) => { context: CircuitContext<PrivateState> }, time = start) {
      at(player, time);
      context = circuit(context).context;
    },
  };
}

function joinBoth(game: ReturnType<typeof simulator>) {
  game.call(alice, (context) => game.contract.impureCircuits.join(context));
  game.call(bob, (context) => game.contract.impureCircuits.join(context));
}

describe('Secret Trail challenge game', () => {
  it('keeps the mission private while two extra visits act as decoys', () => {
    const game = simulator();
    game.call(alice, (context) => game.contract.impureCircuits.join(context));
    for (const place of [3, 0, 4, 1, 2]) {
      game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, BigInt(place)));
    }
    assert.equal(game.state.moveCounts.lookup(aliceId), 5n);
    assert.equal(game.state.firstVisits.lookup(aliceId), 3n);
    assert.equal('hiddenMission' in game.state, false);
    game.call(alice, (context) => game.contract.impureCircuits.claim(context, aliceId));
    assert.equal(game.state.scores.lookup(aliceId), 1n);
    assert.equal(game.state.runStatus.lookup(aliceId), 1n);
  });

  it('burns the challenger stake when the runner proves before the deadline', () => {
    const game = simulator();
    joinBoth(game);
    game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, 0n));
    game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 1_000);
    assert.equal(game.state.challengeTokens.lookup(bobId), 2n);
    assert.equal(game.state.challengeStatus.lookup(aliceId), 1n);
    for (const place of [3, 1, 4, 2]) {
      game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, BigInt(place)), start + 5_000);
    }
    game.call(alice, (context) => game.contract.impureCircuits.claim(context, aliceId), start + 10_000);
    assert.equal(game.state.scores.lookup(aliceId), 1n);
    assert.equal(game.state.scores.lookup(bobId), 0n);
    assert.equal(game.state.challengeTokens.lookup(bobId), 2n);
    assert.equal(game.state.challengeStatus.lookup(aliceId), 2n);
    assert.throws(() => game.call(bob, (context) => game.contract.impureCircuits.resolveChallenge(context, aliceId), start + 1_200_000));
  });

  it('awards the challenger after a missed deadline and refunds the stake', () => {
    const game = simulator();
    joinBoth(game);
    game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, 3n));
    game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 1_000);
    assert.throws(() => game.call(bob, (context) => game.contract.impureCircuits.resolveChallenge(context, aliceId), start + 1_199_999), /still open/);
    game.call(bob, (context) => game.contract.impureCircuits.resolveChallenge(context, aliceId), start + 1_200_000);
    assert.equal(game.state.scores.lookup(bobId), 1n);
    assert.equal(game.state.challengeTokens.lookup(bobId), 3n);
    assert.equal(game.state.runStatus.lookup(aliceId), 2n);
    assert.equal(game.state.successfulChallenges, 1n);
  });

  it('treats an unprovable route as a loss only when the runner forfeits or times out', () => {
    const game = simulator();
    joinBoth(game);
    for (const place of [4, 3, 2, 4, 1]) {
      game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, BigInt(place)));
    }
    game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 1_000);
    assert.throws(() => game.call(alice, (context) => game.contract.impureCircuits.claim(context, aliceId), start + 2_000), /do not satisfy/);
    assert.equal(game.state.scores.lookup(bobId), 0n);
    game.call(alice, (context) => game.contract.impureCircuits.forfeit(context, aliceId), start + 3_000);
    assert.equal(game.state.scores.lookup(bobId), 1n);
    assert.equal(game.state.challengeTokens.lookup(bobId), 3n);
  });

  it('allows fresh hidden missions and replay after a settled run', () => {
    const game = simulator();
    game.call(alice, (context) => game.contract.impureCircuits.join(context));
    const oldCommitment = game.state.commitments.lookup(aliceId);
    assert.throws(() => game.call(alice, (context) => game.contract.impureCircuits.nextRound(context, aliceId)), /Finish or forfeit/);
    game.call(alice, (context) => game.contract.impureCircuits.forfeit(context, aliceId));
    const next = { ...alice, salt: new Uint8Array(32).fill(99) };
    game.call(next, (context) => game.contract.impureCircuits.nextRound(context, aliceId));
    assert.equal(game.state.rounds.lookup(aliceId), 2n);
    assert.equal(game.state.moveCounts.lookup(aliceId), 0n);
    assert.equal(game.state.runStatus.lookup(aliceId), 0n);
    assert.notDeepEqual(game.state.commitments.lookup(aliceId), oldCommitment);
  });

  it('rejects self challenges and wrong player secrets', () => {
    const game = simulator();
    joinBoth(game);
    game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, 0n));
    assert.throws(() => game.call(alice, (context) => game.contract.impureCircuits.challenge(context, aliceId, aliceId, BigInt(start))), /Cannot challenge yourself/);
    assert.throws(() => game.call(alice, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start))), /Only the challenger/);
  });

  it('blocks duplicate challenges and a claim after the proof deadline', () => {
    const game = simulator();
    joinBoth(game);
    for (const place of [3, 0, 4, 1, 2]) {
      game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, BigInt(place)));
    }
    game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 1_000);
    assert.throws(() => game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 2_000), /already has a challenge/);
    assert.throws(() => game.call(alice, (context) => game.contract.impureCircuits.claim(context, aliceId), start + 1_200_000), /deadline passed/);
    assert.equal(game.state.scores.lookup(aliceId), 0n);
  });

  it('rejects forged challenge timestamps outside the chain-time window', () => {
    const game = simulator();
    joinBoth(game);
    game.call(alice, (context) => game.contract.impureCircuits.visit(context, aliceId, 0n));
    assert.throws(() => game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start + 1)), start), /future/);
    assert.throws(() => game.call(bob, (context) => game.contract.impureCircuits.challenge(context, bobId, aliceId, BigInt(start)), start + 300_000), /too old/);
    assert.equal(game.state.challengeTokens.lookup(bobId), 3n);
  });
});
