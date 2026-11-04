const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { exerciseKey, migrateFolders, selectEntries } = require('../../scripts/practice/paths.cjs');

function temporary(run) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'practice-paths-'));
  try { run(directory); } finally {
    assert.equal(path.dirname(directory), os.tmpdir());
    assert.ok(path.basename(directory).startsWith('practice-paths-'));
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

const entry = { group: 'beginner', id: 't1-hc-01', title: 'Semantic HTML', category: 'HTML and CSS', language: 'html',
  difficulty: 'Beginner', key: 'beginner/semantic-html--t1-hc-01', legacyKey: 'beginner/t1-hc-01' };

test('opaque IDs gain safe readable titles; descriptive IDs stay unchanged', () => {
  assert.equal(exerciseKey('beginner', 't1-hc-01', 'Semantic HTML?'), entry.key);
  assert.equal(exerciseKey('catalog', 'react-ts-accordion', 'Accordion'), 'catalog/react-ts-accordion');
  assert.equal(exerciseKey('sql', 'sql-tier3-001', 'B-Tree Index Internals'), 'sql/b-tree-index-internals--sql-tier3-001');
  assert.match(exerciseKey('sql', 'sql-t1-01', '../SELECT / WHERE: "Rows"'), /^sql\/select-where-rows--sql-t1-01$/);
});

test('old IDs and paths resolve exactly; multiword topic searches work', () => {
  for (const query of [entry.id, entry.key, entry.legacyKey, 'html css', 'semantic beginner']) {
    assert.deepEqual(selectEntries([entry], query), [entry]);
  }
  assert.deepEqual(selectEntries([entry], 'postgres'), []);
});

test('renaming preserves solutions, notes and custom files, and is repeatable', () => temporary(root => {
  const old = path.join(root, entry.legacyKey);
  fs.mkdirSync(old, { recursive: true });
  for (const file of ['answer.md', 'solution.html', 'my-notes.txt']) fs.writeFileSync(path.join(old, file), `my work: ${file}`);
  fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify([{ ...entry, key: entry.legacyKey }]));
  assert.equal(migrateFolders(root, [entry]).length, 1);
  assert.equal(fs.existsSync(old), false);
  for (const file of ['answer.md', 'solution.html', 'my-notes.txt']) assert.equal(fs.readFileSync(path.join(root, entry.key, file), 'utf8'), `my work: ${file}`);
  assert.equal(migrateFolders(root, [entry]).length, 0);
}));

test('a conflict aborts the whole preflight without moving other folders', () => temporary(root => {
  const other = { ...entry, id: 't1-hc-02', legacyKey: 'beginner/t1-hc-02', key: 'beginner/other--t1-hc-02' };
  for (const key of [other.legacyKey, entry.legacyKey, entry.key]) fs.mkdirSync(path.join(root, key), { recursive: true });
  assert.throws(() => migrateFolders(root, [other, entry]), /Both old and renamed/);
  assert.ok(fs.existsSync(path.join(root, other.legacyKey)));
  assert.equal(fs.existsSync(path.join(root, other.key)), false);
  assert.throws(() => migrateFolders(root, [{ ...entry, key: '../outside' }]), /Unsafe/);
}));
