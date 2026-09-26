/** Local proof benchmark with synthetic keys only. Nothing is submitted to a network. */
import { resolve } from "node:path";
import {
  createUnprovenDeployTxFromVerifierKeys,
  createUnprovenCallTxFromInitialStates,
} from "@midnight-ntwrk/midnight-js-contracts";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  ChargedState,
  sampleSigningKey,
  fromHex,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  LedgerParameters,
  ZswapChainState,
} from "@midnight-ntwrk/midnight-js-protocol/ledger";
import {
  compiled,
  newSession,
  type PrivateState,
  type Circuit,
} from "../src/midnight/classic52";
import { shuffledDeck } from "../src/game/classic-rules";
import { ledger, pureCircuits } from "../managed/cat-bluff52/contract/index.js";
const endpoint =
  process.env.CLASSIC_BENCHMARK_PROVER ?? "http://127.0.0.1:6301";
if (!["127.0.0.1", "localhost", "[::1]"].includes(new URL(endpoint).hostname))
  throw new Error("Benchmark accepts only a local proof-server URL.");
setNetworkId("preprod");
const config = new NodeZkConfigProvider<Circuit>(
  resolve("managed/cat-bluff52"),
);
const prover = httpClientProofProvider(endpoint, config, { timeout: 300000 });
const make = (): PrivateState => {
  const s = newSession();
  return {
    secret: fromHex(s.secret),
    key: BigInt("0x" + s.key),
    order: shuffledDeck().map(BigInt),
    randomness: Array.from({ length: 52 }, () =>
      BigInt("0x" + newSession().key),
    ),
    opened: Array(52).fill(255n),
  };
};
const people = [make(), make()];
const room = new Uint8Array(32).fill(77),
  coin = "0".repeat(64);
const deploy = await createUnprovenDeployTxFromVerifierKeys(
  config,
  coin,
  {
    compiledContract: compiled,
    initialPrivateState: people[0],
    signingKey: sampleSigningKey(),
  },
  coin,
);
const state = deploy.public.initialContractState,
  address = deploy.public.contractAddress;
async function run(seat: number, circuitId: Circuit, args: unknown[] = [room]) {
  const transaction = await createUnprovenCallTxFromInitialStates(
    config,
    {
      compiledContract: compiled,
      circuitId,
      contractAddress: address,
      coinPublicKey: coin,
      initialContractState: state,
      initialZswapChainState: new ZswapChainState(),
      ledgerParameters: LedgerParameters.initialParameters(),
      initialPrivateState: people[seat],
      args: args as [Uint8Array, boolean[]],
    },
    coin,
  );
  const start = performance.now();
  console.log(`Proving ${circuitId}…`);
  const proof = await prover.proveTx(transaction.private.unprovenTx);
  if (!proof.serialize().length) throw new Error("Empty proof transaction");
  console.log(
    `${circuitId}: ${((performance.now() - start) / 1000).toFixed(2)}s; proof transaction produced (not submitted)`,
  );
  state.data = new ChargedState(transaction.public.nextContractState);
}
await run(0, "createRoom");
await run(1, "joinRoom");
await run(0, "startRound");
await run(0, "shuffleDeck");
await run(1, "shuffleDeck");
await run(0, "shareDeal");
await run(1, "shareDeal");
await run(0, "playCards", [
  room,
  Array.from({ length: 52 }, (_, i) => i === 0),
]);
await run(1, "passClaim");
await run(1, "playCards", [
  room,
  Array.from({ length: 52 }, (_, i) => i === 1),
]);
await run(0, "callBluff");
const lookup = new Map(
  Array.from({ length: 52 }, (_, i) => [
    JSON.stringify(pureCircuits.cardPoint(BigInt(i)), (_, v) =>
      typeof v === "bigint" ? v.toString() : v,
    ),
    BigInt(i),
  ]),
);
const current = ledger(state.data);
people[1].opened = current.decks
  .lookup(room)
  .map((c, i) =>
    current.lastSelections.lookup(room)[i]
      ? lookup.get(
          JSON.stringify(pureCircuits.decryptCard(c, people[1].key), (_, v) =>
            typeof v === "bigint" ? v.toString() : v,
          ),
        )!
      : 255n,
  );
await run(1, "revealTurn");
for (let i = 0; i < 2; i++) {
  const l = ledger(state.data);
  if (
    l.rooms.lookup(room).phase === 3n &&
    l.owners
      .lookup(room)
      .some(
        (owner, slot) =>
          owner === 4n && l.custodians.lookup(room)[slot] === BigInt(i),
      )
  )
    await run(i, "transferPile");
}
console.log(
  "All ten circuit types produced proofs against a synthetic local state. No wallet, balancing, network submission or live round was tested.",
);
