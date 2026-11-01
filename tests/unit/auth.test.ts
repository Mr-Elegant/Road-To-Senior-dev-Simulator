import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeDestination, signupSchema } from '@/lib/auth/validation';
import { mergeProgress, progressSchema } from '@/lib/persistence/progressMerge';
import { LocalStorageAdapter } from '@/lib/persistence/localStorageAdapter';
import { readBoundedJson } from '@/lib/auth/request';

describe('authentication input boundaries', () => {
  it('accepts the library’s bodyless session-control POST without accepting missing signup JSON', async () => {
    const request = () => new Request('http://localhost/api/auth/sign-out', { method: 'POST' });
    expect(await readBoundedJson(request(), 16384, true)).toBeUndefined();
    await expect(readBoundedJson(request(), 16384)).rejects.toMatchObject({ status: 400 });
  });
  it('rejects oversized and malformed JSON request bodies', async () => {
    await expect(readBoundedJson(new Request('http://localhost', { method: 'POST', body: 'x'.repeat(20) }), 10)).rejects.toMatchObject({ status: 413 });
    await expect(readBoundedJson(new Request('http://localhost', { method: 'POST', body: 'broken-json' }))).rejects.toMatchObject({ status: 400 });
  });
  it('normalizes email and rejects mismatched or short passwords', () => {
    const valid = { name: ' Ada ', email: 'ADA@example.com', password: 'long-enough-passphrase', confirmPassword: 'long-enough-passphrase' };
    expect(signupSchema.parse(valid)).toMatchObject({ name: 'Ada', email: 'ada@example.com' });
    expect(signupSchema.safeParse({ ...valid, confirmPassword: 'different' }).success).toBe(false);
    expect(signupSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' }).success).toBe(false);
  });

  it('allows internal destinations and rejects open redirects and auth loops', () => {
    expect(safeDestination('/settings?tab=sync')).toBe('/settings?tab=sync');
    for (const destination of ['https://evil.test', '//evil.test', '/\\evil.test', '/login', '/api/auth/sign-out', '/%2f%2fevil.test']) {
      expect(safeDestination(destination)).toBe('/');
    }
  });
});

describe('deliberate progress merge', () => {
  const attempt = { id: 'local-1', scenarioId: 'js-01', timestamp: '2026-10-30T00:00:00.000Z', timeSpentSeconds: 20, hintsUsedCount: 0, totalScorePercentage: 80, passedTestsCount: 1, totalTestsCount: 1, rubricScores: [], selfAssessmentCompleted: true };
  const local = { attempts: [attempt], bookmarkedScenarioIds: ['js-01'], streakDays: 1, lastActiveDate: '2026-10-30', customNotes: { 'js-01': 'old note' } };

  it('is idempotent, unions bookmarks and keeps existing server records and notes', () => {
    const server = { ...local, attempts: [{ ...attempt, totalScorePercentage: 95 }], bookmarkedScenarioIds: ['react-01'], customNotes: { 'js-01': 'new server note' }, lastActiveDate: '2026-11-01' };
    const merged = mergeProgress(server, local);
    expect(merged.attempts).toHaveLength(1);
    expect(merged.attempts[0].totalScorePercentage).toBe(95);
    expect(merged.customNotes?.['js-01']).toBe('new server note');
    expect(merged.bookmarkedScenarioIds.sort()).toEqual(['js-01', 'react-01']);
    expect(merged.lastActiveDate).toBe('2026-11-01');
    expect(mergeProgress(merged, local)).toEqual(merged);
  });

  it('rejects invalid scores, unbounded text, extra ownership fields and malformed dates', () => {
    for (const badAttempt of [{ ...attempt, userId: 'victim' }, { ...attempt, totalScorePercentage: 101 }, { ...attempt, timestamp: 'bad-date' }, { ...attempt, submittedCode: 'x'.repeat(100001) }]) {
      expect(progressSchema.safeParse({ ...local, attempts: [badAttempt] }).success).toBe(false);
    }
  });
});

describe('anonymous and account device caches', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('preserves the original anonymous history and keeps each signed-in cache separate', async () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', { localStorage: { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value) }, dispatchEvent: vi.fn() });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')));
    const storage = new LocalStorageAdapter();
    await storage.toggleBookmark('anonymous-scenario');
    storage.setAccount('alice');
    expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual([]);
    await storage.toggleBookmark('alice-scenario');
    storage.setAccount('bob');
    expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual([]);
    await storage.toggleBookmark('bob-scenario');
    storage.setAccount('alice');
    expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual(['alice-scenario']);
    storage.setAccount(null);
    expect((await storage.getProgress()).bookmarkedScenarioIds).toEqual(['anonymous-scenario']);
    expect(storage.getAnonymousProgress().bookmarkedScenarioIds).toEqual(['anonymous-scenario']);
  });
});
