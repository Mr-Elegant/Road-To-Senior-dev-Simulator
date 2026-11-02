import { test, expect, request as apiRequest, APIRequestContext } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loadEnvConfig } from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';
import { signInTestAccount } from './support/account';

loadEnvConfig(process.cwd());
const db = new PrismaClient({ log: [] });
const runId = randomUUID();
const email = `auth-e2e-${runId}@example.test`;
const otherEmail = `auth-e2e-other-${runId}@example.test`;
const password = randomBytes(24).toString('base64url');
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const origin = new URL(baseURL).origin;
const headers = { Origin: origin, 'Content-Type': 'application/json', 'x-real-ip': '192.0.2.51' };
let owner: APIRequestContext;
let other: APIRequestContext;
let ownerId = '';
let otherId = '';

const localAttempt = { id: 'anonymous-attempt-1', scenarioId: 'js-event-loop-microtasks', timestamp: new Date().toISOString(), timeSpentSeconds: 60, hintsUsedCount: 0, rubricScores: [], totalScorePercentage: 80, passedTestsCount: 1, totalTestsCount: 1, selfAssessmentCompleted: true };
const anonymousProgress = { attempts: [localAttempt], bookmarkedScenarioIds: ['js-event-loop-microtasks'], streakDays: 1, lastActiveDate: new Date().toISOString().slice(0, 10), customNotes: { 'js-event-loop-microtasks': 'Anonymous device notes' } };
test.use({ trace: 'off' });

