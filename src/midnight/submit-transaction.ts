import { getErrorMessage } from '../utils/errors';

/** Submit exactly once, retaining the public identifier if Lace loses the response. */
export async function submitTransactionOnce(
  transactionId: string,
  submit: () => Promise<void>,
): Promise<string> {
  try {
    await submit();
    return transactionId;
  } catch (cause) {
    const reason = getErrorMessage(cause) || 'Lace returned no readable error details';
    throw new Error(
      `Lace transaction submission failed: ${reason}. Transaction ID: ${transactionId}`,
      { cause },
    );
  }
}
