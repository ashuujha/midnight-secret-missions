import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
  type CircuitContext,
  type WitnessContext,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger, pureCircuits, type Ledger, type Witnesses } from '../managed/secret-missions/contract/index.js';

type PrivateState = { secret: Uint8Array; mission: bigint };
const secret = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const id = pureCircuits.playerId(secret);

const witnesses: Witnesses<PrivateState> = {
  identitySecret(context: WitnessContext<Ledger, PrivateState>) { return [context.privateState, context.privateState.secret]; },
  hiddenMission(context: WitnessContext<Ledger, PrivateState>) { return [context.privateState, context.privateState.mission]; },
};

function simulator(mission = 0n) {
  const contract = new Contract<PrivateState>(witnesses);
  const initial = contract.initialState(createConstructorContext({ secret, mission }, '0'.repeat(64)));
  let context: CircuitContext<PrivateState> = createCircuitContext(
    sampleContractAddress(), initial.currentZswapLocalState,
    initial.currentContractState, initial.currentPrivateState,
  );
  return {
    contract,
    get context() { return context; },
    set context(next: CircuitContext<PrivateState>) { context = next; },
  };
}

function joinAndVisit(visits: number[], mission = 0n) {
  const game = simulator(mission);
  game.context = game.contract.impureCircuits.join(game.context).context;
  for (const visit of visits) game.context = game.contract.impureCircuits.visit(game.context, id, BigInt(visit)).context;
  return game;
}

describe('secret mission contract', () => {
  it('locks a private mission before any public move', () => {
    const game = simulator();
    game.context = game.contract.impureCircuits.join(game.context).context;
    const state = ledger(game.context.currentQueryContext.state);
    assert.equal(state.playerCount, 1n);
    assert.equal(state.moveCounts.lookup(id), 0n);
    assert.deepEqual(state.commitments.lookup(id), pureCircuits.missionCommitment(0n, secret));
    assert.equal('hiddenMission' in state, false);
    assert.throws(() => game.contract.impureCircuits.join(game.context), /Player already joined/);
  });

  it('records public visits in order and awards one point for the hidden route', () => {
    const game = joinAndVisit([0, 3, 1, 3, 2]);
    const before = ledger(game.context.currentQueryContext.state);
    assert.equal(before.moveCounts.lookup(id), 5n);
    assert.equal(before.firstVisits.lookup(id), 0n);
    assert.equal(before.fifthVisits.lookup(id), 2n);
    game.context = game.contract.impureCircuits.claim(game.context, id).context;
    const after = ledger(game.context.currentQueryContext.state);
    assert.equal(after.completedMissions, 1n);
    assert.equal(after.scores.lookup(id), 1n);
    assert.equal(after.claimed.member(id), true);
    assert.throws(() => game.contract.impureCircuits.claim(game.context, id), /Mission already claimed/);
  });

  it('rejects a public route that does not satisfy the secret assignment', () => {
    const game = joinAndVisit([0, 2, 3, 1, 3]);
    assert.throws(() => game.contract.impureCircuits.claim(game.context, id), /public visits do not satisfy/);
    assert.equal(ledger(game.context.currentQueryContext.state).completedMissions, 0n);
  });

  it('cannot swap missions after joining', () => {
    const game = joinAndVisit([0, 3, 1, 3, 2]);
    game.context.currentPrivateState.mission = 1n;
    assert.throws(() => game.contract.impureCircuits.claim(game.context, id), /Mission commitment mismatch/);
  });

  it('requires the owner secret for moves and exactly five visits before claiming', () => {
    const game = joinAndVisit([0, 1, 2]);
    assert.throws(() => game.contract.impureCircuits.claim(game.context, id), /Complete five public visits first/);
    assert.throws(() => game.contract.impureCircuits.visit(game.context, new Uint8Array(32), 3n), /Join the game first/);
    assert.throws(() => game.contract.impureCircuits.visit(game.context, id, 4n), /Unknown location/);
    game.context.currentPrivateState.secret = new Uint8Array(32);
    assert.throws(() => game.contract.impureCircuits.visit(game.context, id, 3n), /Only the player can move/);
  });

  it('assigns eight valid routes and checks ordered subsequences', () => {
    const routes = Array.from({ length: 8 }, (_, mission) => [
      pureCircuits.missionFirst(BigInt(mission)),
      pureCircuits.missionSecond(BigInt(mission)),
      pureCircuits.missionThird(BigInt(mission)),
    ]);
    assert.equal(new Set(routes.map((route) => route.join(','))).size, 8);
    assert.equal(pureCircuits.orderedThree(0n, 1n, 2n, 0n, 3n, 1n, 3n, 2n), true);
    assert.equal(pureCircuits.orderedThree(0n, 1n, 2n, 2n, 0n, 3n, 1n, 3n), false);
  });
});
