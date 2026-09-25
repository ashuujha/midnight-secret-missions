import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CachedZkConfigProvider } from '../src/midnight/cached-zk-config';

test('downloads circuit artifacts concurrently and reuses them across actions', async () => {
  const requests: string[] = [];
  const fetchMock: typeof fetch = async (input) => {
    requests.push(String(input));
    return new Response('artifact', { headers: { 'content-type': 'application/octet-stream' } });
  };
  const provider = new CachedZkConfigProvider<'visit'>('https://example.test', fetchMock);

  const first = provider.get('visit');
  assert.equal(requests.length, 3);
  await first;
  const repeated = await provider.get('visit');
  assert.equal(requests.length, 3);
  assert.ok(repeated.proverKey.length > 0);
  assert.ok(repeated.verifierKey.length > 0);
  assert.ok(repeated.zkir.length > 0);
});

test('retries a failed artifact download on the next action', async () => {
  let attempts = 0;
  const fetchMock: typeof fetch = async () => {
    attempts += 1;
    return attempts === 1 ? new Response('unavailable', { status: 503 }) : new Response('key');
  };
  const provider = new CachedZkConfigProvider<'join'>('https://example.test', fetchMock);

  await assert.rejects(provider.getProverKey('join'));
  assert.ok((await provider.getProverKey('join')).length > 0);
  assert.equal(attempts, 2);
});
