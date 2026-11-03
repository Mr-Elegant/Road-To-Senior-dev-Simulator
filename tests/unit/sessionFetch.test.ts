import { afterEach, expect, it, vi } from 'vitest';
import { sessionFetch } from '@/lib/auth/sessionFetch';

afterEach(() => vi.unstubAllGlobals());

it('retains SDK cancellation while bounding a session read', async () => {
  const caller = new AbortController();
  const fetcher = vi.fn().mockResolvedValue(Response.json(null));
  vi.stubGlobal('fetch', fetcher);
  await sessionFetch('https://example.test/api/auth/get-session', { signal: caller.signal });
  const actualSignal = fetcher.mock.calls[0][1].signal as AbortSignal;
  expect(actualSignal).not.toBe(caller.signal);
  expect(actualSignal.aborted).toBe(false);
  caller.abort();
  expect(actualSignal.aborted).toBe(true);
});

it('leaves credential operations and their request options unchanged', async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({}));
  vi.stubGlobal('fetch', fetcher);
  const options = { method: 'POST', body: '{}' };
  await sessionFetch('/api/auth/sign-in/email', options);
  expect(fetcher).toHaveBeenCalledWith('/api/auth/sign-in/email', options);
});
