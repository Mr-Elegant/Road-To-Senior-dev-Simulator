const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { entries, generate } = require('./catalog.cjs');
const { root } = require('./load-source.cjs');
const practice = path.join(root, 'practice');

function select(query) {
  if (!query || query === 'all') return entries;
  const exact = entries.filter(e => e.key === query || e.id === query);
  if (exact.length) return exact;
  return entries.filter(e => `${e.key} ${e.title}`.toLowerCase().includes(query.toLowerCase()));
}

function test(selected, reference = false) {
  let failed = 0, passed = 0, guided = 0;
  for (const entry of selected) {
    if (entry.mode === 'guided') { guided++; continue; }
    const file = path.join(practice, entry.key, entry.filename);
    const code = reference ? entry.reference?.code ?? entry.reference?.codeOrArtifact : fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined;
    if (code === undefined) { console.error(`FAIL ${entry.key}: missing solution; run npm run practice:generate`); failed++; continue; }
    const child = spawnSync(process.execPath, [path.join(__dirname, 'worker.cjs')], {
      input: JSON.stringify({ entry, code }), encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024,
      cwd: root,
    });
    if (child.error || child.status !== 0) {
      console.error(`FAIL ${entry.key}: ${child.error?.message ?? child.stderr}`); failed++; continue;
    }
    let result;
    try { result = JSON.parse(child.stdout); }
    catch { console.error(`FAIL ${entry.key}: runner returned invalid output`); failed++; continue; }
    for (const item of result.results) {
      if (item.passed) passed++; else failed++;
      console.log(`${item.passed ? 'PASS' : 'FAIL'} ${entry.key}: ${item.name}${item.error ? `\n  ${item.error}` : ''}`);
    }
    if (!result.results.length) { console.error(`FAIL ${entry.key}: no cases executed`); failed++; }
  }
  console.log(`\n${passed} cases passed; ${failed} failed; ${guided} guided exercises (manual review, not a test pass).`);
  return failed ? 1 : 0;
}

const [command = 'list', query, ...flags] = process.argv.slice(2);
const selected = select(query);
if (command === 'generate') console.log(`Prepared ${generate()} exercises. Existing solutions and answers preserved.`);
else if (!selected.length) { console.error(`No exercise matches: ${query}`); process.exitCode = 1; }
else if (command === 'list') {
  for (const e of selected) console.log(`${e.key.padEnd(63)} ${e.mode.padEnd(12)} ${e.title}`);
  console.log(`\n${selected.length} exercises. Open practice/INDEX.md for links.`);
} else if (command === 'test') process.exitCode = test(selected, flags.includes('--reference'));
else if (command === 'watch') {
  if (!query || selected.length !== 1 || selected[0].mode === 'guided') {
    console.error('Watch requires one executable exercise ID or collection/ID.'); process.exitCode = 1;
  } else {
    const file = path.join(practice, selected[0].key, selected[0].filename);
    if (!fs.existsSync(file)) { console.error('Run npm run practice:generate first.'); process.exitCode = 1; }
    else {
      test(selected);
      console.log(`Watching ${path.relative(root, file)}. Press Ctrl+C to stop.`);
      // watchFile survives editor atomic-save renames on Windows.
      fs.watchFile(file, { interval: 300 }, (current, previous) => { if (current.mtimeMs !== previous.mtimeMs) test(selected); });
    }
  }
} else { console.error(`Unknown command: ${command}`); process.exitCode = 1; }
