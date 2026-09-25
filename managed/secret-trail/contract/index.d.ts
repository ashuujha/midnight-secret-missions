import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  identitySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  hiddenMission(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  missionSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  challenge(context: __compactRuntime.CircuitContext<PS>,
            challengerId_0: Uint8Array,
            targetId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  join(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  visit(context: __compactRuntime.CircuitContext<PS>,
        id_0: Uint8Array,
        location_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveChallenge(context: __compactRuntime.CircuitContext<PS>,
                   targetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  forfeit(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  nextRound(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  challenge(context: __compactRuntime.CircuitContext<PS>,
            challengerId_0: Uint8Array,
            targetId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  join(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  visit(context: __compactRuntime.CircuitContext<PS>,
        id_0: Uint8Array,
        location_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveChallenge(context: __compactRuntime.CircuitContext<PS>,
                   targetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  forfeit(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  nextRound(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  playerId(secret_0: Uint8Array): Uint8Array;
  missionCommitment(mission_0: bigint, salt_0: Uint8Array): Uint8Array;
  missionFirst(mission_0: bigint): bigint;
  missionSecond(mission_0: bigint): bigint;
  missionThird(mission_0: bigint): bigint;
  orderedThree(a_0: bigint,
               b_0: bigint,
               c_0: bigint,
               one_0: bigint,
               two_0: bigint,
               three_0: bigint,
               four_0: bigint,
               five_0: bigint): boolean;
}

export type Circuits<PS> = {
  playerId(context: __compactRuntime.CircuitContext<PS>, secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  missionCommitment(context: __compactRuntime.CircuitContext<PS>,
                    mission_0: bigint,
                    salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  missionFirst(context: __compactRuntime.CircuitContext<PS>, mission_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  missionSecond(context: __compactRuntime.CircuitContext<PS>, mission_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  missionThird(context: __compactRuntime.CircuitContext<PS>, mission_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  orderedThree(context: __compactRuntime.CircuitContext<PS>,
               a_0: bigint,
               b_0: bigint,
               c_0: bigint,
               one_0: bigint,
               two_0: bigint,
               three_0: bigint,
               four_0: bigint,
               five_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  challenge(context: __compactRuntime.CircuitContext<PS>,
            challengerId_0: Uint8Array,
            targetId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  join(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  visit(context: __compactRuntime.CircuitContext<PS>,
        id_0: Uint8Array,
        location_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveChallenge(context: __compactRuntime.CircuitContext<PS>,
                   targetId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  forfeit(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  nextRound(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  rounds: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  runStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  moveCounts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  firstVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  secondVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  thirdVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  fourthVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  fifthVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  scores: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  challengeTokens: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  challengeStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  challengeBy: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  challengeDeadlines: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly playerCount: bigint;
  readonly completedMissions: bigint;
  readonly successfulChallenges: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
