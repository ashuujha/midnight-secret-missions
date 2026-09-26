import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import type { ProverKey, VerifierKey, ZKConfig, ZKIR } from '@midnight-ntwrk/midnight-js-types';

// Repeated card actions reuse their circuit material. Cache both completed
// downloads and in-flight prefetches; failed requests remain retryable.
export class CachedZkConfigProvider<K extends string> extends FetchZkConfigProvider<K> {
  private readonly proverKeys = new Map<K, Promise<ProverKey>>();
  private readonly verifierKeys = new Map<K, Promise<VerifierKey>>();
  private readonly zkirs = new Map<K, Promise<ZKIR>>();

  private cache<T>(entries: Map<K, Promise<T>>, id: K, load: () => Promise<T>): Promise<T> {
    const existing = entries.get(id);
    if (existing) return existing;
    const pending = load().catch((error) => {
      entries.delete(id);
      throw error;
    });
    entries.set(id, pending);
    return pending;
  }

  override getProverKey(id: K): Promise<ProverKey> {
    return this.cache(this.proverKeys, id, () => super.getProverKey(id));
  }

  override getVerifierKey(id: K): Promise<VerifierKey> {
    return this.cache(this.verifierKeys, id, () => super.getVerifierKey(id));
  }

  override getZKIR(id: K): Promise<ZKIR> {
    return this.cache(this.zkirs, id, () => super.getZKIR(id));
  }

  override async get(id: K): Promise<ZKConfig<K>> {
    const [proverKey, verifierKey, zkir] = await Promise.all([
      this.getProverKey(id), this.getVerifierKey(id), this.getZKIR(id),
    ]);
    return { circuitId: id, proverKey, verifierKey, zkir };
  }
}
