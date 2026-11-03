const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { entries, generate } = require('../../scripts/practice/catalog.cjs');

test('every authored collection is included with unique stable paths', () => {
  const counts = Object.fromEntries(['catalog', 'loan', 'sql', 'beginner', 'coding'].map(group =>
    [group, entries.filter(e => e.group === group).length]));
  assert.deepEqual(counts, { catalog: 81, loan: 8, sql: 120, beginner: 63, coding: 6 });
  assert.equal(new Set(entries.map(e => e.key)).size, entries.length);
  assert.ok(entries.every(e => /^[a-z0-9-]+\/[a-z0-9-]+$/.test(e.key)));
});

test('refresh preserves candidate work, adds missing files, and removes no files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-practice-'));
  try {
    generate(root);
    const exercise = entries.find(e => e.mode === 'javascript');
    const file = path.join(root, exercise.key, exercise.filename);
    fs.writeFileSync(file, '// My own work');
    const notes = path.join(root, exercise.key, 'answer.md');
    fs.writeFileSync(notes, 'My investigation');
    generate(root);
    assert.equal(fs.readFileSync(file, 'utf8'), '// My own work');
    assert.equal(fs.readFileSync(notes, 'utf8'), 'My investigation');
    for (const entry of entries) {
      assert.ok(fs.existsSync(path.join(root, entry.key, 'README.md')), entry.key);
      assert.ok(fs.existsSync(path.join(root, entry.key, 'reference.md')), entry.key);
      assert.ok(fs.existsSync(path.join(root, entry.key, entry.filename)), entry.key);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
