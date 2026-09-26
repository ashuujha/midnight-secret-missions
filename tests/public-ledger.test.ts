import assert from "node:assert/strict";
import { it } from "node:test";
import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { toHex } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import { fetchPublicLedger } from "../src/midnight/public-ledger";

it("decodes indexer bytes with the compiled contract's Node WASM runtime", async (t) => {
  // Indexer bytes must decode into the compiled contract's runtime classes.
  const { Contract } = await import("../managed/cat-bluff52/contract/index.js");
  const { createConstructorContext } = await import("@midnight-ntwrk/compact-runtime");
  const unused = () => { throw new Error("The constructor needs no private witness"); };
  const contract = new Contract({ identitySecret: unused, encryptionSecret: unused,
    permutation: unused, blindingFactors: unused, openedCards: unused });
  const state = contract.initialState(createConstructorContext({}, "0".repeat(64))).currentContractState;
  assert(state instanceof ContractState);
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    calls++;
    assert.equal(url, "https://indexer.preprod.midnight.network/api/v4/graphql");
    assert.equal(init.cache, "no-store");
    assert.deepEqual(JSON.parse(init.body as string).variables, { address: "a".repeat(64) });
    return Response.json({ data: { contractAction: { state: toHex(state.serialize()), transaction: { block: { height: 123 } } } } });
  });
  const result = await fetchPublicLedger("a".repeat(64), "preprod");
  assert.equal(result.ledger.schemaVersion, 4n);
  assert.equal(result.blockHeight, 123);
  assert.equal(calls, 1);
});

it("rejects invalid targets and incomplete or failed indexer responses", async (t) => {
  let calls = 0, body: object = {};
  t.mock.method(globalThis, "fetch", async () => { calls++; return Response.json(body); });
  await assert.rejects(fetchPublicLedger("bad", "preprod"), /valid contract/);
  await assert.rejects(fetchPublicLedger("a".repeat(64), "https://other"), /valid contract/);
  assert.equal(calls, 0);
  await assert.rejects(fetchPublicLedger("a".repeat(64), "preprod"), /not found/);
  body = { errors: [{ message: "upstream detail" }] };
  await assert.rejects(fetchPublicLedger("a".repeat(64), "preprod"), /could not read/);
  body = { data: { contractAction: { state: "not-hex", transaction: { block: { height: 123 } } } } };
  await assert.rejects(fetchPublicLedger("a".repeat(64), "preprod"), /incomplete/);
});
