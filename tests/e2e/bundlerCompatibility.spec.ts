import { test, expect } from '@playwright/test';

async function replaceEditorText(page: import('@playwright/test').Page, code: string) {
  const editor = page.locator('.monaco-editor').first();
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

test('SQL playground executes PostgreSQL WASM and AlaSQL queries through Monaco', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/sql');
  await page.getByRole('button', { name: 'SQL Sandbox & Playground' }).click();
  await replaceEditorText(page, `SELECT '{"ready":true}'::jsonb ->> 'ready' AS pg_ready;`);
  await page.getByRole('button', { name: 'Run Query', exact: true }).click();
  await expect(page.getByText('Success (1 rows)', { exact: true })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('cell', { name: 'true', exact: true })).toBeVisible();
  await expect(page.getByText('Engine: PGlite (Postgres)', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'AlaSQL (Generic)', exact: true }).click();
  await replaceEditorText(page, 'SELECT 42 AS bundler_probe;');
  await page.getByRole('button', { name: 'Run Query', exact: true }).click();
  await expect(page.getByText('Engine: AlaSQL', { exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '42', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('JavaScript editor changes execute in the browser practice runner', async ({ page }) => {
  await page.goto('/practice');
  await replaceEditorText(page, 'function solution() { return "bundler-probe"; }');
  await page.getByRole('button', { name: /Run Code/ }).click();
  await expect(page.getByText('Test Execution Results', { exact: false })).toBeVisible();
  await expect(page.getByText('bundler-probe', { exact: true }).first()).toBeVisible();
});
