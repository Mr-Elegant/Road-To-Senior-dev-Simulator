import { test, expect } from '@playwright/test';
import { commerceScenarios } from '../../src/data/scenarios/commerce';
import { saasScenarios } from '../../src/data/scenarios/saas';

test('commerce and SaaS challenges are discoverable in the existing catalog', async ({ page }) => {
  await page.goto('/library');
  const search = page.getByPlaceholder(/Search challenges/i);
  await search.fill('E-commerce');
  for (const scenario of commerceScenarios) {
    await expect(page.getByRole('heading', { name: scenario.title, exact: true })).toBeVisible();
  }
  await search.fill('SaaS');
  for (const scenario of saasScenarios) {
    await expect(page.getByRole('heading', { name: scenario.title, exact: true })).toBeVisible();
  }
  await page.getByRole('heading', { name: saasScenarios[0].title, exact: true }).click();
  await expect(page).toHaveURL(`/challenge/${saasScenarios[0].id}`);
});

test('all six business challenges reproduce bugs and execute reference solutions in the browser', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const scenario of [...commerceScenarios, ...saasScenarios]) {
    await page.goto(`/challenge/${scenario.id}`);
    await expect(page.getByRole('heading', { name: scenario.title, exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
    const total = scenario.testCases!.length;
    const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
    await expect(summary).toBeVisible();
    await expect(summary).not.toHaveText(`${total} / ${total} Tests Passed`);

    const editor = page.locator('.monaco-editor').getByRole('textbox', { name: 'Editor content', exact: true });
    await expect(editor).toBeVisible({ timeout: 30000 });
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+A');
    // A single paste avoids editor autoindent changing the trusted reference.
    await page.keyboard.insertText(scenario.referenceSolution.codeOrArtifact!.replace(/\n\s*/g, ' '));
    await page.getByRole('button', { name: 'Re-run', exact: true }).click();
    await expect(summary).toHaveText(`${total} / ${total} Tests Passed`);

    await page.getByRole('button', { name: 'Reference Solution', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(scenario.referenceSolution.explanation, { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  }
  expect(errors).toEqual([]);
});
