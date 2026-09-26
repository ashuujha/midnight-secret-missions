import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type CipherCard = { a: __compactRuntime.JubjubPoint;
                           b: __compactRuntime.JubjubPoint
                         };

export type Room = { size: bigint;
                     round: bigint;
                     status: bigint;
                     step: bigint;
                     turn: bigint;
                     rank: bigint;
                     phase: bigint;
                     responder: bigint;
                     passes: bigint;
                     play: bigint;
                     actor: bigint;
                     challenger: bigint;
                     pile: bigint;
                     winner: bigint;
                     outcome: bigint;
                     loser: bigint
                   };

export type TurnRecord = { actor: bigint;
                           rank: bigint;
                           quantity: bigint;
                           pileSize: bigint;
                           passes: bigint;
                           challenger: bigint;
                           outcome: bigint;
                           receiver: bigint;
                           revealed: bigint[]
                         };

export type Witnesses<PS> = {
  identitySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  encryptionSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  permutation(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint[]];
  blindingFactors(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint[]];
  openedCards(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint[]];
}

export type ImpureCircuits<PS> = {
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startRound(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shuffleDeck(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shareDeal(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCards(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            selected_0: boolean[]): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealTurn(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferPile(context: __compactRuntime.CircuitContext<PS>,
               roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startRound(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shuffleDeck(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shareDeal(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCards(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            selected_0: boolean[]): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealTurn(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferPile(context: __compactRuntime.CircuitContext<PS>,
               roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  indices(): bigint[];
  playerId(secret_0: Uint8Array): Uint8Array;
  turnKey(room_0: Uint8Array, round_0: bigint, play_0: bigint): Uint8Array;
  negate(p_0: __compactRuntime.JubjubPoint): __compactRuntime.JubjubPoint;
  publicKey(secret_0: bigint): __compactRuntime.JubjubPoint;
  cardPoints(): __compactRuntime.JubjubPoint[];
  cardPoint(card_0: bigint): __compactRuntime.JubjubPoint;
  decryptCard(card_0: CipherCard, key_0: bigint): __compactRuntime.JubjubPoint;
}

export type Circuits<PS> = {
  indices(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint[]>;
  playerId(context: __compactRuntime.CircuitContext<PS>, secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  turnKey(context: __compactRuntime.CircuitContext<PS>,
          room_0: Uint8Array,
          round_0: bigint,
          play_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  negate(context: __compactRuntime.CircuitContext<PS>,
         p_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, __compactRuntime.JubjubPoint>;
  publicKey(context: __compactRuntime.CircuitContext<PS>, secret_0: bigint): __compactRuntime.CircuitResults<PS, __compactRuntime.JubjubPoint>;
  cardPoints(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, __compactRuntime.JubjubPoint[]>;
  cardPoint(context: __compactRuntime.CircuitContext<PS>, card_0: bigint): __compactRuntime.CircuitResults<PS, __compactRuntime.JubjubPoint>;
  decryptCard(context: __compactRuntime.CircuitContext<PS>,
              card_0: CipherCard,
              key_0: bigint): __compactRuntime.CircuitResults<PS, __compactRuntime.JubjubPoint>;
  createRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  joinRoom(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startRound(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shuffleDeck(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  shareDeal(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  playCards(context: __compactRuntime.CircuitContext<PS>,
            roomId_0: Uint8Array,
            selected_0: boolean[]): __compactRuntime.CircuitResults<PS, []>;
  passClaim(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  callBluff(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealTurn(context: __compactRuntime.CircuitContext<PS>, roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferPile(context: __compactRuntime.CircuitContext<PS>,
               roomId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly schemaVersion: bigint;
  rooms: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Room;
    [Symbol.iterator](): Iterator<[Uint8Array, Room]>
  };
  players: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array[];
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array[]]>
  };
  playerKeys: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): __compactRuntime.JubjubPoint[];
    [Symbol.iterator](): Iterator<[Uint8Array, __compactRuntime.JubjubPoint[]]>
  };
  decks: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): CipherCard[];
    [Symbol.iterator](): Iterator<[Uint8Array, CipherCard[]]>
  };
  owners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint[];
    [Symbol.iterator](): Iterator<[Uint8Array, bigint[]]>
  };
  custodians: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint[];
    [Symbol.iterator](): Iterator<[Uint8Array, bigint[]]>
  };
  lastSelections: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean[];
    [Symbol.iterator](): Iterator<[Uint8Array, boolean[]]>
  };
  turns: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): TurnRecord;
    [Symbol.iterator](): Iterator<[Uint8Array, TurnRecord]>
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
