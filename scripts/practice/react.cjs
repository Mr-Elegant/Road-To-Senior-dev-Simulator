const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { root } = require('./load-source.cjs');

// Verification can share the browser process; every case still gets a fresh page/context.
async function runReact(entry, code, sharedBrowser) {
  if (entry.source.reactTypescriptExercise) {
    const errors = require('./react-typescript.cjs').checkTypescript(code);
    if (errors.length) return { key: entry.key, results: entry.source.testCases.map(test => ({ name: test.name, passed: false, error: errors.join('\n') })) };
  }
  const runtimePath = path.join(root, 'public/react-practice-runtime.js');
  if (!fs.existsSync(runtimePath)) {
    const build = spawnSync(process.execPath, [path.join(root, 'scripts/build-react-runtime.mjs')], { cwd: root, encoding: 'utf8', timeout: 30000 });
    if (build.status !== 0) throw new Error(`React runtime build failed: ${build.stderr}`);
  }
  const runtime = fs.readFileSync(runtimePath, 'utf8');
  const { reactFrameDocument, REACT_FRAME_SANDBOX } = require('../../src/lib/reactPractice/runner.ts');
  const { chromium } = require('@playwright/test');
  let browser = sharedBrowser;
  try {
    if (!browser) browser = await chromium.launch({ headless: true });
  } catch (error) {
    throw new Error(`Chromium is required for React DOM tests. Run npx playwright install chromium. ${error.message}`);
  }
  const results = [];
  try {
    for (const test of entry.source.testCases) {
      const page = await browser.newPage();
      let timer;
      try {
        await page.setContent('<!doctype html><html><body></body></html>');
        await page.evaluate(({ html, sandbox }) => {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('sandbox', sandbox); iframe.srcdoc = html; document.body.appendChild(iframe);
        }, { html: reactFrameDocument(), sandbox: REACT_FRAME_SANDBOX });
        const iframe = await page.$('iframe');
        const frame = await iframe.contentFrame();
        await frame.waitForSelector('#root', { state: 'attached' });
        const reply = await Promise.race([
          frame.evaluate(async ({ runtime, code, journey, typescript }) => {
            const execute = new Function(runtime + ';return ReactPractice.execute;')();
            return await execute(code, journey, typescript);
          }, { runtime, code, journey: JSON.parse(test.inputDescription), typescript: Boolean(entry.source.reactTypescriptExercise) }),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('React DOM case exceeded 8 seconds.')), 8000); }),
        ]);
        results.push({ name: test.name, passed: reply.passed === true, error: reply.error });
      } catch (error) { results.push({ name: test.name, passed: false, error: error.message }); }
      finally { clearTimeout(timer); await page.close(); }
    }
  } finally { if (!sharedBrowser) await browser.close(); }
  return { key: entry.key, results };
}
module.exports = { runReact };
