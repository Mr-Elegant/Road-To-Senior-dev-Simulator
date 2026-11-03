const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { ts } = require('./load-source.cjs');

function expectedValue(value) {
  try { return JSON.parse(value); } catch { return value; }
}

async function javascriptCase(code, test, loan) {
  const timers = new Set();
  const immediates = new Set();
  const context = { exports: {}, console: { log() {}, info() {}, warn() {}, error() {} },
    setTimeout(fn, ms, ...args) { const timer = setTimeout(fn, ms, ...args); timers.add(timer); return timer; },
    clearTimeout,
    setImmediate(fn, ...args) { const timer = setImmediate(fn, ...args); immediates.add(timer); return timer; },
    clearImmediate,
  };
  const compiled = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  let expression;
  if (loan) {
    const { executeLoanLabCase } = require('../../src/lib/loanLab/harness.ts');
    expression = `(${executeLoanLabCase.toString()})(${loan.entryPoint}, ${JSON.stringify(loan.kind)}, ${JSON.stringify(test.input)})`;
  } else {
    expression = `(() => {
      const input = (${test.inputDescription});
      function freeze(value) {
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
          Object.values(value).forEach(freeze); Object.freeze(value);
        }
      }
      freeze(input);
      return (typeof solution === 'function' ? solution : typeof handler === 'function' ? handler : typeof solve === 'function' ? solve : typeof execute === 'function' ? execute : exports.solution)(input);
    })()`;
  }
  let deadline;
  try {
    const result = vm.runInNewContext(`"use strict";\n${compiled}\n${expression}`, context, { timeout: 1500 });
    const actual = await Promise.race([Promise.resolve(result), new Promise((_, reject) => {
      deadline = setTimeout(() => reject(new Error('Case exceeded 1500 ms')), 1500);
    })]);
    const normalized = actual === undefined ? undefined : JSON.parse(JSON.stringify(actual));
    let expected = loan ? test.expected : expectedValue(test.expectedOutput);
    // Legacy practice cases describe scalar outputs as untyped display strings.
    // Preserve exact text for string returns; objects/arrays still require every field.
    if (!loan && typeof normalized === 'string' && (expected === null || typeof expected === 'number' || typeof expected === 'boolean')) expected = test.expectedOutput;
    assert.deepEqual(normalized, expected);
  } finally {
    clearTimeout(deadline);
    for (const timer of timers) clearTimeout(timer);
    for (const timer of immediates) clearImmediate(timer);
  }
}

async function run(entry, code) {
  if (entry.mode === 'guided') return { key: entry.key, guided: true, results: [] };
  if (entry.mode === 'react') return require('./react.cjs').runReact(entry, code);
  const source = entry.source;
  const results = [];
  if (entry.mode === 'sql') {
    const { evaluateExecutableSql } = require('../../src/lib/evaluation/sqlEvaluator.ts');
    const outcome = await evaluateExecutableSql(code, source);
    for (const item of outcome.testCaseResults) results.push({ name: item.description, passed: item.passed, error: item.error ?? item.diffMessage });
  } else if (entry.mode === 'practice-sql') {
    const { runQueryAgainstDataset } = require('../../src/lib/evaluation/sqlEvaluator.ts');
    for (const test of source.testCases) {
      const setup = source.sqlSetup.map(s => `${s.schemaSql}\n${s.seedDataSql}`).join('\n') + '\n' + test.inputDescription;
      // Cohort date functions use generic SQL; window ranking requires PostgreSQL.
      const result = await runQueryAgainstDataset(code, undefined, setup, entry.dialect);
      try {
        assert.equal(result.error, undefined);
        assert.deepEqual(result.rows, JSON.parse(test.expectedOutput));
        results.push({ name: test.name, passed: true });
      } catch (error) { results.push({ name: test.name, passed: false, error: error.message }); }
    }
  } else if (entry.mode === 'python') {
    // The app currently has one Python exercise with an explicit TokenBucket contract.
    // Run each authored case with a fresh bucket; the local interpreter is optional.
    for (const test of source.testCases) {
      const script = `${code}\n\nimport json\nresult = TokenBucket(10, 2).${test.inputDescription}\nprint(json.dumps(result))\n`;
      const result = spawnSync(process.env.PRACTICE_PYTHON || 'python', ['-I', '-c', script], { encoding: 'utf8', timeout: 3000, maxBuffer: 65536 });
      const error = result.error?.message ?? (result.status !== 0 ? result.stderr : undefined);
      const expected = test.expectedOutput === 'True';
      let passed = false;
      try { passed = !error && JSON.parse(result.stdout.trim()) === expected; } catch { /* Report malformed output as a failed case. */ }
      results.push({ name: test.name, passed, error: error || (passed ? undefined : 'Output differs from expected boolean') });
    }
  } else {
    for (const test of source.testCases ?? source.tests) {
      try {
        await javascriptCase(code, test, entry.mode === 'loan' ? source : undefined);
        results.push({ name: test.name, passed: true });
      } catch (error) { results.push({ name: test.name, passed: false, error: error.message }); }
    }
  }
  return { key: entry.key, results };
}
module.exports = { run, javascriptCase };
