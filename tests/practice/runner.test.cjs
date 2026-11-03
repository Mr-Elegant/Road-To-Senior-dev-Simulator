const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { entries } = require('../../scripts/practice/catalog.cjs');
const { javascriptCase, run } = require('../../scripts/practice/execute.cjs');
const { runReact } = require('../../scripts/practice/react.cjs');
let referenceBrowser;
after(async () => { if (referenceBrowser) await referenceBrowser.close(); });

test('compiles real TypeScript, awaits asynchronous results, and compares all fields', async () => {
  await javascriptCase('async function solution(n: number): Promise<{n:number}> { return {n}; }', { inputDescription: '7', expectedOutput: '{"n":7}' });
  await assert.rejects(javascriptCase('function solution(){return {n:7}}', { inputDescription: '7', expectedOutput: '{"n":7,"other":true}' }));
  await assert.rejects(javascriptCase('function solution(){return "pass"}', { inputDescription: 'null', expectedOutput: 'passing' }));
  await javascriptCase('function solution(){return "20"}', { inputDescription: 'null', expectedOutput: '20' });
  // Frontend contracts preserve scalar types and distinguish runtime validation from malformed code.
  await assert.rejects(javascriptCase('function solution(){return "20"}', { inputDescription: 'null', expectedOutput: '20' }, undefined, true));
  const validation = { inputDescription: '[]', expectedOutput: 'Throws: Empty array', expectedError: 'Empty array' };
  await javascriptCase('function solution(){throw new Error("Empty array")}', validation, undefined, true);
  await assert.rejects(javascriptCase('function solution(){return null}', validation, undefined, true));
  await assert.rejects(javascriptCase('function solution( {', validation, undefined, true));
});

test('terminates synchronous loops and reports malformed candidates', async () => {
  await assert.rejects(javascriptCase('function solution(){while(true){}}', { inputDescription: 'null', expectedOutput: 'null' }), /timed out/);
  await assert.rejects(javascriptCase('function solution( {', { inputDescription: 'null', expectedOutput: 'null' }));
});

test('guided review never becomes an automated correctness pass', async () => {
  const entry = entries.find(e => e.mode === 'guided');
  assert.deepEqual(await run(entry, ''), { key: entry.key, guided: true, results: [] });
});

test('a separate process can terminate code that loops after awaiting', () => {
  const result = spawnSync(process.execPath, [path.resolve(__dirname, '../../scripts/practice/worker.cjs')], {
    input: JSON.stringify({ entry: { key: 'test/loop', mode: 'javascript', source: { testCases: [{ name: 'loop', inputDescription: 'null', expectedOutput: 'null' }] } }, code: 'async function solution(){ await Promise.resolve(); while(true){} }' }),
    encoding: 'utf8', timeout: 3000,
  });
  assert.equal(result.error?.code, 'ETIMEDOUT');
});

for (const entry of entries.filter(e => e.mode !== 'guided')) {
  test(`authored reference: ${entry.key}`, { timeout: 60000 }, async () => {
    const code = entry.reference.code ?? entry.reference.codeOrArtifact;
    if (entry.mode === 'react' && !referenceBrowser) referenceBrowser = await require('@playwright/test').chromium.launch({ headless: true });
    const result = entry.mode === 'react' ? await runReact(entry, code, referenceBrowser) : await run(entry, code);
    assert.ok(result.results.length > 0);
    assert.deepEqual(result.results.filter(r => !r.passed), [], entry.key);
  });
}

test('all fourteen business and loan starters have a reproducible failure', async () => {
  for (const entry of entries.filter(e => e.group === 'loan' || /^(commerce|saas)-/.test(e.id))) {
    const result = await run(entry, entry.starter);
    assert.ok(result.results.some(r => !r.passed), entry.key);
  }
});
