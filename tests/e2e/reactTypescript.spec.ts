import { test, expect, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { reactTypescriptScenarios, reactTypescriptTopics } from '../../src/data/reactTypescript';
import { reactFrameDocument } from '../../src/lib/reactPractice/runner';
import { frontendExercises } from '../../src/data/frontendPractice/exercises';

async function replaceCode(page: Page, code: string) {
  const editor = page.locator('.monaco-editor').getByRole('textbox', { name: 'Editor content', exact: true });
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(code);
}

test('React + TypeScript module lists all 113 copies and fits mobile/desktop', async ({ page }) => {
  await page.goto('/react-typescript');
  const questions = page.getByRole('region', { name: 'Frontend questions', exact: true });
  await expect(questions.getByRole('article')).toHaveCount(113);
  for (const width of [320, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: '.playwright-mcp/react-typescript-desktop.png' });
  await page.getByRole('combobox', { name: 'Difficulty', exact: true }).selectOption('Hard');
  await expect(questions.getByRole('article')).toHaveCount(14);
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('searchbox').fill('not-a-topic-xyz');
  await expect(page.getByRole('heading', { name: 'No matching questions' })).toBeVisible();
  await page.goto('/frontend-practice');
  await expect(page.getByRole('link', { name: /React \+ TypeScript practice/ })).toBeVisible();
});

test('all 113 TSX references pass all 379 original DOM cases and all starters fail', async ({ page }) => {
  test.setTimeout(240000);
  const runtime = readFileSync('public/react-practice-runtime.js', 'utf8');
  await page.goto('/react-typescript');
  // Types are checked separately for every reference and fixture. This exercises the actual opaque-frame TSX runtime.
  const failures = await page.evaluate(async ({ scenarios, runtime, html }) => {
    const failures: string[] = [];
    for (const scenario of scenarios) {
      let starterFailures = 0;
      for (const reference of [true, false]) for (const fixture of scenario.testCases!) {
        const iframe = document.createElement('iframe'); iframe.sandbox.add('allow-scripts', 'allow-forms'); iframe.style.cssText = 'position:fixed;left:-10000px;width:800px;height:600px;opacity:0;pointer-events:none'; iframe.srcdoc = html;
        const channel = new MessageChannel();
        try {
          const reply = await new Promise<{ passed: boolean; error?: string }>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('DOM case did not respond')), 8000);
            channel.port1.onmessage = ({ data }) => {
              if (data.ready) channel.port1.postMessage({ runtime, code: reference ? scenario.referenceSolution.codeOrArtifact : scenario.starterCode, journey: JSON.parse(fixture.inputDescription), typescript: true });
              else { clearTimeout(timer); resolve(data); }
            };
            iframe.onload = () => iframe.contentWindow!.postMessage('react-practice-init', '*', [channel.port2]); document.body.appendChild(iframe);
          });
          if (reference && !reply.passed) failures.push(`${scenario.id}: ${fixture.name}: ${reply.error}`);
          if (!reference && !reply.passed) starterFailures++;
        } finally { iframe.remove(); channel.port1.close(); channel.port2.close(); }
      }
      if (!starterFailures) failures.push(`${scenario.id}: starter unexpectedly passed`);
    }
    return failures;
  }, { scenarios: reactTypescriptScenarios, runtime, html: reactFrameDocument() });
  expect(failures).toEqual([]);
});

