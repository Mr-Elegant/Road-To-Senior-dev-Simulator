import { test, expect } from '@playwright/test';
import { signInTestAccount } from './support/account';

test('Enterprise Labs navigation opens three honest project overviews and working exercise links', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Enterprise Labs', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Enterprise Labs', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enterprise Labs', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('14 hands-on exercises', { exact: true })).toBeVisible();
  for (const title of ['Loan Operations', 'Commerce Operations', 'Multi-Tenant SaaS']) {
    await page.getByRole('link', { name: `Open ${title} lab`, exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    if (title === 'Loan Operations') {
      await expect(page.getByRole('link', { name: 'Open dashboard', exact: true })).toHaveAttribute('href', '/challenges/loan-management');
      await expect(page.getByText('0 of 8 exercises passed', { exact: true })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Project exercises' }).getByRole('listitem')).toHaveCount(8);
    } else {
      await expect(page.getByText('This collection currently focuses on coding exercises.', { exact: false })).toBeVisible();
      const exercises = page.getByRole('region', { name: 'Project exercises' });
      await expect(exercises.getByRole('listitem')).toHaveCount(3);
      await exercises.getByRole('link').first().click();
      await expect(page.getByRole('button', { name: 'Submit & Evaluate', exact: true })).toBeVisible();
      await page.goBack();
    }
    await page.getByRole('link', { name: 'All enterprise labs', exact: true }).click();
  }
  await page.goto('/enterprise-labs/not-a-project');
  await expect(page.getByRole('heading', { name: /not found|404/i }).first()).toBeVisible();
});

test('project progress reuses a catalog submission without creating separate history', async ({ page }) => {
  await page.goto('/challenge/commerce-inventory-reservations');
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('button', { name: /Level 3 \/ 3/ })).toHaveCount(2);
  for (const button of await page.getByRole('button', { name: /Level 3 \/ 3/ }).all()) await button.click();
  await page.getByRole('button', { name: 'Save & Record Attempt', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goto('/enterprise-labs/commerce-operations');
  await expect(page.getByText('1 of 3 exercises passed', { exact: true })).toBeVisible();
  await expect(page.getByText('Best score: 100% · Passed', { exact: true })).toBeVisible();
  await page.getByRole('region', { name: 'Project exercises' }).getByRole('link').first().click();
  await expect(page).toHaveURL('/challenge/commerce-inventory-reservations');
});

test('loan project progress uses the existing full-suite submission and stays account scoped', async ({ page }) => {
  test.setTimeout(90000);
  const cleanup = await signInTestAccount(page);
  try {
    await page.goto('/enterprise-labs/loan-operations');
    await page.getByRole('region', { name: 'Project exercises' }).getByRole('link').first().click();
    await expect(page.getByRole('heading', { name: 'Keep the newest search result', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Reveal reference fix', exact: true }).click();
    await page.getByRole('button', { name: 'Load reference into editor', exact: true }).click();
    const saved = page.waitForResponse(response => response.url().endsWith('/api/progress/attempt') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Submit fix', exact: true }).click();
    expect((await saved).status()).toBe(200);
    await page.goto('/enterprise-labs/loan-operations');
    await expect(page.getByText('1 of 8 exercises passed', { exact: true })).toBeVisible();
    await expect(page.getByText('Best score: 100% · Passed', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Logout', exact: true }).click();
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/enterprise-labs/loan-operations');
    await expect(page.getByText('0 of 8 exercises passed', { exact: true })).toBeVisible();
    await expect(page.getByText('Best score: 100% · Passed', { exact: true })).toHaveCount(0);
  } finally { await cleanup(); }
});

test('project navigation and content fit mobile and desktop in both themes', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/enterprise-labs');
    await expect(page.getByRole('heading', { name: 'Enterprise Labs', exact: true })).toBeVisible();
    if (width === 320) {
      await page.getByRole('button', { name: 'Toggle navigation menu', exact: true }).click();
      await page.getByRole('link', { name: 'Enterprise Labs', exact: true }).click();
      await expect(page.getByText('Navigation Menu', { exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const slug of ['loan-operations', 'commerce-operations', 'multi-tenant-saas']) {
      await page.goto(`/enterprise-labs/${slug}`);
      await expect(page.getByRole('heading', { name: 'Project exercises', exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Multi-Tenant SaaS', exact: true })).toBeVisible();
  await page.screenshot({ path: '.playwright-mcp/enterprise-project-desktop.png', fullPage: true });
  await page.goto('/enterprise-labs');
  await expect(page.getByRole('heading', { name: 'Enterprise Labs', exact: true })).toBeVisible();
  await page.screenshot({ path: '.playwright-mcp/enterprise-hub-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 1000 });
  await expect(page.getByRole('link', { name: 'Open Loan Operations lab', exact: true })).toBeVisible();
  await page.screenshot({ path: '.playwright-mcp/enterprise-hub-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
