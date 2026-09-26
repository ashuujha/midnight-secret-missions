import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  fromHex,
  toHex,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  Binding,
  Proof,
  SignatureEnabled,
  Transaction,
  type FinalizedTransaction,
  type TransactionId,
} from "@midnight-ntwrk/midnight-js-protocol/ledger";
import {
  createProofProvider,
  type MidnightProviders,
  type ProofProvider,
  type UnboundTransaction,
} from "@midnight-ntwrk/midnight-js-types";
import { submitTransactionOnce } from "./submit-transaction";
import { inMemoryPrivateStateProvider } from "../in-memory-private-state-provider";
import { getErrorMessage, getProofServerOrigin } from "../utils/errors";
import type { CachedZkConfigProvider } from "./cached-zk-config";
import type { TransactionStage } from "./cat-bluff";
const stage = async <T>(
  label: string,
  operation: () => Promise<T>,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw new Error(`${label}: ${getErrorMessage(error) || "Unknown error"}`, {
      cause: error,
    });
  }
};

export async function createWalletProviders<
  C extends string,
  P extends string,
  S,
>(
  api: ConnectedAPI,
  networkId: string,
  zkConfigProvider: CachedZkConfigProvider<C>,
  onStage?: (stage: TransactionStage) => void,
  hostedProver?: string,
  warm?: () => Promise<void>,
): Promise<MidnightProviders<C, P, S>> {
  setNetworkId(networkId);
  const [configuration, keys] = await Promise.all([
    stage("Reading Lace configuration failed", () => api.getConfiguration()),
    stage("Reading Lace addresses failed", () => api.getShieldedAddresses()),
  ]);
  if (configuration.networkId !== networkId)
    throw new Error(`Network mismatch. Switch Lace to ${networkId}.`);

  const proofProvider: ProofProvider = hostedProver
    ? httpClientProofProvider(hostedProver, zkConfigProvider)
    : createProofProvider(
        await stage("Initializing Lace proving failed", () =>
          api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider()),
        ),
      );
  const localState = inMemoryPrivateStateProvider<P, S>();
  return {
    privateStateProvider: localState,
    zkConfigProvider,
    proofProvider: {
      proveTx: (transaction, config) => {
        onStage?.("proving");
        return stage("Proof service request failed", async () => {
          if (hostedProver && warm) await warm();
          return proofProvider.proveTx(transaction, config);
        });
      },
    },
    publicDataProvider: indexerPublicDataProvider(
      configuration.indexerUri,
      configuration.indexerWsUri,
    ),
    walletProvider: {
      getCoinPublicKey: () => keys.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => keys.shieldedEncryptionPublicKey,
      balanceTx: async (
        transaction: UnboundTransaction,
      ): Promise<FinalizedTransaction> => {
        onStage?.("balancing");
        const origin = getProofServerOrigin(configuration.proverServerUri);
        const balanced = await stage(
          `Lace transaction balancing failed${origin ? ` (wallet proof server: ${origin})` : ""}`,
          () => api.balanceUnsealedTransaction(toHex(transaction.serialize())),
        );
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
          "signature",
          "proof",
          "binding",
          fromHex(balanced.tx),
        );
      },
    },
    midnightProvider: {
      submitTx: async (
        transaction: FinalizedTransaction,
      ): Promise<TransactionId> => {
        onStage?.("submitting");
        const transactionId = transaction.identifiers()[0];
        await submitTransactionOnce(transactionId, () =>
          api.submitTransaction(toHex(transaction.serialize())),
        );
        onStage?.("confirming");
        return transactionId;
      },
    },
  };
}
