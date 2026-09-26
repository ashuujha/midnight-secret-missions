import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { submitTransactionOnce } from '../src/midnight/submit-transaction';
import { getErrorMessage, friendlyCircuitError } from '../src/utils/errors';

describe('wallet submission diagnostics', () => {
  it('submits once and returns the actual transaction identifier', async () => {
    let calls = 0;
    const result = await submitTransactionOnce('a'.repeat(64), async () => { calls++; });
    assert.equal(result, 'a'.repeat(64));
    assert.equal(calls, 1);
  });
  it('does not retry ambiguous failures and retains the public identifier and cause', async () => {
    let calls = 0;
    const cause = { error: { code: 1010, message: 'Invalid Transaction' } };
    await assert.rejects(
      submitTransactionOnce('b'.repeat(64), async () => { calls++; throw cause; }),
      (error: Error) => {
        assert.equal(error.cause, cause);
        assert.match(error.message, /1010: Invalid Transaction/);
        assert.match(error.message, new RegExp('Transaction ID: ' + 'b'.repeat(64)));
        assert.match(friendlyCircuitError(error, 'preprod'), /before starting another attempt/);
        return true;
      },
    );
    assert.equal(calls, 1);
  });
  it('retains an identifier even when Lace supplies no error fields', async () => {
    await assert.rejects(
      submitTransactionOnce('c'.repeat(64), async () => { throw {}; }),
      /no readable error details.*Transaction ID: c{64}/,
    );
  });
  it('reads nested connector errors without serializing private payloads or looping on cycles', () => {
    const cause = { code: -32603, message: 'Internal error', privateState: 'secret', tx: 'signed bytes' };
    const wrapped: Record<string, unknown> = { reason: cause, transaction: { secret: 'hidden' } };
    wrapped.cause = wrapped;
    assert.equal(getErrorMessage(wrapped), '-32603: Internal error');
  });
});
