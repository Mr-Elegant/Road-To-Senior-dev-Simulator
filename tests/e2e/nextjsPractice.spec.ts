import { test, expect, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { nextjsPracticeScenarios } from '../../src/data/nextjsPractice';

async function replaceCode(page: Page, code: string) {
  const editor = page
    .locator('.monaco-editor')
    .getByRole('textbox', { name: 'Editor content', exact: true });
  await expect(editor).toBeVisible({ timeout: 60000 });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

test('Next.js hub exposes all 110 challenges and version/level/mode filters on small and large screens', async ({
  page,
}) => {
  // The public, read-only hub must remain usable during a stalled session read.
  await page.route('**/api/auth/get-session**',async route=>{
    await new Promise(resolve=>setTimeout(resolve,10000));
    await route.fulfill({status:200,contentType:'application/json',body:'null'}).catch(()=>{});
  });
  await page.goto('/nextjs');
  const region = page.getByRole('region', {
    name: 'Next.js challenges',
    exact: true,
  });
  await expect(region.getByRole('article')).toHaveCount(110);
  expect(
    (
      await region
        .getByRole('link')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    ).sort(),
  ).toEqual(nextjsPracticeScenarios.map((s) => '/challenge/' + s.id).sort());
  await page
    .getByRole('combobox', { name: 'Level', exact: true })
    .selectOption('Staff/Principal');
  await expect(region.getByRole('article')).toHaveCount(20);
  await page
    .getByRole('button', { name: 'Reset filters', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Version scope', exact: true })
    .selectOption('15');
  await expect(region.getByRole('article')).toHaveCount(
    nextjsPracticeScenarios.filter(
      (s) => s.nextjsPractice!.versions !== '16-only',
    ).length,
  );
  await page
    .getByRole('combobox', { name: 'Practice mode', exact: true })
    .selectOption('policy');
  await expect(region.getByRole('article')).toHaveCount(20);
  await page
    .getByRole('button', { name: 'Reset filters', exact: true })
    .click();
  for (const width of [320, 375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.getByRole('searchbox').fill('not-a-real-nextjs-topic');
  await expect(
    page.getByRole('heading', { name: 'No matching challenges' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Reset filters', exact: true })
    .click();
  await page.getByRole('searchbox').fill('next-lab-proxy-migration');
  await expect(region.getByRole('article')).toHaveCount(1);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.setViewportSize({width:320,height:900});
  const menu=page.getByRole('button',{name:'Toggle navigation menu',exact:true});
  await menu.click();
  await expect(page.getByRole('link',{name:/Next\.js Engineering Lab/})).toHaveAttribute('href','/nextjs');
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await menu.click();
  await page.screenshot({path:'.playwright-mcp/nextjs-hub-mobile.png'});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({ path: '.playwright-mcp/nextjs-hub.png' });
});

test('all 20 policy references pass exact Worker cases and all starters fail', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto('/nextjs');
  const bundle = await build({
    entryPoints: ['src/lib/frontendPractice/runner.ts'],
    bundle: true,
    write: false,
    format: 'iife',
    globalName: 'NextjsPolicyTestRunner',
    platform: 'browser',
  });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const failures: string[] = [];
  for (const scenario of nextjsPracticeScenarios.filter(
    (s) => s.javascriptExercise,
  ))
    for (const reference of [true, false]) {
      const result = await page.evaluate(
        async ({ scenario, reference }) => {
          const runner = (
            window as unknown as {
              NextjsPolicyTestRunner: { runFrontendFunctions: Function };
            }
          ).NextjsPolicyTestRunner;
          return runner.runFrontendFunctions(
            scenario,
            reference
              ? scenario.referenceSolution.codeOrArtifact
              : scenario.starterCode,
            new AbortController().signal,
          );
        },
        { scenario, reference },
      );
      if (
        reference
          ? result.passedTests !== result.totalTests
          : result.passedTests === result.totalTests
      )
        failures.push(scenario.id + ': ' + JSON.stringify(result));
    }
  expect(failures).toEqual([]);
});

test('Next.js policy uses the real editor and current-code submission guard', async ({
  page,
}) => {
  test.setTimeout(90000);
  const scenario = nextjsPracticeScenarios.find(
    (s) => s.id === 'next-lab-query-pagination',
  )!;
  await page.goto('/challenge/' + scenario.id);
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Executable application-policy model' }),
  ).toBeVisible();
  await replaceCode(page, scenario.referenceSolution.codeOrArtifact!);
  await page.getByRole('button', { name: 'Run Tests', exact: true }).click();
  await expect(
    page.getByText('5 / 5 Tests Passed', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Close test results', exact: true })
    .click();
  await replaceCode(page, 'function solution(){return null;}');
  await page
    .getByRole('button', { name: 'Submit & Evaluate', exact: true })
    .click();
  await expect(page.getByRole('alert').filter({hasText:'Run tests on the current code'})).toContainText(
    'Run tests on the current code',
  );
});

test('framework reviews show 15/16 notes, accept findings and reveal corrected code', async ({
  page,
}) => {
  await page.goto('/challenge/next-lab-async-route-params');
  await expect(
    page.getByRole('heading', {
      name: 'Framework review — real-server checks required',
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/Synchronous params access is removed/),
  ).toBeVisible();
  await page
    .getByPlaceholder(
      'Explain the defect, security threat or bug, and describe the required fix...',
    )
    .fill(
      'Await promised params and update the route prop type; synchronous compatibility is removed in 16.',
    );
  await page
    .getByRole('button', { name: 'Attach Review Comment', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Reference Solution', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Reference Code / Artifact', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(
    'const {id}=await params',
  );
});

test('architect exercise opens its existing design workspace and detailed reference', async ({
  page,
}) => {
  await page.goto('/challenge/next-lab-commerce-consistency');
  await expect(
    page.getByRole('heading', {
      name: 'Architecture — design and evidence review',
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Reference Solution', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(
    'atomic inventory reservations',
  );
  await page
    .getByRole('button', { name: 'Reference Code / Artifact', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText('Failure and recovery');
});
