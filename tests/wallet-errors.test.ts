import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { friendlyWalletError, friendlyCircuitError } from '../src/utils/errors';

const shutdown = "Remote API with channel 'feature-flags' was shutdown: object can no longer be used.";

describe('Lace extension session recovery', () => {
  it('gives restart and reconnect steps for the reported feature-flags error', () => {
    const message = friendlyWalletError(new Error(shutdown), 'preprod');
    assert.match(message, /chrome:\/\/extensions/);
    assert.match(message, /switch Lace off and back on/);
    assert.match(message, /reload this page and reconnect/);
    assert.match(message, /Keep your wallet and site data/);
  });

  it('handles serialized extension errors and invalidated Chrome contexts', () => {
    for (const error of [
      { code: 'InternalError', reason: shutdown },
      { message: 'Extension context invalidated.' },
      'Attempting to use a disconnected port object',
    ]) {
      assert.match(friendlyWalletError(error, 'preprod'), /switch Lace off and back on/);
    }
  });

  it('recognizes shutdown inside a proof or submission wrapper without encouraging duplicate transactions', () => {
    const message = friendlyCircuitError(
      new Error(`Proof service request failed: ${shutdown}`), 'preprod',
    );
    assert.match(message, /switch Lace off and back on/);
    assert.match(message, /check Lace activity for a pending or submitted transaction/);
    assert.doesNotMatch(message, /transaction was not submitted/);
  });

  it('keeps ordinary cancellation and network mismatch guidance', () => {
    assert.match(friendlyWalletError({ message: 'User rejected request' }, 'preprod'), /connection was rejected/);
    assert.match(friendlyWalletError(new Error('Network mismatch'), 'preprod'), /Switch Lace to preprod/);
    assert.match(friendlyCircuitError('User cancelled', 'preprod'), /transaction was cancelled/);
  });

  it('does not classify a proof-service outage as an extension shutdown', () => {
    const message = friendlyCircuitError('Proof service request failed: Failed to fetch', 'preprod');
    assert.match(message, /proof service could not be reached/);
    assert.doesNotMatch(message, /switch Lace off/);
  });
});
