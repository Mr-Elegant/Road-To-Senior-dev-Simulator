import { test, expect, type Page } from '@playwright/test';
import { signInTestAccount } from './support/account';
import { loanLabExercises } from '../../src/data/loanLabExercises';

async function replaceCode(page: Page, code: string) {
  const editor = page.locator('[aria-label="Bug fix code editor"] .monaco-editor');
  await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.getByRole('textbox', { name: 'Editor content', exact: true }).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

test('a candidate reproduces, edits, submits and revisits a loan bug fix', async ({ page }) => {
  test.setTimeout(90000);
  const cleanup = await signInTestAccount(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto('/challenges/loan-management');
    await page.getByRole('button', { name: 'Start bug-fixing lab', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Keep the newest search result', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Reference fix', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByRole('heading', { name: '0/2 tests passed · Sample run', exact: true })).toBeVisible({ timeout: 15000 });
    await replaceCode(page, `// saved-loan-draft\n${loanLabExercises[0].referenceCode}`);
    await expect(page.getByRole('region', { name: 'Bug fix test results', exact: true })).toHaveCount(0);
    await page.reload();
    await page.getByRole('button', { name: 'Start bug-fixing lab', exact: true }).click();
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('saved-loan-draft');
    const saved = page.waitForResponse((response) => response.url().endsWith('/api/progress/attempt') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Submit fix', exact: true }).click();
    await expect(page.getByRole('heading', { name: '5/5 tests passed · Full submission', exact: true })).toBeVisible({ timeout: 15000 });
    expect((await saved).status()).toBe(200);
    await expect(page.getByText('Best submitted score: 100% · current draft is checked separately.', { exact: true })).toBeVisible();
    const history = await (await page.request.get('/api/progress')).json();
    const attempt = history.attempts.find((item: { scenarioId: string }) => item.scenarioId === 'loan-lab:bug-1-race-condition');
    expect(attempt.submittedCode).toContain('saved-loan-draft');
    expect(attempt.interviewAnswers['loanLab.assisted']).toBe('false');
    expect(attempt.passedTestsCount).toBe(5);
    await page.getByRole('region', { name: 'Loan dashboard bug fixing lab', exact: true }).screenshot({ path: '.playwright-mcp/loan-bug-lab-desktop.png' });
    await page.goto('/progress');
    await expect(page.getByText('Loan bug lab: Keep the newest search result', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Review', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Keep the newest search result', exact: true })).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Reset starter', exact: true }).click();
    await expect(page.locator('.monaco-editor .view-lines')).not.toContainText('saved-loan-draft');
    await expect(page.getByText('Best submitted score: 100% · current draft is checked separately.', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  } finally { await cleanup(); }
});

test('loan code drafts remain isolated between signed-in accounts', async ({ page }) => {
  test.setTimeout(90000);
  const firstCleanup = await signInTestAccount(page);
  let secondCleanup: (() => Promise<void>) | undefined;
  try {
    await page.goto('/challenges/loan-management?bug=bug-1-race-condition');
    await replaceCode(page, '// first-account-only\n' + loanLabExercises[0].referenceCode);
    const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    expect((await page.request.post('/api/auth/sign-out', { headers: { Origin: origin } })).status()).toBe(200);
    secondCleanup = await signInTestAccount(page);
    await page.reload();
    await expect(page.locator('.monaco-editor .view-lines')).not.toContainText('first-account-only');
    await expect(page.getByRole('heading', { name: 'Keep the newest search result', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByRole('heading', { name: '0/2 tests passed · Sample run', exact: true })).toBeVisible({ timeout: 15000 });
  } finally { await secondCleanup?.(); await firstCleanup(); }
});

test('all eight reference fixes execute in the real browser and assisted submissions are attributed', async ({ page }) => {
  test.setTimeout(120000);
  const cleanup = await signInTestAccount(page);
  try {
    await page.goto('/challenges/loan-management?bug=bug-1-race-condition');
    for (let index = 0; index < loanLabExercises.length; index++) {
      const exercise = loanLabExercises[index];
      if (index) await page.getByRole('navigation', { name: 'Bug fixing exercises', exact: true }).getByRole('button').nth(index).click();
      await expect(page.getByRole('heading', { name: exercise.title, exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Reveal reference fix', exact: true }).click();
      await page.getByRole('button', { name: 'Load reference into editor', exact: true }).click();
      const saved = page.waitForResponse((response) => response.url().endsWith('/api/progress/attempt') && response.request().method() === 'POST');
      await page.getByRole('button', { name: 'Submit fix', exact: true }).click();
      await expect(page.getByRole('heading', { name: `${exercise.tests.length}/${exercise.tests.length} tests passed · Full submission`, exact: true })).toBeVisible({ timeout: 15000 });
      expect((await saved).status()).toBe(200);
      await expect(page.getByText('Full test submission recorded in your progress.', { exact: true })).toBeVisible();
    }
    await expect.poll(async () => {
      const progress = await (await page.request.get('/api/progress')).json();
      return progress.attempts.filter((item: { scenarioId: string }) => item.scenarioId.startsWith('loan-lab:')).length;
    }).toBe(8);
    const history = await (await page.request.get('/api/progress')).json();
    const attempts = history.attempts.filter((item: { scenarioId: string }) => item.scenarioId.startsWith('loan-lab:'));
    expect(attempts.every((item: { interviewAnswers: Record<string, string>; totalScorePercentage: number }) => item.interviewAnswers['loanLab.assisted'] === 'true' && item.totalScorePercentage === 100)).toBe(true);
  } finally { await cleanup(); }
});

test('blocking code times out, cancellation removes the runner and syntax errors remain recoverable', async ({ page }) => {
  test.setTimeout(90000);
  const cleanup = await signInTestAccount(page);
  try {
    await page.goto('/challenges/loan-management?bug=bug-1-race-condition');
    await replaceCode(page, 'function reduceSearch(state, action) { while (true) {} }');
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByText(/Execution timed out \(1500 ms\)/)).toBeVisible({ timeout: 15000 });
    await expect(page.locator('iframe[title="Isolated loan exercise runner"]')).toHaveCount(0);
    await replaceCode(page, 'function reduceSearch(state, action) { while (true) {} }');
    await page.getByRole('button', { name: 'Submit fix', exact: true }).click();
    await page.getByRole('button', { name: 'Stop tests', exact: true }).click();
    await expect(page.getByText('Test run stopped. No attempt was recorded.', { exact: true })).toBeVisible();
    await expect(page.locator('iframe[title="Isolated loan exercise runner"]')).toHaveCount(0);
    await replaceCode(page, 'function reduceSearch( {');
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByRole('heading', { name: '0/2 tests passed · Sample run', exact: true })).toBeVisible({ timeout: 15000 });
    await replaceCode(page, 'function reduceSearch(state, action) { while (true) {} }');
    await page.getByRole('button', { name: 'Submit fix', exact: true }).click();
    await page.getByRole('navigation', { name: 'Bug fixing exercises', exact: true }).getByRole('button').nth(1).click();
    await expect(page.getByRole('heading', { name: loanLabExercises[1].title, exact: true })).toBeVisible();
    await expect(page.locator('iframe[title="Isolated loan exercise runner"]')).toHaveCount(0);
    const progress = await (await page.request.get('/api/progress')).json();
    expect(progress.attempts.filter((item: { scenarioId: string }) => item.scenarioId.startsWith('loan-lab:'))).toHaveLength(0);
  } finally { await cleanup(); }
});

test('loan code executes without parent DOM, storage or network access and mobile controls remain usable', async ({ page }) => {
  test.setTimeout(90000);
  const cleanup = await signInTestAccount(page);
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/challenges/loan-management?bug=bug-1-race-condition');
    const probeCode = `function reduceSearch(state, action) {
      let parentAccess;
      try { parentAccess = parent.document.cookie; } catch { parentAccess = 'blocked'; }
      let network;
      try { importScripts('https://example.invalid/loan-lab-probe.js'); network = 'allowed'; } catch { network = 'blocked'; }
      return { documentType: typeof document, storageType: typeof localStorage, parentAccess, network };
    }`.replace(/\n\s*/g, ' ');
    await replaceCode(page, probeCode);
    await expect.poll(() => page.evaluate(() => {
      const key = Object.keys(localStorage).find((item) => item.startsWith('fullstack_loan_lab_v1:bug-1-race-condition'));
      return key ? JSON.parse(localStorage.getItem(key)!).code : null;
    })).toBe(probeCode);
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    const results = page.getByRole('region', { name: 'Bug fix test results', exact: true });
    await expect(results).toContainText('"documentType": "undefined"', { timeout: 15000 });
    await expect(results).toContainText('"storageType": "undefined"');
    await expect(results).toContainText('"parentAccess": "blocked"');
    await expect(results).toContainText('"network": "blocked"');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Reveal reference fix', exact: true }).click();
    await page.getByRole('button', { name: 'Load reference into editor', exact: true }).click();
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByRole('heading', { name: '2/2 tests passed · Sample run', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByLabel('Choose a bug to fix', { exact: true }).selectOption('bug-2-duplicate-api-calls');
    await expect(page.getByRole('heading', { name: loanLabExercises[1].title, exact: true })).toBeVisible();
    await page.getByLabel('Choose a bug to fix', { exact: true }).selectOption('bug-1-race-condition');
    await page.getByRole('button', { name: 'Run sample tests', exact: true }).click();
    await expect(page.getByRole('heading', { name: '2/2 tests passed · Sample run', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByRole('region', { name: 'Loan dashboard bug fixing lab', exact: true }).screenshot({ path: '.playwright-mcp/loan-bug-lab-mobile.png' });
  } finally { await cleanup(); }
});
