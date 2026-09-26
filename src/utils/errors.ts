// Connector errors can cross the extension boundary as plain objects.
export const getErrorMessage = (error: unknown): string => {
  const seen = new Set<object>();
  const details: string[] = [];
  const visit = (value: unknown, depth: number) => {
    if (depth > 4) return;
    if (typeof value === 'string' && value.trim()) {
      details.push(value.trim());
      return;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      details.push(String(value));
      return;
    }
    if (value === null || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    // Read error fields only. Never serialize transaction payloads or private state.
    const record = value as Record<string, unknown>;
    for (const field of ['code', 'message', 'reason', 'info', 'cause', 'error']) {
      visit(record[field], depth + 1);
    }
  };
  visit(error, 0);
  return [...new Set(details)].join(': ');
};

// Show only the service origin: a custom URL may contain credentials or tokens.
export const getProofServerOrigin = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? url.origin : undefined;
  } catch {
    return undefined;
  }
};

// Lace can keep exposing an injected proxy after its extension channel shuts down.
// Repeating a transaction cannot revive that proxy; the extension/page must reconnect.
const isExpiredWalletSession = (message: string): boolean =>
  /remote api.*was shut ?down|object can no longer be used|extension context invalidated|attempting to use a disconnected port/i.test(message);

const walletSessionRecovery =
  "Lace's extension connection stopped. Open chrome://extensions, switch Lace off and back on, unlock it, then reload this page and reconnect. Keep your wallet and site data.";

// Lace 2.4 also returns Rejected when locked, without opening an approval window.
const isLockedWallet = (message: string): boolean =>
  /wallet (?:is )?locked|unlock (?:the )?wallet|wallet unlock/i.test(message);

const lockedWalletRecovery =
  'Lace is locked or needs to be unlocked. Open the Lace extension and unlock your wallet, then return here and reconnect. A locked wallet may refuse the request without showing an approval window.';

export const friendlyWalletError = (error: unknown, networkId: string): string => {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (isExpiredWalletSession(message)) return walletSessionRecovery;
  if (isLockedWallet(message)) return lockedWalletRecovery;

  if (/permissionrejected|not authorized|not authorised|unauthorized request origin/.test(normalized)) {
    return 'Lace has not authorized this site. Unlock Lace and reconnect. If no approval window appears, check Settings → Authorized DApps for this site and reconnect its entry.';
  }
  if (/reject|denied|not authorized|cancel/.test(normalized)) {
    return 'Wallet connection was rejected. Approve the request in Lace and try again.';
  }
  if (/network mismatch|network id/.test(normalized)) {
    return `Network mismatch. Switch Lace to ${networkId} and reconnect.`;
  }
  if (/disconnect|connection lost/.test(normalized)) {
    return 'The connection to Lace was lost. Unlock Lace and reconnect your wallet.';
  }
  if (/timeout|timed out/.test(normalized)) {
    return 'Lace took too long to respond. Open the extension, check for a pending request, and try again.';
  }
  return message
    ? `Lace could not complete the request: ${message}. Check the extension and try again.`
    : 'Lace could not complete the request. Unlock the extension and try again.';
};

export const friendlyCircuitError = (error: unknown, networkId: string): string => {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (isExpiredWalletSession(message)) {
    return `${walletSessionRecovery} Before repeating the action, check Lace activity for a pending or submitted transaction.`;
  }

  if (isLockedWallet(message)) return lockedWalletRecovery;

  if (/lace transaction submission failed/i.test(message)) {
    return `${message}. Deployment or move completion is not confirmed. Check this transaction in Lace or the explorer before starting another attempt.`;
  }

  if (/dynamically imported module|module script|loading chunk|importing a module/.test(normalized)) {
    return 'The proving tools could not be downloaded. Check your internet connection and reload the page before trying again.';
  }
  if (/reject|denied|cancel/.test(normalized)) {
    return 'The transaction was cancelled in Lace. You can try again when you are ready.';
  }
  if (/disconnect|connection lost/.test(normalized)) {
    return 'The connection to Lace was lost. Reconnect your wallet before trying again.';
  }
  if (/network mismatch|network id/.test(normalized)) {
    return `Network mismatch. Switch Lace to ${networkId}, reconnect, and try again.`;
  }
  if (/no dust generation registration|zero dust balance/.test(normalized)) {
    return message;
  }
  if (/insufficient|dust/.test(normalized)) {
    return 'Lace could not pay the transaction fee with the available DUST. Confirm Generate tDUST in Lace, wait for a positive DUST balance and full wallet sync, then reconnect.';
  }
  if (/timeout|timed out/.test(normalized)) {
    return 'The request timed out. Check Lace for a submitted or pending transaction before trying again.';
  }
  if (/lace transaction balancing failed/.test(normalized)) {
    const walletProver = message.match(/wallet proof server: ([^)]+)\)/)?.[1];
    const status = message.match(/(?:code|status)=["']?(\d{3})\b/i)?.[1];
    if (walletProver && /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(walletProver)) {
      return `Lace could not use its local proof endpoint (${walletProver}), so the transaction was not submitted. Check ${walletProver}/ready. If it is down, run npm run proof:bridge in this project or start a local proof server, then retry.`;
    }
    const service = walletProver ? ` Lace proof server: ${walletProver}.` : '';
    const detail = status ? ` Its request returned HTTP ${status}.` : '';
    return `Lace could not balance the transaction, so it was not submitted.${service}${detail} Check Lace's proof-server setting, wallet sync, and available tDUST. The site's proof-server setting does not change Lace's.`;
  }
  if (/proof service request failed/.test(normalized) && /failed to fetch|networkerror|network request|load failed/.test(normalized)) {
    return 'The proof service could not be reached. Its address may be unavailable or the service may be offline. Try again once the proof service is available.';
  }
  if (/proof server|proving failed|proof service request failed/.test(normalized)) {
    return 'The proof service could not complete the request. Check the configured proof server or Lace proving settings, then try again.';
  }
  if (/failed to fetch|networkerror|network request|load failed/.test(normalized)) {
    if (/loading the .* contract failed/.test(normalized)) {
      return `The ${networkId} contract data could not be loaded from the indexer. Check your connection and try again when the indexer is available.`;
    }
    if (/transaction submission failed|proving or submitting/.test(normalized)) {
      return 'A network request failed while processing the transaction. Check Lace for a submitted or pending transaction before trying again.';
    }
    return 'A network request failed. Check your internet connection, wallet sync, and proof service, then try again.';
  }
  if (/webassembly|wasm/.test(normalized)) {
    return 'The proving runtime could not start. Reload the page in an up-to-date browser and try again.';
  }
  return message
    ? `The circuit call failed: ${message}. Check Lace and try again.`
    : 'The circuit call failed. Check Lace and your proof service, then try again.';
};
