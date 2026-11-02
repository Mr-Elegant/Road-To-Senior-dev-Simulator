import { test, expect } from '@playwright/test';

test('challenge editor fills the workspace until results are requested and restores space when closed', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/challenge/commerce-inventory-reservations');
  await expect(page.getByRole('heading', { name: 'E-commerce: Stop Overselling the Last Item', exact: true })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  const results = page.getByRole('region', { name: 'Test results', exact: true });
  await expect(results).toHaveCount(0);
  await expect(page.getByText('Test Runner Ready', { exact: true })).toHaveCount(0);
  const editor = page.locator('.monaco-editor');
  await expect(editor).toBeVisible();
  const initialHeight = (await editor.boundingBox())!.height;
  expect(initialHeight).toBeGreaterThan(500);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true);
  await page.screenshot({ path: '.playwright-mcp/challenge-editor-full-height.png' });
  await editor.getByRole('textbox', { name: 'Editor content', exact: true }).focus();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.insertText('\n// workspace-layout-check');
  const run = page.getByRole('button', { name: 'Run Tests', exact: true });
  await run.click();
  await expect(results).toBeVisible();
  await expect(results.getByText(/\d+ \/ 7 Tests Passed/, { exact: true })).toBeVisible();
  await expect.poll(async () => (await editor.boundingBox())!.height).toBeLessThan(initialHeight - 100);
  await page.screenshot({ path: '.playwright-mcp/challenge-test-results-open.png' });
  await results.getByRole('button', { name: 'Close test results', exact: true }).click();
  await expect(results).toHaveCount(0);
  await expect(run).toBeFocused();
  await expect(editor.locator('.view-lines')).toContainText('workspace-layout-check');
  await expect.poll(async () => (await editor.boundingBox())!.height).toBe(initialHeight);
  await run.click();
  await expect(results.getByText(/\d+ \/ 7 Tests Passed/, { exact: true })).toBeVisible();
  await results.getByRole('button', { name: 'Close test results', exact: true }).click();
  await page.getByTitle('Back to Challenge Library', { exact: true }).click();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('mobile challenge layout keeps the editor and closable test results reachable', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/challenge/commerce-inventory-reservations');
    await expect(page.getByRole('heading', { name: 'E-commerce: Stop Overselling the Last Item', exact: true })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
    expect((await editor.boundingBox())!.height).toBeGreaterThan(150);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true);
    await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
    const results = page.getByRole('region', { name: 'Test results', exact: true });
    await expect(results.getByText(/\d+ \/ 7 Tests Passed/, { exact: true })).toBeVisible();
    const close = results.getByRole('button', { name: 'Close test results', exact: true });
    await expect(close).toBeInViewport();
    const closeBounds = (await close.boundingBox())!;
    expect(closeBounds.x + closeBounds.width).toBeLessThanOrEqual(width);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 375) await page.screenshot({ path: '.playwright-mcp/challenge-mobile-results-open.png' });
    await close.click();
    await expect(results).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Run Tests', exact: true })).toBeInViewport();
    if (width === 375) await page.screenshot({ path: '.playwright-mcp/challenge-mobile-editor.png' });
  }
});
