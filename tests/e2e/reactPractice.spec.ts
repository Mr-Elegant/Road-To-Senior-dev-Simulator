import { test, expect, type Page } from '@playwright/test';
import { reactPracticeScenarios } from '../../src/data/scenarios/reactPractice';

async function replaceCode(page: Page, code: string) {
  const editor = page.locator('.monaco-editor').getByRole('textbox', { name: 'Editor content', exact: true });
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code.replace(/\n\s*/g, ' '));
}

test('beginner React UI exercises are discoverable and fit mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/library?topic=React');
  await page.getByPlaceholder(/Search challenges/i).fill('React UI:');
  for (const s of reactPracticeScenarios) await expect(page.getByRole('heading', { name: s.title, exact: true })).toBeVisible();
  await page.goto('/challenge/react-ui-theme-switch');
  await replaceCode(page, reactPracticeScenarios.find(s => s.id === 'react-ui-theme-switch')!.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const frame = page.frameLocator('iframe[title="React component preview"]');
  await expect(frame.getByText('Dark appearance', { exact: true })).toBeVisible();
  await frame.getByRole('button', { name: 'Toggle appearance' }).click();
  await expect(frame.getByText('Light appearance', { exact: true })).toBeVisible();
  await page.screenshot({ path: '.playwright-mcp/react-ui-mobile.png' });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Close component preview' }).click();
  await expect(page.getByRole('button', { name: 'Preview', exact: true })).toBeFocused();
});

for (const scenario of reactPracticeScenarios) test(`React UI starter and reference: ${scenario.id}`, async ({ page }) => {
  await page.goto(`/challenge/${scenario.id}`);
  await expect(page.getByRole('heading', { name: scenario.title, exact: true })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Test results', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
  const passing = `${scenario.testCases!.length} / ${scenario.testCases!.length} Tests Passed`;
  await expect(summary).toBeVisible({ timeout: 30000 });
  await expect(summary).not.toHaveText(passing);
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Re-run', exact: true }).click();
  await expect(summary).toHaveText(passing, { timeout: 30000 });
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await expect(summary).toHaveCount(0);
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.frameLocator('iframe[title="React component preview"]').locator('#root')).not.toBeEmpty();
  if (scenario.id === 'react-ui-tag-editor') await page.screenshot({ path: '.playwright-mcp/react-ui-tag-editor.png' });
  await page.getByRole('button', { name: 'Close component preview' }).click();
  await expect(page.getByRole('region', { name: 'Component preview' })).toHaveCount(0);
});

test('preview cannot access the host DOM and reports unsupported imports without breaking the editor', async ({ page }) => {
  await page.goto('/challenge/react-ui-theme-switch');
  await replaceCode(page, `export default function App() { let result='unexpected access'; try { parent.document.title; } catch { result='Host DOM blocked'; } return <p>{result}</p>; }`);
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const frame = page.frameLocator('iframe[title="React component preview"]');
  await expect(frame.getByText('Host DOM blocked')).toBeVisible();
  await expect(page.locator('iframe[title="React component preview"]')).toHaveAttribute('sandbox', 'allow-scripts allow-forms');
  await page.getByRole('button', { name: 'Close component preview' }).click();
  await replaceCode(page, `import missing from 'not-installed'; export default function App() { return <p>{missing}</p>; }`);
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Only react and react/jsx-runtime imports' })).toBeVisible();
  await page.getByRole('button', { name: 'Close component preview' }).click();
  await expect(page.locator('.monaco-editor')).toBeVisible();
});

test('syntax errors fail journeys and a corrected answer can be rerun', async ({ page }) => {
  await page.goto('/challenge/react-ui-project-progress');
  await replaceCode(page, 'export default function App( {');
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
  await expect(summary).toHaveText('0 / 6 Tests Passed', { timeout: 30000 });
  await replaceCode(page, reactPracticeScenarios.find(s => s.id === 'react-ui-project-progress')!.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Re-run', exact: true }).click();
  await expect(summary).toHaveText('6 / 6 Tests Passed', { timeout: 30000 });
});

test('React submissions require current test evidence and save its score independently of rubric selection', async ({ page }) => {
  await page.goto('/challenge/react-ui-project-progress');
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toHaveText('Run tests on the current code before submitting this React exercise.');
  await replaceCode(page, reactPracticeScenarios.find(s => s.id === 'react-ui-project-progress')!.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  await expect(page.getByText('6 / 6 Tests Passed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await page.getByRole('button', { name: /Level 0 \/ 3/ }).click();
  await expect(page.getByText('Recorded test score: 100%', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save & Record Attempt' }).click();
  await expect(page.getByRole('dialog', { name: 'Staff Reference Benchmark & Solution' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fullstack_interview_lab_progress_v1')!).attempts.at(-1));
  expect(saved.totalScorePercentage).toBe(100);
  expect(saved.passedTestsCount).toBe(6);
  expect(saved.rubricScores[0].score).toBe(0);
  await page.getByRole('button', { name: 'Close reference solution' }).click();
  await replaceCode(page, 'export default function App() { return <p>Edited answer</p>; }');
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toHaveText('Run tests on the current code before submitting this React exercise.');
});

test('native form navigation is blocked by CSP even with submit events enabled', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', request => { if (request.url().startsWith('https://blocked.invalid/')) outgoing.push(request.url()); });
  await page.goto('/challenge/react-ui-loan-estimator');
  await replaceCode(page, 'export default function App() { return <form action="https://blocked.invalid/submit" method="post"><button>Try navigation</button><p>Preview remains mounted</p></form>; }');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const frame = page.frameLocator('iframe[title="React component preview"]');
  await frame.getByRole('button', { name: 'Try navigation' }).click();
  await expect(frame.getByText('Preview remains mounted')).toBeVisible();
  expect(outgoing).toEqual([]);
});
