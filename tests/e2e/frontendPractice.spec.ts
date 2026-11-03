import { test, expect, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { frontendPracticeTopics } from '../../src/data/frontendPractice';
import { frontendCodingScenarios } from '../../src/data/scenarios/frontendPractice';
import { frontendExercises } from '../../src/data/frontendPractice/exercises';
import { allScenarios } from '../../src/data';

async function replaceCode(page: Page, code: string) {
  const editor = page.locator('.monaco-editor').getByRole('textbox', { name: 'Editor content', exact: true });
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code.replace(/\n\s*/g, ' '));
}

test('all 203 questions are linked, filterable, and responsive', async ({ page }) => {
  await page.goto('/frontend-practice');
  const questions = page.getByRole('region', { name: 'Frontend questions', exact: true });
  await expect(questions.getByRole('article')).toHaveCount(203);
  const hrefs = await questions.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(hrefs.sort()).toEqual(frontendPracticeTopics.map(topic => `/frontend-practice/${topic.slug}`).sort());
  for (const width of [320, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('combobox', { name: 'Track', exact: true }).selectOption('React.js');
  await expect(questions.getByRole('article')).toHaveCount(113);
  await page.getByRole('combobox', { name: 'Difficulty', exact: true }).selectOption('Hard');
  await expect(questions.getByRole('article')).toHaveCount(14);
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('searchbox').fill('not-an-existing-topic-xyz');
  await expect(page.getByRole('heading', { name: 'No matching questions' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(questions.getByRole('article')).toHaveCount(203);
  await questions.getByRole('link').first().click();
  await expect(page).toHaveURL(`/challenge/${frontendPracticeTopics[0].scenarioId}`);
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
});

test('every JavaScript reference passes and every starter fails in the actual Worker sandbox', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('/frontend-practice');
  const bundle = await build({ entryPoints: ['src/lib/frontendPractice/runner.ts'], bundle: true, write: false, format: 'iife', globalName: 'FrontendTestRunner', platform: 'browser' });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const failures: string[] = [];
  for (const scenario of frontendCodingScenarios.filter(item => item.javascriptExercise)) {
    for (const reference of [true, false]) {
      const result = await page.evaluate(async ({ scenario, reference }) => {
        const runner = (window as unknown as { FrontendTestRunner: { runFrontendFunctions: Function } }).FrontendTestRunner;
        return runner.runFrontendFunctions(scenario, reference ? scenario.referenceSolution.codeOrArtifact : scenario.starterCode, new AbortController().signal);
      }, { scenario, reference });
      if (reference ? result.passedTests !== result.totalTests : result.passedTests === result.totalTests) failures.push(`${scenario.id} ${reference ? 'reference' : 'starter'}: ${JSON.stringify(result)}`);
    }
  }
  expect(failures).toEqual([]);
  await expect(page.locator('iframe[title="Frontend JavaScript test runner"]')).toHaveCount(0);
});

test('JavaScript errors, exact outputs, cancellation and CPU deadlines are enforced', async ({ page }) => {
  await page.goto('/frontend-practice');
  const bundle = await build({ entryPoints: ['src/lib/frontendPractice/runner.ts'], bundle: true, write: false, format: 'iife', globalName: 'FrontendTestRunner', platform: 'browser' });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const outcomes = await page.evaluate(async () => {
    const runner = (window as unknown as { FrontendTestRunner: { runFrontendFunctions: Function } }).FrontendTestRunner;
    const scenario = { testCases: [{ id: 'exact', name: 'exact', inputDescription: '{}', expectedOutput: '{"value":1}' }] };
    const run = (code: string, s = scenario) => runner.runFrontendFunctions(s, code, new AbortController().signal);
    const exact = await run('function solution(){return {value:1,extra:true}}');
    const errorScenario = { testCases: [{ id: 'error', name: 'error', inputDescription: '{}', expectedOutput: 'Throws: Invalid', expectedError: 'Invalid' }] };
    const runtimeError = await run('function solution(){throw new Error("Invalid")}', errorScenario);
    const compileError = await run('function solution( {', errorScenario);
    const timeout = await run('function solution(){while(true){}}');
    const isolation = await run('function solution(){return {value:typeof document==="undefined"&&typeof parent==="undefined"?1:0}}');
    const controller = new AbortController();
    const pending = runner.runFrontendFunctions(scenario, 'function solution(){while(true){}}', controller.signal);
    setTimeout(() => controller.abort(), 50);
    let cancelled = false;
    try { await pending; } catch (error) { cancelled = (error as Error).name === 'AbortError'; }
    return { exact, runtimeError, compileError, timeout, isolation, cancelled };
  });
  expect(outcomes.exact.passedTests).toBe(0);
  expect(outcomes.runtimeError.passedTests).toBe(1);
  expect(outcomes.compileError.passedTests).toBe(0);
  expect(outcomes.timeout.results[0].errorMessage).toContain('timed out');
  expect(outcomes.isolation.passedTests).toBe(1);
  expect(outcomes.cancelled).toBe(true);
  await expect(page.locator('iframe[title="Frontend JavaScript test runner"]')).toHaveCount(0);
});

test('new JavaScript workspace saves actual scores and requires current-code tests', async ({ page }) => {
  const scenario = frontendCodingScenarios.find(item => item.id === 'frontend-max-subarray')!;
  await page.goto('/frontend-practice/max-subarray');
  await expect(page).toHaveURL(`/challenge/${scenario.id}`);
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toBeVisible();
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  await expect(page.getByText('4 / 4 Tests Passed', { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Test results', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByText('Recorded test score: 100%', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save & Record Attempt' }).click();
  await expect(page.getByRole('dialog', { name: 'Staff Reference Benchmark & Solution' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fullstack_interview_lab_progress_v1')!).attempts.at(-1));
  expect(saved.totalScorePercentage).toBe(100);
  expect(saved.passedTestsCount).toBe(4);
  await page.getByRole('button', { name: 'Close reference solution' }).click();
  await replaceCode(page, 'function solution(){return 0;}');
  await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Run tests on the current code' })).toBeVisible();
});

for (const difficulty of ['Medium', 'Hard']) test(`new ${difficulty} React workspace runs real DOM cases and previews`, async ({ page }) => {
  const topic = frontendPracticeTopics.find(item => item.language === 'React.js' && item.difficulty === difficulty)!;
  const scenario = frontendCodingScenarios.find(item => item.id === topic.scenarioId)!;
  await page.goto(`/frontend-practice/${topic.slug}`);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  const summary = page.getByText(/\d+ \/ \d+ Tests Passed/, { exact: true });
  await expect(summary).toBeVisible();
  const passing = `${scenario.testCases!.length} / ${scenario.testCases!.length} Tests Passed`;
  await expect(summary).not.toHaveText(passing);
  await replaceCode(page, frontendExercises[topic.slug].reference);
  await page.getByRole('button', { name: 'Re-run', exact: true }).click();
  await expect(summary).toHaveText(passing, { timeout: 30000 });
  await page.getByRole('button', { name: 'Close test results', exact: true }).click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.frameLocator('iframe[title="React component preview"]').locator('#root')).not.toBeEmpty();
});

test('unknown frontend question renders the not-found boundary', async ({ page }) => {
  await page.goto('/frontend-practice/not-a-topic');
  await expect(page.getByRole('heading', { name: /404.*Resource Not Found/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('all 203 topic URLs resolve to their existing coding workspace', async ({ request }) => {
  test.setTimeout(120000);
  for (const topic of frontendPracticeTopics) {
    const response = await request.get(`/frontend-practice/${topic.slug}`, { maxRedirects: 0 });
    // Root loading.tsx can stream before redirect(), retaining HTTP 200.
    if (response.status() === 307) expect(response.headers().location, topic.slug).toBe(`/challenge/${topic.scenarioId}`);
    else {
      expect(response.status(), topic.slug).toBe(200);
      const body = await response.text();
      expect(body, topic.slug).toContain('NEXT_REDIRECT');
      expect(body, topic.slug).toContain(`/challenge/${topic.scenarioId}`);
    }
  }
});

test('all 113 React starters fail an actual authored DOM journey', async ({ page }) => {
  test.setTimeout(240000);
  await page.goto('/frontend-practice');
  const bundle = await build({ entryPoints: ['src/lib/reactPractice/runner.ts'], bundle: true, write: false, format: 'iife', globalName: 'ReactTestRunner', platform: 'browser' });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const failures: string[] = [];
  for (const topic of frontendPracticeTopics.filter(item => item.language === 'React.js')) {
    const scenario = allScenarios.find(item => item.id === topic.scenarioId)!;
    const result = await page.evaluate(async scenario => {
      const runner = (window as unknown as { ReactTestRunner: { runReactSuite: Function } }).ReactTestRunner;
      return runner.runReactSuite(scenario, scenario.starterCode, new AbortController().signal);
    }, scenario);
    if (result.passedTests === result.totalTests) failures.push(topic.slug);
  }
  expect(failures).toEqual([]);
});