for (const difficulty of ['Beginner', 'Mid-Level', 'Senior']) test(`TSX workspace, compiler and preview: ${difficulty}`, async ({ page }) => {
  test.setTimeout(60000);
  const scenario = reactTypescriptScenarios.find(item => item.difficulty === difficulty)!;
  await page.goto(`/challenge/${scenario.id}`);
  await expect(page.getByText('solution.tsx', { exact: true })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact! + '\nconst invalid: number = "wrong";');
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
  await expect(summary).toHaveText(`0 / ${scenario.testCases!.length} Tests Passed`, { timeout: 30000 });
  await expect(page.getByText(/TS2322/).first()).toBeVisible();
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Re-run', exact: true }).click();
  await expect(summary).toHaveText(`${scenario.testCases!.length} / ${scenario.testCases!.length} Tests Passed`, { timeout: 30000 });
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.frameLocator('iframe[title="React component preview"]').locator('#root')).not.toBeEmpty({ timeout: 30000 });
  if (difficulty === 'Beginner') {
    await expect(page.locator('.monaco-editor .squiggly-error')).toHaveCount(0, { timeout: 15000 });
    await page.screenshot({ path: '.playwright-mcp/react-typescript-workspace.png' });
  }
});

test('all typed topic links resolve and unknown topics show the not-found boundary', async ({ request, page }) => {
  test.setTimeout(90000);
  for (const topic of reactTypescriptTopics) {
    const response = await request.get(`/react-typescript/${topic.slug}`, { maxRedirects: 0 });
    if (response.status() === 307) expect(response.headers().location).toBe(`/challenge/${topic.scenarioId}`);
    else expect(await response.text()).toContain(`NEXT_REDIRECT;replace;/challenge/${topic.scenarioId};`);
  }
  await page.goto('/react-typescript/not-a-topic');
  await expect(page.getByRole('heading', { name: /404.*Resource Not Found/ })).toBeVisible();
});

test('browser compiler cancels, rejects any and accepts strict TSX', async ({ page }) => {
  await page.goto('/react-typescript');
  const bundle = await build({ entryPoints: ['src/lib/reactTypescript/runner.ts'], bundle: true, write: false, platform: 'browser', format: 'iife', globalName: 'TypedRunner' });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const result = await page.evaluate(async () => {
    const runner = (window as unknown as { TypedRunner: { checkReactTypes: (code: string, signal: AbortSignal) => Promise<string[]> } }).TypedRunner;
    const invalid = await runner.checkReactTypes('export default function App(props:any){return <p/>}', new AbortController().signal);
    const controller = new AbortController();
    const pending = runner.checkReactTypes('export default function App(){return <p/>}', controller.signal); controller.abort();
    let cancelled = false; try { await pending; } catch (error) { cancelled = (error as Error).name === 'AbortError'; }
    return { invalid, cancelled };
  });
  expect(result.invalid.join(' ')).toContain('Explicit any'); expect(result.cancelled).toBe(true);
});

test('TypeScript attempts save under the copy ID and require current-code evidence', async ({ page }) => {
  test.setTimeout(60000);
  const scenario = reactTypescriptScenarios.find(item => item.id === 'react-ts-progress-bar')!;
  await page.goto(`/challenge/${scenario.id}`);
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toBeVisible();
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  await expect(page.getByText('6 / 6 Tests Passed', { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByText('Recorded test score: 100%', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save & Record Attempt' }).click();
  await expect(page.getByRole('dialog', { name: 'Staff Reference Benchmark & Solution' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fullstack_interview_lab_progress_v1')!).attempts);
  expect(saved).toHaveLength(1); expect(saved[0].scenarioId).toBe(scenario.id); expect(saved[0].totalScorePercentage).toBe(100);
  await page.getByRole('button', { name: 'Close reference solution' }).click();
  await replaceCode(page, scenario.starterCode!);
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toBeVisible();
});

for (const typed of [false, true]) test(`native focus cases work in the ${typed ? 'TSX' : 'JSX'} workspace`, async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(`/challenge/${typed ? 'react-ts' : 'frontend'}-focus-input`);
  const code = typed ? reactTypescriptScenarios.find(item => item.id === 'react-ts-focus-input')!.referenceSolution.codeOrArtifact! : frontendExercises['focus-input'].reference;
  await replaceCode(page, code);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  await expect(page.getByText('3 / 3 Tests Passed', { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Run Tests', exact: true })).toBeFocused();
});
