import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeVector(52, _descriptor_1);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

class _Room_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))))))))))))));
  }
  fromValue(value_0) {
    return {
      size: _descriptor_1.fromValue(value_0),
      round: _descriptor_3.fromValue(value_0),
      status: _descriptor_1.fromValue(value_0),
      step: _descriptor_1.fromValue(value_0),
      turn: _descriptor_1.fromValue(value_0),
      rank: _descriptor_1.fromValue(value_0),
      phase: _descriptor_1.fromValue(value_0),
      responder: _descriptor_1.fromValue(value_0),
      passes: _descriptor_1.fromValue(value_0),
      play: _descriptor_3.fromValue(value_0),
      actor: _descriptor_1.fromValue(value_0),
      challenger: _descriptor_1.fromValue(value_0),
      pile: _descriptor_1.fromValue(value_0),
      winner: _descriptor_1.fromValue(value_0),
      outcome: _descriptor_1.fromValue(value_0),
      loser: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.size).concat(_descriptor_3.toValue(value_0.round).concat(_descriptor_1.toValue(value_0.status).concat(_descriptor_1.toValue(value_0.step).concat(_descriptor_1.toValue(value_0.turn).concat(_descriptor_1.toValue(value_0.rank).concat(_descriptor_1.toValue(value_0.phase).concat(_descriptor_1.toValue(value_0.responder).concat(_descriptor_1.toValue(value_0.passes).concat(_descriptor_3.toValue(value_0.play).concat(_descriptor_1.toValue(value_0.actor).concat(_descriptor_1.toValue(value_0.challenger).concat(_descriptor_1.toValue(value_0.pile).concat(_descriptor_1.toValue(value_0.winner).concat(_descriptor_1.toValue(value_0.outcome).concat(_descriptor_1.toValue(value_0.loser))))))))))))))));
  }
}

const _descriptor_4 = new _Room_0();

const _descriptor_5 = __compactRuntime.CompactTypeJubjubPoint;

class _CipherCard_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_5.alignment());
  }
  fromValue(value_0) {
    return {
      a: _descriptor_5.fromValue(value_0),
      b: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.a).concat(_descriptor_5.toValue(value_0.b));
  }
}

const _descriptor_6 = new _CipherCard_0();

const _descriptor_7 = new __compactRuntime.CompactTypeVector(52, _descriptor_6);

const _descriptor_8 = new __compactRuntime.CompactTypeVector(4, _descriptor_5);

class _TurnRecord_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment()))))))));
  }
  fromValue(value_0) {
    return {
      actor: _descriptor_1.fromValue(value_0),
      rank: _descriptor_1.fromValue(value_0),
      quantity: _descriptor_1.fromValue(value_0),
      pileSize: _descriptor_1.fromValue(value_0),
      passes: _descriptor_1.fromValue(value_0),
      challenger: _descriptor_1.fromValue(value_0),
      outcome: _descriptor_1.fromValue(value_0),
      receiver: _descriptor_1.fromValue(value_0),
      revealed: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.actor).concat(_descriptor_1.toValue(value_0.rank).concat(_descriptor_1.toValue(value_0.quantity).concat(_descriptor_1.toValue(value_0.pileSize).concat(_descriptor_1.toValue(value_0.passes).concat(_descriptor_1.toValue(value_0.challenger).concat(_descriptor_1.toValue(value_0.outcome).concat(_descriptor_1.toValue(value_0.receiver).concat(_descriptor_2.toValue(value_0.revealed)))))))));
  }
}

const _descriptor_9 = new _TurnRecord_0();

const _descriptor_10 = __compactRuntime.CompactTypeBoolean;

const _descriptor_11 = new __compactRuntime.CompactTypeVector(52, _descriptor_10);

const _descriptor_12 = new __compactRuntime.CompactTypeVector(4, _descriptor_0);

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(452312848583266388373324160190187140051835877600158453279131187530910662655n, 31);

const _descriptor_14 = new __compactRuntime.CompactTypeVector(52, _descriptor_5);

const _descriptor_15 = new __compactRuntime.CompactTypeVector(52, _descriptor_13);

const _descriptor_16 = __compactRuntime.CompactTypeField;

class _HistoryKey_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment()));
  }
  fromValue(value_0) {
    return {
      room: _descriptor_0.fromValue(value_0),
      round: _descriptor_3.fromValue(value_0),
      play: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.room).concat(_descriptor_3.toValue(value_0.round).concat(_descriptor_3.toValue(value_0.play)));
  }
}

const _descriptor_17 = new _HistoryKey_0();

const _descriptor_18 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Either_0 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_10.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_19 = new _Either_0();

