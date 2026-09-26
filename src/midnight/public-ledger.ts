// Use the same runtime as the compiled contract, including on the Node server.
// The ledger package's WASM classes are distinct in Node (ChargedState identity).
import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { fromHex } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as Game from "../../managed/cat-bluff52/contract/index.js";

export type PublicLedger = { ledger: ReturnType<typeof Game.ledger>; blockHeight: number };
export const isContractId = (value: string) => /^[a-f0-9]{64}$/.test(value);
export const isNetwork = (value: string) => value === "preprod" || value === "preview";

// Fixed read-only query: no caller-supplied URLs, GraphQL, wallet data or proof inputs.
export async function fetchPublicLedger(address: string, network: string): Promise<PublicLedger> {
  if (!isContractId(address.toLowerCase()) || !isNetwork(network))
    throw new Error("Choose a valid contract on Preprod or Preview.");
  const response = await fetch(`https://indexer.${network}.midnight.network/api/v4/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      query: "query ($address: HexEncoded!) { contractAction(address: $address) { state transaction { block { height } } } }",
      variables: { address: address.toLowerCase() },
    }),
  });
  if (!response.ok) throw new Error("Midnight table updates are unavailable. Retrying shortly.");
  // Bound memory even if an upstream returns an unexpectedly large payload.
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Midnight returned an empty response.");
  let text = "", bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16 * 1024 * 1024) throw new Error("The contract state exceeds this client's read limit.");
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    await reader.cancel();
  }
  const result = JSON.parse(text);
  if (result.errors?.length) throw new Error("Midnight could not read this contract. Retry shortly.");
  const action = result.data?.contractAction;
  if (!action) throw new Error("Classic 52 contract was not found.");
  const blockHeight = action.transaction?.block?.height;
  if (typeof action.state !== "string" || !/^(?:[a-f0-9]{2})+$/i.test(action.state) ||
      !Number.isSafeInteger(blockHeight) || blockHeight < 0)
    throw new Error("Midnight returned an incomplete contract state.");
  return { ledger: Game.ledger(ContractState.deserialize(fromHex(action.state)).data), blockHeight };
}
