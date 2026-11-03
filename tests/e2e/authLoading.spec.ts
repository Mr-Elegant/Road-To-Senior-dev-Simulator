import { test, expect } from '@playwright/test';
import { commerceScenarios } from '../../src/data/scenarios/commerce';

function session(id: string) {
  return { user: { id, name: id, email: `${id}@example.test`, emailVerified: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    session: { id: `test-${id}`, userId: id, token: 'synthetic-test-token', expiresAt: '2099-01-01T00:00:00Z', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' } };
}
const progress = (id: string) => ({ attempts: [], bookmarkedScenarioIds: [id], streakDays: 0, lastActiveDate: '', customNotes: {} });

test('a stalled session read has a deadline even with SDK cancellation enabled', async ({ page }) => {
  let release!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/auth/get-session**', async route => { await blocked; await route.fulfill({ json: null }); });
  try {
    await page.goto('/library');
    await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/Search challenges/i)).toBeVisible({ timeout: 19000 });
  } finally { release(); }
});

test('signup and navigation remain usable while the initial session request waits', async ({ page }) => {
  let release!: () => void;
  const wait = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/auth/get-session**', async route => { await wait; await route.fulfill({ json: null }); });
  try {
    await page.goto('/signup');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 1500 });
    await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeVisible();
    await page.locator('input[type="email"]').fill('draft@example.test');
    const response = page.waitForResponse(r => r.url().includes('/api/auth/get-session'));
    release(); await response;
    await expect(page.locator('input[type="email"]')).toHaveValue('draft@example.test');
  } finally { release(); }
});

test('anonymous session refresh preserves a history-dependent library workspace', async ({ page }) => {
  let release!: () => void;
  let count = 0;
  const wait = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/auth/get-session**', async route => {
    if (++count > 1) await wait;
    await route.fulfill({ json: null });
  });
  try {
    await page.goto('/library');
    const search = page.getByPlaceholder(/Search challenges/i);
    await expect(search).toBeVisible();
    await search.fill('commerce');
    await search.evaluate(el => el.setAttribute('data-original-dom', 'yes'));
    const refreshing = page.waitForRequest(r => r.url().includes('/api/auth/get-session'));
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await refreshing;
    await expect(search).toHaveValue('commerce');
    await expect(search).toHaveAttribute('data-original-dom', 'yes');
    const response = page.waitForResponse(r => r.url().includes('/api/auth/get-session'));
    release(); await response;
    await expect(search).toHaveValue('commerce');
    await expect(search).toHaveAttribute('data-original-dom', 'yes');
  } finally { release(); }
});

test('anonymous session refresh preserves the open form and its DOM', async ({ page }) => {
  let release!: () => void;
  let count = 0;
  const wait = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/auth/get-session**', async route => {
    if (++count > 1) await wait;
    await route.fulfill({ json: null });
  });
  try {
    await page.goto('/signup');
    const email = page.locator('input[type="email"]');
    await expect(email).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    await email.fill('keep-my-draft@example.test');
    await email.evaluate(el => el.setAttribute('data-original-dom', 'yes'));
    const refreshing = page.waitForRequest(r => r.url().includes('/api/auth/get-session'));
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await refreshing;
    await expect(email).toHaveValue('keep-my-draft@example.test');
    await expect(email).toHaveAttribute('data-original-dom', 'yes');
    await expect(page.getByText('Loading your workspace…', { exact: true })).not.toBeVisible();
    const response = page.waitForResponse(r => r.url().includes('/api/auth/get-session'));
    release(); await response;
    await expect(email).toHaveValue('keep-my-draft@example.test');
    await expect(email).toHaveAttribute('data-original-dom', 'yes');
  } finally { release(); }
});

test('rapid account changes cannot render or merge another account history', async ({ page }) => {
  let who = 'alice';
  let release!: () => void;
  let requested!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  const bobRequested = new Promise<void>(resolve => { requested = resolve; });
  await page.route('**/api/auth/get-session**', route => route.fulfill({ json: session(who) }));
  await page.route('**/api/progress', async route => {
    const owner = who;
    if (owner === 'bob') { requested(); await blocked; }
    await route.fulfill({ json: progress(commerceScenarios[owner === 'alice' ? 0 : 1].id) });
  });
  const refresh = () => page.evaluate(() => window.dispatchEvent(new StorageEvent('storage', {
    key: 'better-auth.message', newValue: JSON.stringify({ event: 'session', data: { trigger: 'test-account-change' } }),
  })));
  try {
    await page.goto('/library?filter=bookmarked');
    await expect(page.getByRole('heading', { name: commerceScenarios[0].title, exact: true })).toBeVisible();
    who = 'bob'; await refresh(); await bobRequested;
    await expect(page.getByText('Loading account history…', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: commerceScenarios[0].title, exact: true })).not.toBeVisible();
    who = 'alice'; await refresh();
    await expect(page.getByRole('heading', { name: commerceScenarios[0].title, exact: true })).toBeVisible();
    const lateResponse = page.waitForResponse(r => r.url().endsWith('/api/progress'));
    release(); await lateResponse;
    await expect(page.getByRole('heading', { name: commerceScenarios[1].title, exact: true })).not.toBeVisible();
    const cache = await page.evaluate(() => localStorage.getItem('fullstack_interview_lab_progress_v1:user:alice'));
    expect(JSON.parse(cache!).bookmarkedScenarioIds).toEqual([commerceScenarios[0].id]);
  } finally { release(); }
});

test('stalled history leaves navigation usable and falls back to device history', async ({ page }) => {
  let release!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/auth/get-session**', route => route.fulfill({ json: session('alice') }));
  await page.route('**/api/progress', async route => { await blocked; await route.fulfill({ json: progress(commerceScenarios[1].id) }); });
  await page.addInitScript(data => localStorage.setItem('fullstack_interview_lab_progress_v1:user:alice', JSON.stringify(data)), progress(commerceScenarios[0].id));
  try {
    await page.goto('/library?filter=bookmarked');
    await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: commerceScenarios[0].title, exact: true })).toBeVisible({ timeout: 12000 });
    await expect(page.getByText(/Account history could not be loaded/)).toBeVisible();
    await expect(page.getByRole('heading', { name: commerceScenarios[1].title, exact: true })).not.toBeVisible();
  } finally { release(); }
});
