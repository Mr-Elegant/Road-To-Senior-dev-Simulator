import { test, expect, type Page } from '@playwright/test';
import { signInTestAccount } from './support/account';

async function respond(page: Page, action: string, reason: string) {
  await page.getByRole('radio', { name: action, exact: true }).check();
  await page.getByLabel('Decision rationale', { exact: true }).fill(reason);
  await page.getByRole('button', { name: 'Apply decision', exact: true }).click();
}

test('incident library, branching consequences, draft restore and complete written submission', async ({ page }) => {
  test.setTimeout(60000);
  const cleanup = await signInTestAccount(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto('/incidents');
    await expect(page.getByRole('heading', { name: 'Evolving production incidents', exact: true })).toBeVisible();
    await expect(page.getByText('Evolving · 3 stages', { exact: true })).toHaveCount(8);
    await page.getByRole('link', { name: 'Connection Storm: Autoscaling Makes Checkout Worse', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Connection budget exhausted', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Retry amplification arrives', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Complete all three developments' })).toBeVisible();

    await respond(page, 'Add more checkout pods immediately', 'I expect additional worker capacity to reduce waiting.');
    await expect(page.getByText('New pools multiply connection attempts; administrative connections also queue.', { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Advance to next event', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Retry amplification arrives', exact: true })).toBeVisible();
    await expect(page.getByText('Pool saturation now combines with a retry storm; extra workers cannot create database capacity.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Telemetry & written report', exact: true }).click();
    await page.getByLabel('1. Root-Cause Hypothesis', { exact: true }).fill('Fleet pools exceeded the usable PostgreSQL connection budget.');
    await page.getByLabel('2. Evidence Supporting Hypothesis', { exact: true }).fill('1200 possible connections versus 360 usable slots; retry ratio 5.1.');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Retry amplification arrives', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start simulation', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Decision journal' })).toContainText('additional worker capacity');
    await page.getByRole('button', { name: 'Telemetry & written report', exact: true }).click();
    await expect(page.getByLabel('2. Evidence Supporting Hypothesis', { exact: true })).toHaveValue(/1200 possible/);
    await page.getByRole('button', { name: 'Live response', exact: true }).click();

    await respond(page, 'Bound retries with jitter and deadlines; inspect old transactions', 'The retry ratio proves load amplification; bound attempts and inspect blockers.');
    await page.getByRole('button', { name: 'Advance to next event', exact: true }).click();
    await respond(page, 'Canary the pool budget, ramp traffic, and reconcile pending payments', 'Require sustained pool headroom and reconcile uncertain payment outcomes.');
    await expect(page.getByRole('heading', { name: 'Decision benchmark: 67/100', exact: true })).toBeVisible();
    await page.getByText('Review decision · harmful', { exact: true }).click();
    await expect(page.getByText(/This is a connection-budget failure rather than proof of a CPU shortage/)).toBeVisible();

    await page.getByRole('button', { name: 'Telemetry & written report', exact: true }).click();
    await page.getByLabel('3. Immediate Mitigation (Stabilization)', { exact: true }).fill('Cap pools and admission; reserve operational access.');
    await page.getByLabel('4. Permanent Architectural Correction', { exact: true }).fill('Budget pool size jointly with max replicas and cap retries.');
    await page.getByLabel('5. Regression Testing Strategy', { exact: true }).fill('Load test the maximum fleet size and inject database delay.');
    await page.getByLabel('6. Monitoring & Alerting Improvements', { exact: true }).fill('Monitor pool wait, total connections, attempt ratio and payment reconciliation.');
    await page.getByRole('button', { name: 'Submit & Evaluate', exact: true }).click();
    const savedResponse = page.waitForResponse((response) => response.url().endsWith('/api/progress/attempt') && response.request().method() === 'POST');
    await page.getByRole('button', { name: /Save & Record Attempt/ }).click();
    expect((await savedResponse).status()).toBe(200);
    await expect(page.getByText('Incident playbook', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recovery verification gates', exact: true })).toBeVisible();
    const progress = await page.request.get('/api/progress');
    const attempt = (await progress.json()).attempts.find((item: { scenarioId: string }) => item.scenarioId === 'incident-db-connection-storm');
    expect(attempt.interviewAnswers['incident.development-1']).toContain('Add more checkout pods');
    expect(attempt.interviewAnswers['incident.evidence']).toContain('1200 possible');
    expect(attempt.permanentFix).toContain('Budget pool size');
    expect(errors).toEqual([]);
  } finally { await cleanup(); }
});

test('missed developments expire, reference is explicit, and reset clears the saved draft', async ({ page }) => {
  await page.goto('/challenge/incident-kubernetes-probes');
  await expect(page.getByRole('heading', { name: 'Dependency failure becomes process failure', exact: true })).toBeVisible();
  await expect(page.getByText('Development-by-development decisions', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Advance to next event', exact: true }).click();
  await expect(page.getByText('Deadline passed without action', { exact: true })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'New pods need startup time', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Deadline passed without action', { exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Advance to next event', exact: true }).click();
  await page.getByRole('button', { name: 'Advance to next event', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Decision benchmark: 0/100', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reference Solution', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Staff Reference Benchmark & Solution', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close reference solution', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reference Solution', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Development-by-development decisions', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Kubernetes startup, readiness and liveness probes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close reference solution', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset workspace', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dependency failure becomes process failure', exact: true })).toBeVisible();
  await expect(page.getByText('Deadline passed without action', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start simulation', exact: true })).toBeVisible();
  await expect(page.getByText('Deadline passed without action', { exact: true })).toHaveCount(0);
});

test('mobile incident controls and written response remain reachable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/challenge/incident-payment-ambiguity');
  await page.getByRole('button', { name: 'Start simulation', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause simulation', exact: true })).toBeVisible();
  await expect(page.getByLabel('Simulation time')).not.toHaveText('00:00');
  await page.getByRole('button', { name: 'Pause simulation', exact: true }).click();
  await respond(page, 'Stop blind capture retries and mark uncertain orders pending', 'A timeout does not prove the charge failed.');
  await page.getByRole('button', { name: 'Telemetry & written report', exact: true }).click();
  await page.getByLabel('2. Evidence Supporting Hypothesis', { exact: true }).fill('cap_17 succeeded before the timeout.');
  await expect(page.getByLabel('2. Evidence Supporting Hypothesis', { exact: true })).toHaveValue('cap_17 succeeded before the timeout.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('incident drafts stay isolated between anonymous practice and an account', async ({ page }) => {
  await page.goto('/challenge/incident-cache-stampede');
  await respond(page, 'Flush all Redis keys to start clean', 'Anonymous draft choice.');
  const cleanup = await signInTestAccount(page);
  try {
    await page.reload();
    await expect(page.getByRole('region', { name: 'Decision journal' })).toContainText('No decisions recorded yet');
    await respond(page, 'Coalesce reads and shed excess load; serve safe stale catalog data', 'Account draft choice.');
    await expect(page.getByRole('region', { name: 'Decision journal' })).toContainText('Account draft choice.');
    const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    const signedOut = await page.request.post('/api/auth/sign-out', { headers: { Origin: origin } });
    expect(signedOut.status()).toBe(200);
    await page.reload();
    await expect(page.getByRole('region', { name: 'Decision journal' })).toContainText('Anonymous draft choice.');
    await expect(page.getByRole('region', { name: 'Decision journal' })).not.toContainText('Account draft choice.');
  } finally { await cleanup(); }
});

test('all eight evolving exercises launch and the existing static incident remains available', async ({ page }) => {
  test.setTimeout(60000);
  for (const id of ['incident-db-connection-storm', 'incident-cache-stampede', 'incident-migration-lock', 'incident-regional-failover', 'incident-payment-ambiguity', 'incident-kafka-poison-message', 'incident-kubernetes-probes', 'incident-tenant-cache-leak']) {
    await page.goto(`/challenge/${id}`);
    await expect(page.getByRole('group', { name: 'Choose your response', exact: true })).toBeVisible();
    await expect(page.getByRole('radio')).toHaveCount(3);
  }
  await page.goto('/library?type=incident');
  await expect(page.getByRole('link', { name: 'Connection Storm: Autoscaling Makes Checkout Worse', exact: true })).toBeVisible();
  await expect(page.locator('a[href="/challenge/js-event-loop-microtasks"]')).toHaveCount(0);
  await page.goto('/challenge/ops-production-memory-leak-debug');
  await expect(page.getByText('Incident Response Protocol (6 Pillars)', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start simulation', exact: true })).toHaveCount(0);
});
