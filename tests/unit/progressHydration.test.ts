import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LocalStorageAdapter } from '@/lib/persistence/localStorageAdapter';

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('window', { localStorage: { getItem: (key: string) => values.get(key) || null,
    setItem: (key: string, value: string) => values.set(key, value) }, dispatchEvent: vi.fn() });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('discards a read after leaving and returning to the same account', async () => {
  const storage = new LocalStorageAdapter(); storage.setAccount('alice');
  let release!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(resolve => { release = resolve; })));
  const result = storage.fetchFromPostgres();
  await Promise.resolve();
  storage.setAccount('bob'); storage.setAccount('alice');
  release(Response.json({ attempts: [], bookmarkedScenarioIds: ['stale-visit'], streakDays: 0, lastActiveDate: '', customNotes: {} }));
  expect((await result).success).toBe(false);
  expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual([]);
});

it('rejects a response when the account changes during the local merge read', async () => {
  const storage = new LocalStorageAdapter(); storage.setAccount('alice');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ attempts: [], bookmarkedScenarioIds: ['alice-private'], streakDays: 0, lastActiveDate: '', customNotes: {} })));
  const read = storage.getProgress.bind(storage);
  vi.spyOn(storage, 'getProgress').mockImplementationOnce(async () => {
    const local = await read(); storage.setAccount('bob'); return local;
  });
  expect((await storage.fetchFromPostgres()).success).toBe(false);
  expect((await read()).bookmarkedScenarioIds).toEqual([]);
});

it('bounds a stalled read and prevents a late response from modifying the cache', async () => {
  vi.useFakeTimers();
  const storage = new LocalStorageAdapter(); storage.setAccount('alice');
  let release!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(resolve => { release = resolve; })));
  const result = storage.fetchFromPostgres();
  await vi.advanceTimersByTimeAsync(8000);
  expect((await result).success).toBe(false);
  release(Response.json({ attempts: [], bookmarkedScenarioIds: ['late'], streakDays: 0, lastActiveDate: '', customNotes: {} }));
  await vi.advanceTimersByTimeAsync(1);
  expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual([]);
});

it('bounds waiting for an earlier queued write while preserving local work', async () => {
  vi.useFakeTimers();
  const storage = new LocalStorageAdapter(); storage.setAccount('alice');
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  await storage.toggleBookmark('local');
  const result = storage.fetchFromPostgres();
  await vi.advanceTimersByTimeAsync(8000);
  expect((await result).success).toBe(false);
  expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual(['local']);
});