test.describe.serial('Authentication and account isolation', () => {
  test.beforeAll(async () => {
    owner = await apiRequest.newContext({ baseURL, extraHTTPHeaders: headers });
    other = await apiRequest.newContext({ baseURL, extraHTTPHeaders: { ...headers, 'x-real-ip': '192.0.2.52' } });
    const response = await other.post('/api/auth/sign-up/email', { data: { name: 'Other Test Candidate', email: otherEmail, password, confirmPassword: password } });
    expect(response.ok()).toBeTruthy();
    otherId = (await response.json()).user.id;
  });
  test.afterAll(async () => {
    // Delete only the two disposable accounts created by this exact test run.
    // Resolve IDs by these exact generated emails even if a UI assertion failed
    // before the session response assigned ownerId.
    const disposable = await db.user.findMany({ where: { email: { in: [email, otherEmail] } }, select: { id: true } });
    await db.user.deleteMany({ where: { email: { in: [email, otherEmail] }, id: { in: disposable.map((user) => user.id) } } });
    await db.rateLimit.deleteMany({ where: { key: { in: disposable.map((user) => `ai:${user.id}`) } } });
    await owner?.dispose(); await other?.dispose(); await db.$disconnect();
  });

  test('public practice and anonymous data survive signup; forms validate and redirects are preserved', async ({ page }) => {
    await page.goto('/library');
    await page.evaluate((progress) => localStorage.setItem('fullstack_interview_lab_progress_v1', JSON.stringify(progress)), anonymousProgress);
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login\?next=%2Fsettings/);
    await page.goto('/signup?next=/settings');
    await page.getByLabel('Name', { exact: true }).fill('Test Candidate');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm password', { exact: true }).fill('different-passphrase');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText('Passwords do not match.')).toBeVisible();
    await page.getByLabel('Confirm password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL(/\/settings$/, { timeout: 30000 });
    await expect(page.getByRole('heading', { name: 'Application Settings' })).toBeVisible();
    const session = await page.request.get('/api/auth/get-session');
    ownerId = (await session.json()).user.id;
    await owner.dispose();
    owner = await apiRequest.newContext({ baseURL, extraHTTPHeaders: headers, storageState: await page.context().storageState() });
    const cloud = await owner.get('/api/progress');
    expect((await cloud.json()).attempts).toHaveLength(0);
    await page.goto('/account');
    await page.getByRole('button', { name: 'Import anonymous progress' }).click();
    await expect(page.getByRole('status')).toContainText('original device data is preserved', { timeout: 20000 });
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fullstack_interview_lab_progress_v1')!).attempts.length)).toBe(1);
    expect((await (await owner.get('/api/progress')).json()).attempts).toHaveLength(1);
    const cookie = (await page.context().cookies()).find((value) => value.name.includes('session_token'));
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('Lax');
    if (process.env.AUTH_EXPECT_SECURE === 'true') expect(cookie?.secure).toBe(true);
    const credential = await db.account.findFirstOrThrow({ where: { userId: ownerId, providerId: 'credential' }, select: { password: true } });
    expect(credential.password).not.toBe(password);
    expect(credential.password?.length).toBeGreaterThan(64);
    await page.getByRole('button', { name: 'Logout', exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fullstack_interview_lab_progress_v1')!).attempts.length)).toBe(1);
    expect((await page.request.get('/api/progress')).status()).toBe(401);
    const signedIn = await owner.post('/api/auth/sign-in/email', { data: { email, password } });
    expect(signedIn.ok()).toBeTruthy();
  });

  test('signup enforces uniqueness and server validation; login errors do not enumerate accounts', async ({ request }) => {
    const duplicate = await owner.post('/api/auth/sign-up/email', { data: { name: 'Duplicate', email: email.toUpperCase(), password, confirmPassword: password } });
    expect(duplicate.ok()).toBe(false);
    expect(await db.user.count({ where: { email } })).toBe(1);
    const invalid = await request.post('/api/auth/sign-up/email', { headers, data: { name: '', email: 'bad', password: 'short', confirmPassword: 'mismatch' } });
    expect(invalid.status()).toBe(422);
    const first = await request.post('/api/auth/sign-in/email', { headers: { ...headers, 'x-real-ip': '192.0.2.53' }, data: { email, password: 'incorrect-passphrase' } });
    const second = await request.post('/api/auth/sign-in/email', { headers: { ...headers, 'x-real-ip': '192.0.2.54' }, data: { email: `missing-${runId}@example.test`, password: 'incorrect-passphrase' } });
    expect(first.status()).toBe(401); expect(second.status()).toBe(401);
    expect((await first.json()).message).toBe((await second.json()).message);
  });

  test('private APIs reject anonymous users, forged ownership, invalid cookies and cross-origin writes', async ({ request }) => {
    for (const path of ['/api/progress', '/api/progress/status', '/api/progress/tier1', '/api/progress/sql', '/api/applications', '/api/dashboard/stats']) expect((await request.get(path)).status()).toBe(401);
    for (const path of ['/api/progress/attempt', '/api/progress/import', '/api/ai-interview', '/api/sql/evaluate']) expect((await request.post(path, { data: {} })).status()).toBe(401);
    expect((await owner.get(`/api/progress?userId=${otherId}`)).status()).toBe(400);
    expect((await owner.post('/api/progress/notes', { data: { userId: otherId, scenarioId: 'test', notes: 'forged' } })).status()).toBe(422);
    expect((await owner.post('/api/progress/notes', { headers: { Origin: 'https://evil.test' }, data: { scenarioId: 'test', notes: 'forged' } })).status()).toBe(403);
    expect((await owner.post('/api/auth/sign-out', { headers: { Origin: 'https://evil.test' }, data: {} })).status()).toBe(403);
    const forged = await request.get('/api/progress', { headers: { Cookie: 'better-auth.session_token=invalid; __Secure-better-auth.session_token=invalid' } });
    expect(forged.status()).toBe(401);
    expect((await (await other.get('/api/progress')).json()).attempts).toHaveLength(0);
  });

  test('progress merging is idempotent, preserves newer server content and isolates colliding client IDs', async () => {
    expect((await owner.post('/api/progress/notes', { data: { scenarioId: localAttempt.scenarioId, notes: 'Newer account note' } })).ok()).toBeTruthy();
    for (let i = 0; i < 2; i++) expect((await owner.post('/api/progress/import', { data: { progress: anonymousProgress } })).ok()).toBeTruthy();
    const data = await (await owner.get('/api/progress')).json();
    expect(data.attempts).toHaveLength(1);
    const stale = { ...anonymousProgress, attempts: [{ ...localAttempt, totalScorePercentage: 5 }] };
    await owner.post('/api/progress/import', { data: { progress: stale } });
    expect((await (await owner.get('/api/progress')).json()).attempts[0].totalScorePercentage).toBe(80);
    expect(data.customNotes[localAttempt.scenarioId]).toBe('Newer account note');
    expect((await other.post('/api/progress/import', { data: { progress: anonymousProgress } })).ok()).toBeTruthy();
    const otherData = await (await other.get('/api/progress')).json();
    expect(otherData.attempts).toHaveLength(1);
    expect(otherData.customNotes[localAttempt.scenarioId]).toBe('Anonymous device notes');
    expect((await owner.post('/api/progress/import', { data: { progress: { ...anonymousProgress, attempts: [{ ...localAttempt, totalScorePercentage: 999 }] } } })).status()).toBe(422);
    expect((await (await owner.get('/api/progress')).json()).attempts).toHaveLength(1);
    const sessions = await owner.get('/api/auth/get-session');
    expect((await sessions.json()).user.id).toBe(ownerId);
  });

  test('authentication throttling applies to repeated failed logins', async ({ request }) => {
    const statuses: number[] = [];
    const address = `198.51.100.${randomBytes(1)[0] || 1}`;
    for (let i = 0; i < 6; i++) statuses.push((await request.post('/api/auth/sign-in/email', { headers: { ...headers, 'x-real-ip': address }, data: { email, password: 'wrong-passphrase' } })).status());
    expect(statuses.slice(0, 5)).toEqual([401, 401, 401, 401, 401]);
    expect(statuses[5]).toBe(429);
  });

  test('loan simulations and expired sessions are isolated by account', async ({ page }) => {
    const items = await (await owner.get('/api/applications')).json();
    const loan = items.items[0];
    const originalOther = await (await other.get(`/api/applications/${loan.id}`)).json();
    const changed = await owner.patch(`/api/applications/${loan.id}/status`, { data: { status: loan.status === 'APPROVED' ? 'REJECTED' : 'APPROVED' } });
    expect(changed.ok()).toBeTruthy();
    expect((await (await other.get(`/api/applications/${loan.id}`)).json()).status).toBe(originalOther.status);
    await db.session.updateMany({ where: { userId: ownerId }, data: { expiresAt: new Date(Date.now() - 60000) } });
    expect((await owner.get('/api/progress')).status()).toBe(401);
    await page.context().addCookies((await owner.storageState()).cookies);
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login\?next=%2Faccount/);
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL(/\/account$/, { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Logout', exact: true })).toBeVisible();
    const secondSession = await owner.post('/api/auth/sign-in/email', { data: { email, password } });
    expect(secondSession.ok()).toBeTruthy();
    await page.getByRole('button', { name: 'Sign out other devices' }).click();
    await expect(page.getByRole('status')).toContainText('Other devices have been signed out');
    expect((await owner.get('/api/progress')).status()).toBe(401);
  });
});

test('public pages, SQL playground, and responsive auth forms retain theme support', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  for (const path of ['/', '/library', '/practice', '/progress', '/interview?tier=tier-1', '/sql']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'SQL Sandbox & Playground' }).click();
  await expect(page.getByText('SQL Engine', { exact: false }).first()).toBeVisible();
  await page.goto('/login');
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  expect(await page.locator('html').getAttribute('class')).not.toContain('dark');
  await page.screenshot({ path: 'test-results/auth-login-light.png', fullPage: true });
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.screenshot({ path: 'test-results/auth-login-dark.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/signup');
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/auth-signup-mobile.png', fullPage: true });
  expect(runtimeErrors).toEqual([]);
});

test('Tier-1 and SQL cloud progress are validated, idempotent and independently resettable', async ({ page }) => {
  const cleanup = await signInTestAccount(page);
  const mutationHeaders = { Origin: origin, 'Content-Type': 'application/json' };
  try {
    const evaluation = { scoreOutOf100: 90, verdict: 'Mastered', conceptualUnderstanding: 'Clear explanation', technicalCorrectness: 'Correct', clarityOfExplanation: 'Clear', practicalApplication: 'Practical', encouragement: 'Keep practicing', matchedConcepts: ['scope'], missingConcepts: [], actionableTips: [], evaluatorType: 'rubric-benchmark' };
    const tier1Attempt = { id: 'tier1-cloud-1', questionId: 't1-js-01', timestamp: new Date().toISOString(), candidateAnswer: 'Block scope with let and const.', evaluation, mode: 'practice', timeSpentSeconds: 10 };
    const sqlAttempt = { id: 'sql-cloud-1', questionId: 'sql-t1-01', tier: 'tier-1', timestamp: new Date().toISOString(), mode: 'coding', candidateSql: 'SELECT 1;', scoreOutOf100: 90, passed: true, timeSpentSeconds: 10 };
    for (let i = 0; i < 2; i++) {
      expect((await page.request.post('/api/progress/tier1', { headers: mutationHeaders, data: { attempt: tier1Attempt } })).ok()).toBeTruthy();
      expect((await page.request.post('/api/progress/sql', { headers: mutationHeaders, data: { attempt: sqlAttempt } })).ok()).toBeTruthy();
    }
    const progress = await (await page.request.get('/api/progress')).json();
    expect(progress.tier1Progress.attempts).toHaveLength(1);
    expect(progress.tier1Progress.totalScore).toBe(90);
    expect(progress.sqlProgress.tier1.attempts).toHaveLength(1);
    expect(progress.sqlProgress.totalQuestionsCompleted).toBe(1);
    expect((await page.request.get('/api/progress/sql?userId=another-user')).status()).toBe(400);
    expect((await page.request.post('/api/progress/sql', { headers: mutationHeaders, data: { attempt: { ...sqlAttempt, tier: 'invalid-tier' } } })).status()).toBe(422);
    expect((await page.request.delete('/api/progress/tier1', { headers: mutationHeaders })).ok()).toBeTruthy();
    expect((await (await page.request.get('/api/progress/tier1')).json()).attempts).toHaveLength(0);
    expect((await (await page.request.get('/api/progress/sql')).json()).tier1.attempts).toHaveLength(1);
  } finally { await cleanup(); }
});