const _descriptor_20 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_21 = new _ContractAddress_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.identitySecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named identitySecret');
    }
    if (typeof(witnesses_0.encryptionSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named encryptionSecret');
    }
    if (typeof(witnesses_0.permutation) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named permutation');
    }
    if (typeof(witnesses_0.blindingFactors) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named blindingFactors');
    }
    if (typeof(witnesses_0.openedCards) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named openedCards');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      indices(context, ...args_1) {
        return { result: pureCircuits.indices(...args_1), context };
      },
      playerId(context, ...args_1) {
        return { result: pureCircuits.playerId(...args_1), context };
      },
      turnKey(context, ...args_1) {
        return { result: pureCircuits.turnKey(...args_1), context };
      },
      negate(context, ...args_1) {
        return { result: pureCircuits.negate(...args_1), context };
      },
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      },
      cardPoints(context, ...args_1) {
        return { result: pureCircuits.cardPoints(...args_1), context };
      },
      cardPoint(context, ...args_1) {
        return { result: pureCircuits.cardPoint(...args_1), context };
      },
      decryptCard(context, ...args_1) {
        return { result: pureCircuits.decryptCard(...args_1), context };
      },
      createRoom: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`createRoom: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createRoom',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 142 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('createRoom',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 142 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createRoom_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      joinRoom: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`joinRoom: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('joinRoom',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 151 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('joinRoom',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 151 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._joinRoom_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      startRound: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`startRound: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('startRound',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 163 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('startRound',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 163 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._startRound_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      shuffleDeck: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`shuffleDeck: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('shuffleDeck',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 175 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('shuffleDeck',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 175 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._shuffleDeck_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      shareDeal: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`shareDeal: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('shareDeal',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 191 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('shareDeal',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 191 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._shareDeal_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      playCards: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`playCards: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        const selected_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('playCards',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 199 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('playCards',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 199 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        if (!(Array.isArray(selected_0) && selected_0.length === 52 && selected_0.every((t) => typeof(t) === 'boolean'))) {
          __compactRuntime.typeError('playCards',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'cat-bluff52.compact line 199 char 1',
                                     'Vector<52, Boolean>',
                                     selected_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0).concat(_descriptor_11.toValue(selected_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_11.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._playCards_0(context,
                                           partialProofData,
                                           roomId_0,
                                           selected_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      passClaim: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`passClaim: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('passClaim',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 216 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('passClaim',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 216 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._passClaim_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      callBluff: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`callBluff: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('callBluff',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 225 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('callBluff',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 225 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._callBluff_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revealTurn: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`revealTurn: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revealTurn',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 232 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('revealTurn',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 232 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revealTurn_0(context, partialProofData, roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      transferPile: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`transferPile: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('transferPile',
                                     'argument 1 (as invoked from Typescript)',
                                     'cat-bluff52.compact line 256 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(roomId_0.buffer instanceof ArrayBuffer && roomId_0.BYTES_PER_ELEMENT === 1 && roomId_0.length === 32)) {
          __compactRuntime.typeError('transferPile',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'cat-bluff52.compact line 256 char 1',
                                     'Bytes<32>',
                                     roomId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(roomId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._transferPile_0(context,
                                              partialProofData,
                                              roomId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createRoom: this.circuits.createRoom,
      joinRoom: this.circuits.joinRoom,
      startRound: this.circuits.startRound,
      shuffleDeck: this.circuits.shuffleDeck,
      shareDeal: this.circuits.shareDeal,
      playCards: this.circuits.playCards,
      passClaim: this.circuits.passClaim,
      callBluff: this.circuits.callBluff,
      revealTurn: this.circuits.revealTurn,
      transferPile: this.circuits.transferPile
    };
    this.provableCircuits = {
      createRoom: this.circuits.createRoom,
      joinRoom: this.circuits.joinRoom,
      startRound: this.circuits.startRound,
      shuffleDeck: this.circuits.shuffleDeck,
      shareDeal: this.circuits.shareDeal,
      playCards: this.circuits.playCards,
      passClaim: this.circuits.passClaim,
      callBluff: this.circuits.callBluff,
      revealTurn: this.circuits.revealTurn,
      transferPile: this.circuits.transferPile
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createRoom', new __compactRuntime.ContractOperation());
    state_0.setOperation('joinRoom', new __compactRuntime.ContractOperation());
    state_0.setOperation('startRound', new __compactRuntime.ContractOperation());
    state_0.setOperation('shuffleDeck', new __compactRuntime.ContractOperation());
    state_0.setOperation('shareDeal', new __compactRuntime.ContractOperation());
    state_0.setOperation('playCards', new __compactRuntime.ContractOperation());
    state_0.setOperation('passClaim', new __compactRuntime.ContractOperation());
    state_0.setOperation('callBluff', new __compactRuntime.ContractOperation());
    state_0.setOperation('revealTurn', new __compactRuntime.ContractOperation());
    state_0.setOperation('transferPile', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(1n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(2n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(3n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(4n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(5n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(6n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(7n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(8n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = 4n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_0, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_17, value_0);
    return result_0;
  }
  _jubjubPointX_0(np_0) {
    const result_0 = __compactRuntime.jubjubPointX(np_0);
    return result_0;
  }
  _jubjubPointY_0(np_0) {
    const result_0 = __compactRuntime.jubjubPointY(np_0);
    return result_0;
  }
  _ecAdd_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecAdd(a_0, b_0);
    return result_0;
  }
  _ecMul_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecMul(a_0, b_0);
    return result_0;
  }
  _ecMulGenerator_0(b_0) {
    const result_0 = __compactRuntime.ecMulGenerator(b_0);
    return result_0;
  }
  _constructJubjubPoint_0(x_0, y_0) {
    const result_0 = __compactRuntime.constructJubjubPoint(x_0, y_0);
    return result_0;
  }
  _identitySecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.identitySecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('identitySecret',
                                 'return value',
                                 'cat-bluff52.compact line 5 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _encryptionSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.encryptionSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 452312848583266388373324160190187140051835877600158453279131187530910662655n)) {
      __compactRuntime.typeError('encryptionSecret',
                                 'return value',
                                 'cat-bluff52.compact line 6 char 1',
                                 'Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_13.toValue(result_0),
      alignment: _descriptor_13.alignment()
    });
    return result_0;
  }
  _permutation_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.permutation(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 52 && result_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('permutation',
                                 'return value',
                                 'cat-bluff52.compact line 7 char 1',
                                 'Vector<52, Uint<0..256>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result_0),
      alignment: _descriptor_2.alignment()
    });
    return result_0;
  }
  _blindingFactors_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.blindingFactors(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 52 && result_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 452312848583266388373324160190187140051835877600158453279131187530910662655n))) {
      __compactRuntime.typeError('blindingFactors',
                                 'return value',
                                 'cat-bluff52.compact line 8 char 1',
                                 'Vector<52, Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_15.toValue(result_0),
      alignment: _descriptor_15.alignment()
    });
    return result_0;
  }
  _openedCards_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.openedCards(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 52 && result_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('openedCards',
                                 'return value',
                                 'cat-bluff52.compact line 9 char 1',
                                 'Vector<52, Uint<0..256>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result_0),
      alignment: _descriptor_2.alignment()
    });
    return result_0;
  }
  _indices_0() {
    return [0n,
            1n,
            2n,
            3n,
            4n,
            5n,
            6n,
            7n,
            8n,
            9n,
            10n,
            11n,
            12n,
            13n,
            14n,
            15n,
            16n,
            17n,
            18n,
            19n,
            20n,
            21n,
            22n,
            23n,
            24n,
            25n,
            26n,
            27n,
            28n,
            29n,
            30n,
            31n,
            32n,
            33n,
            34n,
            35n,
            36n,
            37n,
            38n,
            39n,
            40n,
            41n,
            42n,
            43n,
            44n,
            45n,
            46n,
            47n,
            48n,
            49n,
            50n,
            51n];
  }
  _playerId_0(secret_0) { return this._persistentHash_0(secret_0); }
  _turnKey_0(room_0, round_0, play_0) {
    return this._persistentHash_1({ room: room_0, round: round_0, play: play_0 });
  }
  _negate_0(p_0) {
    return this._constructJubjubPoint_0(__compactRuntime.subField(0n,
                                                                  this._jubjubPointX_0(p_0)),
                                        this._jubjubPointY_0(p_0));
  }
  _publicKey_0(secret_0) {
    __compactRuntime.assert(secret_0 > 0n, 'Invalid private key');
    return this._ecMulGenerator_0(secret_0);
  }
  _cardPoints_0() {
    return [this._constructJubjubPoint_0(28336281903124990867587793011069573392383982287722241916350956173377953689573n,
                                         39385640392217313770878525135509063452020585410343666726093009378539878503883n),
            this._constructJubjubPoint_0(28470720865600895264575250048565445848783776096727055802752773414594395577565n,
                                         22436823168302830732060329876357833227584559018655015131868680653136578255473n),
            this._constructJubjubPoint_0(8976934280167817951893283006885971257354735267084857365287645009060806900685n,
                                         32390198301931076333580527807646215534390721674374179703346145430428257692101n),
            this._constructJubjubPoint_0(52314913592789878805517974153014629220250507019089108027564561641173449264214n,
                                         316401541904675051751671509748590036265704531513998184420066319217098126774n),
            this._constructJubjubPoint_0(46037580203438066765405229507649644425780970512522822336637661968249826130047n,
                                         26189429486186784039799689203850934078756791903368248146476421754146336352630n),
            this._constructJubjubPoint_0(19776671323258295437958098013654610197824075866629837433327130215719837584235n,
                                         5535585428160846147918766193546489324802840380885544621462259231927486889442n),
            this._constructJubjubPoint_0(47805549206756120863994733988949966563868680443409072344285414365387721651928n,
                                         10883866336127360287053583923937114185802477515052223349661086820822299756070n),
            this._constructJubjubPoint_0(41781039653558041424378087441097781830366075995084681920492076253857675647465n,
                                         4831175673904690165972121461665559889565427034601926888148043923603184925457n),
            this._constructJubjubPoint_0(34875195557165416953091062997199587865723417956572166289027772255080145669259n,
                                         34349553858782601193538818117516589241662365685547285594873772510622512095186n),
            this._constructJubjubPoint_0(9268573229882039720362844093884107124324841417959156722978047581958399937228n,
                                         30853052262980575868266806598366666544178916484903249803426287129999509786368n),
            this._constructJubjubPoint_0(16827724475775646817464036582159000260353701469526893325788649359360731655092n,
                                         44031289517654383275236023968950953006749154478578562892906183459209162884018n),
            this._constructJubjubPoint_0(46068636960963143760223981504708605029421773552962475259064201631901010556558n,
                                         30406190583724009587997261936008990343542078733235621514562696436658796479222n),
            this._constructJubjubPoint_0(23070401747513437877291923283632658528562096145511423991139305139681046329094n,
                                         4618804908354153307723645468004365607556001212646932439019416955377127509460n),
            this._constructJubjubPoint_0(3959067734242116170181166118984837837658260348828162830089480705115677919361n,
                                         23035617762364956757598580296976616296388658400327200605929895603474643434504n),
            this._constructJubjubPoint_0(34133914351292434048413503276202728289265490189576620060413629725504410538523n,
                                         14331798736465991320125906355460685144102305233516748184833801044822620467723n),
            this._constructJubjubPoint_0(10630089522522170653997535304225347033207486684812880742591706861938208868896n,
                                         39870533612335173283077446045255605482686196202257700744224522251980122091149n),
            this._constructJubjubPoint_0(15001502957582222671368688071077535966154891112407496054411821073695459975426n,
                                         19097549670265287402085689751051099877064434235589543463647028264634623812614n),
            this._constructJubjubPoint_0(15341991410457177072215128206481231124706248979299446252633345300303638746550n,
                                         24331498243728247646341491706563324840799318614811812930233476776122922823738n),
            this._constructJubjubPoint_0(15888849353200563491049832910011416317316770021141110413847420265924579726117n,
                                         1323614397456051737924690101425211565486845668896292528439922343630657116864n),
            this._constructJubjubPoint_0(39045351550167949501353705680883459652457822106118276422709403232252509224414n,
                                         48067854682875041992087911546112071385903715747799135175928921131320908962429n),
            this._constructJubjubPoint_0(38403215725225426738913791021951866802258231439823168763007835009237884890752n,
                                         526149742100574637941597732862670399218386507425945566443487654766685603906n),
            this._constructJubjubPoint_0(10505490578163423951378947281762924205220060736345208929031737203714010267558n,
                                         17260531706389435318599181855217702947038548920615356428831222589442467700313n),
            this._constructJubjubPoint_0(36284898170648458424251189254592171376292437116872526736921993130803329024254n,
                                         11940321602654584262950800843104521268715763534030434482269715217025964911081n),
            this._constructJubjubPoint_0(48113320688008755002789823642074788959857891266362867908670501920970348117839n,
                                         49153125927217184320254070441423325938678623035514048579376656917034142251808n),
            this._constructJubjubPoint_0(46342345144974177224618427821761335793178130296434893058002041402802539459646n,
                                         19179058230029852144251557279599418792265247948450700215654953929755511737663n),
            this._constructJubjubPoint_0(5525601552697273628264560128381307159519990938963284307355995727244219225773n,
                                         10924134527028743477883421700479536033623818720067762837379741660111627198005n),
            this._constructJubjubPoint_0(44950199207539667081971096342410667650360183931830171867668509314994002070170n,
                                         48773311031271584246734990953938480506421441864710411379430861243063696318902n),
            this._constructJubjubPoint_0(27535973609497151927053031508669452896061803779475712995124483283043868381250n,
                                         48642338424940630121378621051401400787733875043957913936353602562787636308241n),
            this._constructJubjubPoint_0(12901095396347343414530909396941568530535935478075123893126725042083332911126n,
                                         44206942698410422599664373009331971622938986632882265428972926117836259237022n),
            this._constructJubjubPoint_0(42894463734547648627079143906103106728075029772856998326760993875505885911830n,
                                         40018660068022193106389915776479608173048600592930264975113427238048619618539n),
            this._constructJubjubPoint_0(6828635068809392876811473048649049519671970720941999054538275895483397382595n,
                                         6962419086473812262191051721355896797190154089935603872432130785161336849261n),
            this._constructJubjubPoint_0(36373528899451447414568081516641936100727839895590622699895983268652992966771n,
                                         34862296868563132176708139402078093199118359819880349462319345107484010586141n),
            this._constructJubjubPoint_0(49865686439925854605824967628236838326995342850958068458906458235066822509448n,
                                         48008795495012788362530488218709871500473260543293431641821231191439733816475n),
            this._constructJubjubPoint_0(47498879511606986273251237971920935053773485557180253088766607463285850835903n,
                                         1003864988888884924916002987904504484920967111826459977347841384888939045194n),
            this._constructJubjubPoint_0(872836075084955880486598304396657556245762707832025999270200387824402070029n,
                                         4436246243718240389403462016242074109499337267123680560627100118758671976766n),
            this._constructJubjubPoint_0(7236995507304664989850743725547329798876934529624967608480747213035983726330n,
                                         14232314645745188942105631071925338348482130689537461129210028733053798940110n),
            this._constructJubjubPoint_0(30129857766014689738366475759188874857488331293533834696677820302777131514708n,
                                         34892760791535565718082727313633615407032741867123440073663238049262310881337n),
            this._constructJubjubPoint_0(9158733651339389024291674673549352541715751293505883309498170396946344520333n,
                                         19099970624449323707937659092927475213087387347040588867054181502702665546531n),
            this._constructJubjubPoint_0(13717668187347534416687430153922465278245869021891539196592139696946653986732n,
                                         6428962411083644968092981923987101420726583893344339524676194419204288710045n),
            this._constructJubjubPoint_0(1754246758531630713886785018784472392398756966602420022099449385232665674827n,
                                         28758625512275458310872858910426736734841344437461633941562930055893638351535n),
            this._constructJubjubPoint_0(24125547739664456851753265236250009735047788069848166790040620710476766088342n,
                                         2085528573940097180972666470225810005304800597158436829559123745562681559713n),
            this._constructJubjubPoint_0(20138912577686945720712312428997446658384192143634713548967347449818397055999n,
                                         42359946605512121410619127322408983803291464801315112535234890074809772527139n),
            this._constructJubjubPoint_0(24363420363626089437033229670281932626476105236418170060013171239650713959290n,
                                         11342359962586470042199130008971974608756598813489099484896938345059188868941n),
            this._constructJubjubPoint_0(16658099928726603210107836986754406554791815598822972351116582553180495296567n,
                                         2650100224915923652754582430294793851641590313377256592655958743408916627237n),
            this._constructJubjubPoint_0(26481812234783859085376261045286387687301617561253585272568023743798645177192n,
                                         49868535207718475390130505128195473509065553641851775602444667842507379230791n),
            this._constructJubjubPoint_0(23789749351842967066522015960321667646787465039002662230238805304654250555296n,
                                         21067438240814127762390790861121179907277114792230983853564422529004737722043n),
            this._constructJubjubPoint_0(8654092339971037962081975744682538295803888317749149883987485265662027144040n,
                                         41972728862807071772979889646695627921707531245522073557224437637378274849761n),
            this._constructJubjubPoint_0(37634753127691560062553982902434196646266540432669708952975994286529136756954n,
                                         6418025902559148619674967984243516501769196504383194479354398171512113224179n),
            this._constructJubjubPoint_0(35203245428436667624077740701128079591831857222779192262608993720230385363579n,
                                         3034703999878201404289736185477878633122270606771580469484345732898823623809n),
            this._constructJubjubPoint_0(9547134830740423447903527456967344202043193118658858325166382571605496435846n,
                                         9429594572974407783167071741221612207158939844710001143170909885524225802250n),
            this._constructJubjubPoint_0(848513306722586856097331487698794221804468490520028009420892412102286229457n,
                                         8790061229408210667008353457291989960080292605664444398612377865858592647023n),
            this._constructJubjubPoint_0(35383403383443753536516158861667527790828952844378597086626204295186782700110n,
                                         12893565474264017725996791006428756066955382854422431930220136186629314806206n)];
  }
  _cardPoint_0(card_0) {
    __compactRuntime.assert(card_0 < 52n, 'Unknown physical card');
    const points_0 = this._cardPoints_0();
    return this._folder_0(((found_0, point_0, i_0) =>
                           {
                             if (this._equal_0(i_0, card_0)) {
                               return point_0;
                             } else {
                               return found_0;
                             }
                           }),
                          points_0[0],
                          points_0,
                          this._indices_0());
  }
  _decryptCard_0(card_0, key_0) {
    return this._ecAdd_0(card_0.b,
                         this._negate_0(this._ecMul_0(card_0.a, key_0)));
  }
  _cardRank_0(card_0) {
    return card_0 < 4n ?
           0n :
           card_0 < 8n ?
           1n :
           card_0 < 12n ?
           2n :
           card_0 < 16n ?
           3n :
           card_0 < 20n ?
           4n :
           card_0 < 24n ?
           5n :
           card_0 < 28n ?
           6n :
           card_0 < 32n ?
           7n :
           card_0 < 36n ?
           8n :
           card_0 < 40n ? 9n : card_0 < 44n ? 10n : card_0 < 48n ? 11n : 12n;
  }
  _dealOwners_0(size_0) {
    const d2_0 = [0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n,
                  0n,
                  1n];
    const d3_0 = [0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n,
                  1n,
                  2n,
                  0n];
    const d4_0 = [0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n,
                  0n,
                  1n,
                  2n,
                  3n];
    if (this._equal_1(size_0, 2n)) {
      return d2_0;
    } else {
      if (this._equal_2(size_0, 3n)) { return d3_0; } else { return d4_0; }
    }
  }
  _nextSeat_0(seat_0, size_0) {
    let t_0;
    if (t_0 = seat_0 + 1n, t_0 >= size_0) {
      return 0n;
    } else {
      return ((t1) => {
               if (t1 > 255n) {
                 throw new __compactRuntime.CompactError('cat-bluff52.compact line 124 char 94: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
               }
               return t1;
             })(seat_0 + 1n);
    }
  }
  _countMask_0(mask_0) {
    return this._folder_1(((n_0, yes_0) =>
                           {
                             return ((t1) => {
                                      if (t1 > 255n) {
                                        throw new __compactRuntime.CompactError('cat-bluff52.compact line 125 char 113: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                                      }
                                      return t1;
                                    })(n_0 + (yes_0 ? 1n : 0n));
                           }),
                          0n,
                          mask_0);
  }
  _chooseKey_0(keys_0, seat_0) {
    return this._folder_2(((p_0, key_0, i_0) =>
                           {
                             if (this._equal_3(i_0, seat_0)) {
                               return key_0;
                             } else {
                               return p_0;
                             }
                           }),
                          this._ecMulGenerator_0(0n),
                          keys_0,
                          [0n, 1n, 2n, 3n]);
  }
  _chooseCard_0(cards_0, at_0) {
    return this._folder_3(((p_0, card_0, i_0) =>
                           {
                             if (this._equal_4(i_0, at_0)) {
                               return card_0;
                             } else {
                               return p_0;
                             }
                           }),
                          cards_0[0],
                          cards_0,
                          this._indices_0());
  }
  _authenticate_0(context, partialProofData, room_0) {
    __compactRuntime.assert(_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(1n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Table not found');
    const id_0 = this._playerId_0(this._identitySecret_0(context,
                                                         partialProofData));
    const seat_0 = this._folder_4(context,
                                  partialProofData,
                                  ((context, partialProofData, found_0, p_0, i_0) =>
                                   {
                                     if (this._equal_5(p_0, id_0)) {
                                       return i_0;
                                     } else {
                                       return found_0;
                                     }
                                   }),
                                  4n,
                                  _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_1.toValue(2n),
                                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_0.toValue(room_0),
                                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                                  [0n, 1n, 2n, 3n]);
    __compactRuntime.assert(seat_0
                            <
                            _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(1n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_0.toValue(room_0),
                                                                                                                  alignment: _descriptor_0.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value).size,
                            'Join this table first');
    return seat_0;
  }
  _checkedKey_0(context, partialProofData, room_0, seat_0) {
    const key_0 = this._encryptionSecret_0(context, partialProofData);
    __compactRuntime.assert(this._equal_6(this._publicKey_0(key_0),
                                          this._chooseKey_0(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                      partialProofData,
                                                                                                                      [
                                                                                                                       { dup: { n: 0 } },
                                                                                                                       { idx: { cached: false,
                                                                                                                                pushPath: false,
                                                                                                                                path: [
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_1.toValue(3n),
                                                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                                                       { idx: { cached: false,
                                                                                                                                pushPath: false,
                                                                                                                                path: [
                                                                                                                                       { tag: 'value',
                                                                                                                                         value: { value: _descriptor_0.toValue(room_0),
                                                                                                                                                  alignment: _descriptor_0.alignment() } }] } },
                                                                                                                       { popeq: { cached: false,
                                                                                                                                  result: undefined } }]).value),
                                                            seat_0)),
                            'Wrong private decryption key');
    return key_0;
  }
  _createRoom_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    __compactRuntime.assert(!_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(1n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                            'Table already exists');
    const id_0 = this._playerId_0(this._identitySecret_0(context,
                                                         partialProofData));
    const key_0 = this._publicKey_0(this._encryptionSecret_0(context,
                                                             partialProofData));
    const tmp_0 = { size: 1n,
                    round: 0n,
                    status: 0n,
                    step: 0n,
                    turn: 0n,
                    rank: 0n,
                    phase: 0n,
                    responder: 1n,
                    passes: 0n,
                    play: 0n,
                    actor: 0n,
                    challenger: 255n,
                    pile: 0n,
                    winner: 255n,
                    outcome: 0n,
                    loser: 255n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = [id_0,
                   new Uint8Array(32),
                   new Uint8Array(32),
                   new Uint8Array(32)];
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_1),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = [key_0,
                   this._ecMulGenerator_0(0n),
                   this._ecMulGenerator_0(0n),
                   this._ecMulGenerator_0(0n)];
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(3n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_2),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _joinRoom_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    __compactRuntime.assert(_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(1n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Table not found');
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_7(t_0.status, 0n),
                            'This round has already started');
    let t_1;
    __compactRuntime.assert((t_1 = t_0.size, t_1 < 4n), 'Table is full');
    const id_0 = this._playerId_0(this._identitySecret_0(context,
                                                         partialProofData));
    const key_0 = this._publicKey_0(this._encryptionSecret_0(context,
                                                             partialProofData));
    const old_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_1.toValue(2n),
                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(room_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
    const keys_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_1.toValue(3n),
                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(room_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
    this._folder_5(context,
                   partialProofData,
                   ((context, partialProofData, t_2, p_0) =>
                    {
                      __compactRuntime.assert(!this._equal_8(p_0, id_0),
                                              'Already seated at this table');
                      return t_2;
                    }),
                   [],
                   old_0);
    const tmp_0 = this._mapper_0(context,
                                 partialProofData,
                                 ((context, partialProofData, p_1, i_0) =>
                                  {
                                    if (this._equal_9(i_0, t_0.size)) {
                                      return id_0;
                                    } else {
                                      return p_1;
                                    }
                                  }),
                                 old_0,
                                 [0n, 1n, 2n, 3n]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this._mapper_1(context,
                                 partialProofData,
                                 ((context, partialProofData, p_2, i_1) =>
                                  {
                                    if (this._equal_10(i_1, t_0.size)) {
                                      return key_0;
                                    } else {
                                      return p_2;
                                    }
                                  }),
                                 keys_0,
                                 [0n, 1n, 2n, 3n]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(3n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_1),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = { size:
                      ((t1) => {
                        if (t1 > 255n) {
                          throw new __compactRuntime.CompactError('cat-bluff52.compact line 160 char 41: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                        }
                        return t1;
                      })(t_0.size + 1n),
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: t_0.phase,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: t_0.pile,
                    winner: t_0.winner,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_2),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _startRound_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_11(seat_0, 0n),
                            'Only the host can start a round');
    __compactRuntime.assert(this._equal_12(t_0.status, 0n)
                            ||
                            this._equal_13(t_0.status, 4n),
                            'Finish this round first');
    let t_1;
    __compactRuntime.assert((t_1 = t_0.size, t_1 >= 2n),
                            'Invite at least one friend');
    let t_2;
    __compactRuntime.assert((t_2 = t_0.round, t_2 < 4294967295n),
                            'Round limit reached');
    const tmp_0 = this._mapper_2(context,
                                 partialProofData,
                                 ((context, partialProofData, point_0) =>
                                  {
                                    return { a: this._ecMulGenerator_0(0n),
                                             b: point_0 };
                                  }),
                                 this._cardPoints_0());
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this._dealOwners_0(t_0.size);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_1),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = this._dealOwners_0(t_0.size);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(6n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_2),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = new Array(52).fill(false);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(7n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tmp_3),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_4 = { size: t_0.size,
                    round:
                      ((t1) => {
                        if (t1 > 4294967295n) {
                          throw new __compactRuntime.CompactError('cat-bluff52.compact line 171 char 42: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                        }
                        return t1;
                      })(t_0.round + 1n),
                    status: 1n,
                    step: 0n,
                    turn: 0n,
                    rank: 0n,
                    phase: 0n,
                    responder: 1n,
                    passes: 0n,
                    play: 0n,
                    actor: 0n,
                    challenger: 255n,
                    pile: 0n,
                    winner: 255n,
                    outcome: 0n,
                    loser: 255n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_4),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _shuffleDeck_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_14(t_0.status, 1n)
                            &&
                            this._equal_15(seat_0, t_0.step),
                            'It is not your shuffle turn');
    const old_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(4n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(room_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const order_0 = this._permutation_0(context, partialProofData);
    const randomness_0 = this._blindingFactors_0(context, partialProofData);
    this._folder_7(context,
                   partialProofData,
                   ((context, partialProofData, t_1, i_0) =>
                    {
                      let t_2;
                      __compactRuntime.assert((t_2 = order_0[i_0], t_2 < 52n),
                                              'Shuffle index out of range');
                      this._folder_6(context,
                                     partialProofData,
                                     ((context, partialProofData, t_3, j_0) =>
                                      {
                                        if (i_0 < j_0) {
                                          __compactRuntime.assert(!this._equal_16(order_0[i_0],
                                                                                  order_0[j_0]),
                                                                  'Shuffle duplicated a physical card');
                                        }
                                        return t_3;
                                      }),
                                     [],
                                     [0n,
                                      1n,
                                      2n,
                                      3n,
                                      4n,
                                      5n,
                                      6n,
                                      7n,
                                      8n,
                                      9n,
                                      10n,
                                      11n,
                                      12n,
                                      13n,
                                      14n,
                                      15n,
                                      16n,
                                      17n,
                                      18n,
                                      19n,
                                      20n,
                                      21n,
                                      22n,
                                      23n,
                                      24n,
                                      25n,
                                      26n,
                                      27n,
                                      28n,
                                      29n,
                                      30n,
                                      31n,
                                      32n,
                                      33n,
                                      34n,
                                      35n,
                                      36n,
                                      37n,
                                      38n,
                                      39n,
                                      40n,
                                      41n,
                                      42n,
                                      43n,
                                      44n,
                                      45n,
                                      46n,
                                      47n,
                                      48n,
                                      49n,
                                      50n,
                                      51n]);
                      return t_1;
                    }),
                   [],
                   [0n,
                    1n,
                    2n,
                    3n,
                    4n,
                    5n,
                    6n,
                    7n,
                    8n,
                    9n,
                    10n,
                    11n,
                    12n,
                    13n,
                    14n,
                    15n,
                    16n,
                    17n,
                    18n,
                    19n,
                    20n,
                    21n,
                    22n,
                    23n,
                    24n,
                    25n,
                    26n,
                    27n,
                    28n,
                    29n,
                    30n,
                    31n,
                    32n,
                    33n,
                    34n,
                    35n,
                    36n,
                    37n,
                    38n,
                    39n,
                    40n,
                    41n,
                    42n,
                    43n,
                    44n,
                    45n,
                    46n,
                    47n,
                    48n,
                    49n,
                    50n,
                    51n]);
    const jointKey_0 = this._folder_8((...args_0) => this._ecAdd_0(...args_0),
                                      this._ecMulGenerator_0(0n),
                                      _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 0 } },
                                                                                                 { idx: { cached: false,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_1.toValue(3n),
                                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                                 { idx: { cached: false,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_0.toValue(room_0),
                                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                                 { popeq: { cached: false,
                                                                                                            result: undefined } }]).value));
    const shuffled_0 = this._mapper_3(context,
                                      partialProofData,
                                      ((context, partialProofData, at_0, r_0) =>
                                       {
                                         __compactRuntime.assert(r_0 > 0n,
                                                                 'Fresh shuffle randomness is required');
                                         const c_0 = this._chooseCard_0(old_0,
                                                                        at_0);
                                         return { a:
                                                    this._ecAdd_0(c_0.a,
                                                                  this._ecMulGenerator_0(r_0)),
                                                  b:
                                                    this._ecAdd_0(c_0.b,
                                                                  this._ecMul_0(jointKey_0,
                                                                                r_0)) };
                                       }),
                                      order_0,
                                      randomness_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(shuffled_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { size: t_0.size,
                    round: t_0.round,
                    status: this._equal_17(seat_0 + 1n, t_0.size) ? 2n : 1n,
                    step:
                      this._equal_18(seat_0 + 1n, t_0.size) ?
                      0n :
                      ((t1) => {
                        if (t1 > 255n) {
                          throw new __compactRuntime.CompactError('cat-bluff52.compact line 187 char 102: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                        }
                        return t1;
                      })(seat_0 + 1n),
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: t_0.phase,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: t_0.pile,
                    winner: t_0.winner,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _shareDeal_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_19(t_0.status, 2n)
                            &&
                            this._equal_20(seat_0, t_0.step),
                            'It is not your deal turn');
    const key_0 = this._checkedKey_0(context, partialProofData, room_0, seat_0);
    const own_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(5n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(room_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const dealt_0 = this._mapper_4(context,
                                   partialProofData,
                                   ((context, partialProofData, c_0, owner_0) =>
                                    {
                                      if (this._equal_21(owner_0, seat_0)) {
                                        return c_0;
                                      } else {
                                        return { a: c_0.a,
                                                 b:
                                                   this._decryptCard_0(c_0,
                                                                       key_0) };
                                      }
                                    }),
                                   _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_1.toValue(4n),
                                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_0.toValue(room_0),
                                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                                   own_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(dealt_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { size: t_0.size,
                    round: t_0.round,
                    status: this._equal_22(seat_0 + 1n, t_0.size) ? 3n : 2n,
                    step:
                      this._equal_23(seat_0 + 1n, t_0.size) ?
                      0n :
                      ((t1) => {
                        if (t1 > 255n) {
                          throw new __compactRuntime.CompactError('cat-bluff52.compact line 197 char 102: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                        }
                        return t1;
                      })(seat_0 + 1n),
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: t_0.phase,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: t_0.pile,
                    winner: t_0.winner,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _playCards_0(context, partialProofData, roomId_0, selected_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    const mask_0 = selected_0;
    __compactRuntime.assert(this._equal_24(t_0.status, 3n)
                            &&
                            this._equal_25(t_0.phase, 0n),
                            'Finish the current turn first');
    __compactRuntime.assert(this._equal_26(seat_0, t_0.turn),
                            'It is not your turn');
    const own_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(5n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(room_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const quantity_0 = this._countMask_0(mask_0);
    __compactRuntime.assert(quantity_0 > 0n, 'Select at least one card');
    this._folder_9(context,
                   partialProofData,
                   ((context, partialProofData, t_1, i_0) =>
                    {
                      __compactRuntime.assert(!mask_0[i_0]
                                              ||
                                              this._equal_27(own_0[i_0], seat_0),
                                              'That physical card is not in your hand');
                      return t_1;
                    }),
                   [],
                   [0n,
                    1n,
                    2n,
                    3n,
                    4n,
                    5n,
                    6n,
                    7n,
                    8n,
                    9n,
                    10n,
                    11n,
                    12n,
                    13n,
                    14n,
                    15n,
                    16n,
                    17n,
                    18n,
                    19n,
                    20n,
                    21n,
                    22n,
                    23n,
                    24n,
                    25n,
                    26n,
                    27n,
                    28n,
                    29n,
                    30n,
                    31n,
                    32n,
                    33n,
                    34n,
                    35n,
                    36n,
                    37n,
                    38n,
                    39n,
                    40n,
                    41n,
                    42n,
                    43n,
                    44n,
                    45n,
                    46n,
                    47n,
                    48n,
                    49n,
                    50n,
                    51n]);
    const tmp_0 = this._mapper_5(context,
                                 partialProofData,
                                 ((context, partialProofData, o_0, yes_0) =>
                                  {
                                    if (yes_0) {
                                      return 4n;
                                    } else {
                                      return o_0;
                                    }
                                  }),
                                 own_0,
                                 mask_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(7n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(mask_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_2;
    __compactRuntime.assert((t_2 = t_0.play, t_2 < 4294967295n),
                            'Turn limit reached');
    const play_0 = ((t1) => {
                     if (t1 > 4294967295n) {
                       throw new __compactRuntime.CompactError('cat-bluff52.compact line 207 char 16: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                     }
                     return t1;
                   })(t_0.play + 1n);
    const pile_0 = ((t1) => {
                     if (t1 > 255n) {
                       throw new __compactRuntime.CompactError('cat-bluff52.compact line 207 char 55: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                     }
                     return t1;
                   })(t_0.pile + quantity_0);
    const tmp_1 = this._turnKey_0(room_0, t_0.round, play_0);
    const tmp_2 = { actor: seat_0,
                    rank: t_0.rank,
                    quantity: quantity_0,
                    pileSize: pile_0,
                    passes: 0n,
                    challenger: 255n,
                    outcome: 0n,
                    receiver: 255n,
                    revealed:
                      this._mapper_6(context,
                                     partialProofData,
                                     ((context, partialProofData, i_1) =>
                                      {
                                        return 255n;
                                      }),
                                     this._indices_0()) };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_2),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = { size: t_0.size,
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: 1n,
                    responder: this._nextSeat_0(seat_0, t_0.size),
                    passes: 0n,
                    play: play_0,
                    actor: seat_0,
                    challenger: 255n,
                    pile: pile_0,
                    winner: t_0.winner,
                    outcome: 0n,
                    loser: 255n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_3),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _finishTurn_0(context, partialProofData, room_0) {
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    const empty_0 = this._equal_28(this._countMask_0(this._mapper_7(context,
                                                                    partialProofData,
                                                                    ((context,
                                                                      partialProofData,
                                                                      o_0) =>
                                                                     {
                                                                       return this._equal_29(o_0,
                                                                                             t_0.actor);
                                                                     }),
                                                                    _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                              partialProofData,
                                                                                                                              [
                                                                                                                               { dup: { n: 0 } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_1.toValue(5n),
                                                                                                                                                          alignment: _descriptor_1.alignment() } }] } },
                                                                                                                               { idx: { cached: false,
                                                                                                                                        pushPath: false,
                                                                                                                                        path: [
                                                                                                                                               { tag: 'value',
                                                                                                                                                 value: { value: _descriptor_0.toValue(room_0),
                                                                                                                                                          alignment: _descriptor_0.alignment() } }] } },
                                                                                                                               { popeq: { cached: false,
                                                                                                                                          result: undefined } }]).value))),
                                   0n);
    const tmp_0 = { size: t_0.size,
                    round: t_0.round,
                    status: empty_0 ? 4n : 3n,
                    step: t_0.step,
                    turn: this._nextSeat_0(t_0.actor, t_0.size),
                    rank:
                      this._equal_30(t_0.rank, 12n) ?
                      0n :
                      ((t1) => {
                        if (t1 > 255n) {
                          throw new __compactRuntime.CompactError('cat-bluff52.compact line 214 char 156: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                        }
                        return t1;
                      })(t_0.rank + 1n),
                    phase: 0n,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: t_0.pile,
                    winner: empty_0 ? t_0.actor : 255n,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _passClaim_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_31(t_0.status, 3n)
                            &&
                            this._equal_32(t_0.phase, 1n)
                            &&
                            this._equal_33(seat_0, t_0.responder),
                            'It is not your response turn');
    const passes_0 = ((t1) => {
                       if (t1 > 255n) {
                         throw new __compactRuntime.CompactError('cat-bluff52.compact line 219 char 18: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                       }
                       return t1;
                     })(t_0.passes + 1n);
    let t_1;
    const done_0 = this._equal_34(passes_0,
                                  (t_1 = t_0.size,
                                   (__compactRuntime.assert(t_1 >= 1n,
                                                            'result of subtraction would be negative'),
                                    t_1 - 1n)));
    const h_0 = this._turnKey_0(room_0, t_0.round, t_0.play);
    const record_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(8n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(h_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const tmp_0 = { actor: record_0.actor,
                    rank: record_0.rank,
                    quantity: record_0.quantity,
                    pileSize: record_0.pileSize,
                    passes: passes_0,
                    challenger: record_0.challenger,
                    outcome: done_0 ? 1n : 0n,
                    receiver: record_0.receiver,
                    revealed: record_0.revealed };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(h_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { size: t_0.size,
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: t_0.phase,
                    responder: this._nextSeat_0(seat_0, t_0.size),
                    passes: passes_0,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: t_0.pile,
                    winner: t_0.winner,
                    outcome: done_0 ? 1n : 0n,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_1),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (done_0) { this._finishTurn_0(context, partialProofData, room_0); }
    return [];
  }
  _callBluff_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_35(t_0.status, 3n)
                            &&
                            this._equal_36(t_0.phase, 1n)
                            &&
                            this._equal_37(seat_0, t_0.responder),
                            'It is not your response turn');
    const tmp_0 = { size: t_0.size,
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: 2n,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: seat_0,
                    pile: t_0.pile,
                    winner: t_0.winner,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const h_0 = this._turnKey_0(room_0, t_0.round, t_0.play);
    const record_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(8n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(h_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const tmp_1 = { actor: record_0.actor,
                    rank: record_0.rank,
                    quantity: record_0.quantity,
                    pileSize: record_0.pileSize,
                    passes: record_0.passes,
                    challenger: seat_0,
                    outcome: record_0.outcome,
                    receiver: record_0.receiver,
                    revealed: record_0.revealed };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(h_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_1),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revealTurn_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_38(t_0.status, 3n)
                            &&
                            this._equal_39(t_0.phase, 2n)
                            &&
                            this._equal_40(seat_0, t_0.actor),
                            'Only the challenged player can open this turn');
    const key_0 = this._checkedKey_0(context, partialProofData, room_0, seat_0);
    const ids_0 = this._openedCards_0(context, partialProofData);
    const mask_0 = _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_1.toValue(7n),
                                                                                                          alignment: _descriptor_1.alignment() } }] } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_0.toValue(room_0),
                                                                                                          alignment: _descriptor_0.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value);
    const deck_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_1.toValue(4n),
                                                                                                         alignment: _descriptor_1.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(room_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
    const shown_0 = this._mapper_8(context,
                                   partialProofData,
                                   ((context,
                                     partialProofData,
                                     c_0,
                                     selected_0,
                                     id_0) =>
                                    {
                                      if (selected_0) {
                                        __compactRuntime.assert(id_0 < 52n,
                                                                'Invalid card opening');
                                        __compactRuntime.assert(this._equal_41(this._decryptCard_0(c_0,
                                                                                                   key_0),
                                                                               this._cardPoint_0(id_0)),
                                                                'This is not the encrypted card');
                                        return id_0;
                                      } else {
                                        return 255n;
                                      }
                                    }),
                                   deck_0,
                                   mask_0,
                                   ids_0);
    const revealed_0 = shown_0;
    const truth_0 = this._folder_10(context,
                                    partialProofData,
                                    ((context, partialProofData, valid_0, id_1) =>
                                     {
                                       return valid_0
                                              &&
                                              (this._equal_42(id_1, 255n)
                                               ||
                                               this._equal_43(this._cardRank_0(id_1),
                                                              t_0.rank));
                                     }),
                                    true,
                                    revealed_0);
    const loser_0 = truth_0 ? t_0.challenger : t_0.actor;
    const outcome_0 = truth_0 ? 2n : 3n;
    const own_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(5n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(room_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const keepers_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(6n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(room_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const updatedOwners_0 = this._mapper_9(context,
                                           partialProofData,
                                           ((context,
                                             partialProofData,
                                             o_0,
                                             keeper_0) =>
                                            {
                                              if (this._equal_44(o_0, 4n)
                                                  &&
                                                  this._equal_45(keeper_0,
                                                                 loser_0))
                                              {
                                                return loser_0;
                                              } else {
                                                return o_0;
                                              }
                                            }),
                                           own_0,
                                           keepers_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(updatedOwners_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const pending_0 = this._countMask_0(this._mapper_10(context,
                                                        partialProofData,
                                                        ((context,
                                                          partialProofData,
                                                          o_1) =>
                                                         {
                                                           return this._equal_46(o_1,
                                                                                 4n);
                                                         }),
                                                        updatedOwners_0));
    const tmp_0 = { size: t_0.size,
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: 3n,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile: pending_0,
                    winner: t_0.winner,
                    outcome: outcome_0,
                    loser: loser_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const h_0 = this._turnKey_0(room_0, t_0.round, t_0.play);
    const record_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(8n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(h_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const tmp_1 = { actor: record_0.actor,
                    rank: record_0.rank,
                    quantity: record_0.quantity,
                    pileSize: record_0.pileSize,
                    passes: record_0.passes,
                    challenger: record_0.challenger,
                    outcome: outcome_0,
                    receiver: loser_0,
                    revealed: revealed_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(h_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_1),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (this._equal_47(pending_0, 0n)) {
      this._finishTurn_0(context, partialProofData, room_0);
    }
    return [];
  }
  _transferPile_0(context, partialProofData, roomId_0) {
    const room_0 = roomId_0;
    const seat_0 = this._authenticate_0(context, partialProofData, room_0);
    const t_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(room_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this._equal_48(t_0.status, 3n)
                            &&
                            this._equal_49(t_0.phase, 3n),
                            'There is no pile to transfer');
    const key_0 = this._checkedKey_0(context, partialProofData, room_0, seat_0);
    const own_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(5n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(room_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const keepers_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(6n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(room_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const mask_0 = this._mapper_11(context,
                                   partialProofData,
                                   ((context, partialProofData, o_0, keeper_0) =>
                                    {
                                      return this._equal_50(o_0, 4n)
                                             &&
                                             this._equal_51(keeper_0, seat_0);
                                    }),
                                   own_0,
                                   keepers_0);
    const count_0 = this._countMask_0(mask_0);
    __compactRuntime.assert(count_0 > 0n,
                            'Your pile cards have already been returned');
    const receiver_0 = this._chooseKey_0(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                   partialProofData,
                                                                                                   [
                                                                                                    { dup: { n: 0 } },
                                                                                                    { idx: { cached: false,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_1.toValue(3n),
                                                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                                                    { idx: { cached: false,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_0.toValue(room_0),
                                                                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                                                                    { popeq: { cached: false,
                                                                                                               result: undefined } }]).value),
                                         t_0.loser);
    const randomness_0 = this._blindingFactors_0(context, partialProofData);
    const transferred_0 = this._mapper_12(context,
                                          partialProofData,
                                          ((context,
                                            partialProofData,
                                            c_0,
                                            yes_0,
                                            r_0) =>
                                           {
                                             if (yes_0) {
                                               __compactRuntime.assert(r_0 > 0n,
                                                                       'Fresh transfer randomness is required');
                                               return { a:
                                                          this._ecMulGenerator_0(r_0),
                                                        b:
                                                          this._ecAdd_0(this._decryptCard_0(c_0,
                                                                                            key_0),
                                                                        this._ecMul_0(receiver_0,
                                                                                      r_0)) };
                                             } else {
                                               return c_0;
                                             }
                                           }),
                                          _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_1.toValue(4n),
                                                                                                                                alignment: _descriptor_1.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(room_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          mask_0,
                                          randomness_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(transferred_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = this._mapper_13(context,
                                  partialProofData,
                                  ((context, partialProofData, o_1, yes_1) =>
                                   {
                                     if (yes_1) {
                                       return t_0.loser;
                                     } else {
                                       return o_1;
                                     }
                                   }),
                                  own_0,
                                  mask_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this._mapper_14(context,
                                  partialProofData,
                                  ((context, partialProofData, o_2, yes_2) =>
                                   {
                                     if (yes_2) {
                                       return t_0.loser;
                                     } else {
                                       return o_2;
                                     }
                                   }),
                                  keepers_0,
                                  mask_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(6n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_1),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_1;
    const tmp_2 = { size: t_0.size,
                    round: t_0.round,
                    status: t_0.status,
                    step: t_0.step,
                    turn: t_0.turn,
                    rank: t_0.rank,
                    phase: t_0.phase,
                    responder: t_0.responder,
                    passes: t_0.passes,
                    play: t_0.play,
                    actor: t_0.actor,
                    challenger: t_0.challenger,
                    pile:
                      (t_1 = t_0.pile,
                       (__compactRuntime.assert(t_1 >= count_0,
                                                'result of subtraction would be negative'),
                        t_1 - count_0)),
                    winner: t_0.winner,
                    outcome: t_0.outcome,
                    loser: t_0.loser };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(room_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_2),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (this._equal_52(t_0.pile, count_0)) {
      this._finishTurn_0(context, partialProofData, room_0);
    }
    return [];
  }
  _equal_0(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_0(f, x, a0, a1) {
    for (let i = 0; i < 52; i++) { x = f(x, a0[i], a1[i]); }
    return x;
  }
  _equal_1(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_1(f, x, a0) {
    for (let i = 0; i < 52; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_3(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_2(f, x, a0, a1) {
    for (let i = 0; i < 4; i++) { x = f(x, a0[i], a1[i]); }
    return x;
  }
  _equal_4(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_3(f, x, a0, a1) {
    for (let i = 0; i < 52; i++) { x = f(x, a0[i], a1[i]); }
    return x;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_4(context, partialProofData, f, x, a0, a1) {
    for (let i = 0; i < 4; i++) { x = f(context, partialProofData, x, a0[i], a1[i]); }
    return x;
  }
  _equal_6(x0, y0) {
    {
      let x1 = x0.x;
      let y1 = y0.x;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.y;
      let y1 = y0.y;
      if (x1 !== y1) { return false; }
    }
    return true;
  }
  _equal_7(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_5(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 4; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _equal_9(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_0(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 4; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_10(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_1(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 4; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_11(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_2(context, partialProofData, f, a0) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i]); }
    return a;
  }
  _equal_14(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_15(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_16(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_6(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 52; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _folder_7(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 52; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _folder_8(f, x, a0) {
    for (let i = 0; i < 4; i++) { x = f(x, a0[i]); }
    return x;
  }
  _mapper_3(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_17(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_18(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_19(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_20(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_21(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_4(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_22(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_23(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_24(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_25(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_26(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_27(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_9(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 52; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _mapper_5(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _mapper_6(context, partialProofData, f, a0) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i]); }
    return a;
  }
  _equal_28(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_29(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_7(context, partialProofData, f, a0) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i]); }
    return a;
  }
  _equal_30(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_31(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_32(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_33(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_34(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_35(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_36(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_37(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_38(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_39(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_40(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_41(x0, y0) {
    {
      let x1 = x0.x;
      let y1 = y0.x;
      if (x1 !== y1) { return false; }
    }
    {
      let x1 = x0.y;
      let y1 = y0.y;
      if (x1 !== y1) { return false; }
    }
    return true;
  }
  _mapper_8(context, partialProofData, f, a0, a1, a2) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i], a2[i]); }
    return a;
  }
  _equal_42(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_43(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _folder_10(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 52; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _equal_44(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_45(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_9(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_46(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_10(context, partialProofData, f, a0) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i]); }
    return a;
  }
  _equal_47(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_48(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_49(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_50(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_51(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _mapper_11(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _mapper_12(context, partialProofData, f, a0, a1, a2) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i], a2[i]); }
    return a;
  }
  _mapper_13(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _mapper_14(context, partialProofData, f, a0, a1) {
    let a = [];
    for (let i = 0; i < 52; i++) { a[i] = f(context, partialProofData, a0[i], a1[i]); }
    return a;
  }
  _equal_52(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get schemaVersion() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    rooms: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 28 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 28 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(1n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    players: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 29 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 29 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_12.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    playerKeys: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(3n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(3n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 30 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(3n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 30 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(3n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_8.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    decks: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(4n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(4n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 31 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(4n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 31 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(4n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_7.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    owners: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(5n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(5n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 32 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(5n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 32 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(5n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    custodians: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(6n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(6n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 33 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(6n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 33 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(6n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    lastSelections: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(7n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(7n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 34 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(7n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 34 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(7n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_11.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    turns: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(8n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_18.toValue(0n),
                                                                                                                                  alignment: _descriptor_18.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_18.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(8n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'cat-bluff52.compact line 35 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(8n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'cat-bluff52.compact line 35 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(8n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_9.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  identitySecret: (...args) => undefined,
  encryptionSecret: (...args) => undefined,
  permutation: (...args) => undefined,
  blindingFactors: (...args) => undefined,
  openedCards: (...args) => undefined
});
export const pureCircuits = {
  indices: (...args_0) => {
    if (args_0.length !== 0) {
      throw new __compactRuntime.CompactError(`indices: expected 0 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    return _dummyContract._indices_0();
  },
  playerId: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`playerId: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('playerId',
                                 'argument 1',
                                 'cat-bluff52.compact line 39 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._playerId_0(secret_0);
  },
  turnKey: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`turnKey: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const room_0 = args_0[0];
    const round_0 = args_0[1];
    const play_0 = args_0[2];
    if (!(room_0.buffer instanceof ArrayBuffer && room_0.BYTES_PER_ELEMENT === 1 && room_0.length === 32)) {
      __compactRuntime.typeError('turnKey',
                                 'argument 1',
                                 'cat-bluff52.compact line 40 char 1',
                                 'Bytes<32>',
                                 room_0)
    }
    if (!(typeof(round_0) === 'bigint' && round_0 >= 0n && round_0 <= 4294967295n)) {
      __compactRuntime.typeError('turnKey',
                                 'argument 2',
                                 'cat-bluff52.compact line 40 char 1',
                                 'Uint<0..4294967296>',
                                 round_0)
    }
    if (!(typeof(play_0) === 'bigint' && play_0 >= 0n && play_0 <= 4294967295n)) {
      __compactRuntime.typeError('turnKey',
                                 'argument 3',
                                 'cat-bluff52.compact line 40 char 1',
                                 'Uint<0..4294967296>',
                                 play_0)
    }
    return _dummyContract._turnKey_0(room_0, round_0, play_0);
  },
  negate: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`negate: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const p_0 = args_0[0];
    return _dummyContract._negate_0(p_0);
  },
  publicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`publicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(typeof(secret_0) === 'bigint' && secret_0 >= 0n && secret_0 <= 452312848583266388373324160190187140051835877600158453279131187530910662655n)) {
      __compactRuntime.typeError('publicKey',
                                 'argument 1',
                                 'cat-bluff52.compact line 46 char 1',
                                 'Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>',
                                 secret_0)
    }
    return _dummyContract._publicKey_0(secret_0);
  },
  cardPoints: (...args_0) => {
    if (args_0.length !== 0) {
      throw new __compactRuntime.CompactError(`cardPoints: expected 0 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    return _dummyContract._cardPoints_0();
  },
  cardPoint: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`cardPoint: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const card_0 = args_0[0];
    if (!(typeof(card_0) === 'bigint' && card_0 >= 0n && card_0 <= 255n)) {
      __compactRuntime.typeError('cardPoint',
                                 'argument 1',
                                 'cat-bluff52.compact line 107 char 1',
                                 'Uint<0..256>',
                                 card_0)
    }
    return _dummyContract._cardPoint_0(card_0);
  },
  decryptCard: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`decryptCard: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const card_0 = args_0[0];
    const key_0 = args_0[1];
    if (!(typeof(card_0) === 'object' && true && true)) {
      __compactRuntime.typeError('decryptCard',
                                 'argument 1',
                                 'cat-bluff52.compact line 112 char 1',
                                 'struct CipherCard<a: Opaque<"JubjubPoint">, b: Opaque<"JubjubPoint">>',
                                 card_0)
    }
    if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 452312848583266388373324160190187140051835877600158453279131187530910662655n)) {
      __compactRuntime.typeError('decryptCard',
                                 'argument 2',
                                 'cat-bluff52.compact line 112 char 1',
                                 'Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>',
                                 key_0)
    }
    return _dummyContract._decryptCard_0(card_0, key_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
