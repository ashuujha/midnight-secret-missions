import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  identitySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  handCounts(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint[]];
  handSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  nextHandSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  playedCat(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  playedSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  drawnCats(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint[]];
}

export type ImpureCircuits<PS> = {
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCard(context: __compactRuntime.CircuitContext<PS>,
           roomId_0: Uint8Array,
           claimedCat_0: bigint,
           startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleTimeout(context: __compactRuntime.CircuitContext<PS>,
                roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCard(context: __compactRuntime.CircuitContext<PS>,
           roomId_0: Uint8Array,
           claimedCat_0: bigint,
           startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleTimeout(context: __compactRuntime.CircuitContext<PS>,
                roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  playerId(secret_0: Uint8Array): Uint8Array;
  seatKey(room_0: Uint8Array, seat_0: bigint): Uint8Array;
  handCommitment(counts_0: bigint[], salt_0: Uint8Array): Uint8Array;
  cardCommitment(cat_0: bigint, salt_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  playerId(context: __compactRuntime.CircuitContext<PS>, secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  seatKey(context: __compactRuntime.CircuitContext<PS>,
          room_0: Uint8Array,
          seat_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  handCommitment(context: __compactRuntime.CircuitContext<PS>,
                 counts_0: bigint[],
                 salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  cardCommitment(context: __compactRuntime.CircuitContext<PS>,
                 cat_0: bigint,
                 salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCard(context: __compactRuntime.CircuitContext<PS>,
           roomId_0: Uint8Array,
           claimedCat_0: bigint,
           startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            startedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleTimeout(context: __compactRuntime.CircuitContext<PS>,
                roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly schemaVersion: bigint;
  roomSizes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  roomHosts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  seats: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  playerRooms: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  hands: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  handSizes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  penaltyDraws: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  roomStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  turns: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  phases: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  responders: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  passes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  playNumbers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  claims: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  cards: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  challengers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  deadlines: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  winners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  outcomes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  lastActors: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  lastLosers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
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
