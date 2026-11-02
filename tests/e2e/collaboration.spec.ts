import { test, expect } from '@playwright/test';
import { collaborationScenarios } from '../../src/data/scenarios/collaboration';

test('collaboration project is discoverable and usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/enterprise-labs');
  await page.getByRole('link', { name: 'Open Real-Time Collaboration lab', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Real-Time Collaboration', exact: true })).toBeVisible();
  const exercises = page.getByRole('region', { name: 'Project exercises' });
  await expect(exercises.getByRole('listitem')).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/library');
  await page.getByPlaceholder(/Search challenges/i).fill('Collaboration:');
  for (const s of collaborationScenarios) await expect(page.getByRole('heading', { name: s.title, exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/enterprise-labs/real-time-collaboration');
  await expect(page.getByText('0 of 8 exercises passed', { exact: true })).toBeVisible();
  await page.screenshot({ path: '.playwright-mcp/collaboration-project.png', fullPage: true });
});

for (const s of collaborationScenarios) test(`collaboration starter and reference: ${s.id}`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`/challenge/${s.id}`);
  await expect(page.getByRole('heading', { name: s.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
  const passing = `${s.testCases!.length} / ${s.testCases!.length} Tests Passed`;
  await expect(summary).toBeVisible();
  await expect(summary).not.toHaveText(passing);
  const editor = page.locator('.monaco-editor').getByRole('textbox', { name: 'Editor content', exact: true });
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(s.referenceSolution.codeOrArtifact!.replace(/\n\s*/g, ' '));
  await page.getByRole('button', { name: 'Re-run', exact: true }).click();
  await expect(summary).toHaveText(passing);
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await expect(summary).not.toBeVisible();
  expect(errors).toEqual([]);
});
