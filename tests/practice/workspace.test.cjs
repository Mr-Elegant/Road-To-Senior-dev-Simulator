const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { entries, generate } = require('../../scripts/practice/catalog.cjs');
const { selectEntries } = require('../../scripts/practice/paths.cjs');

test('every authored collection is included with unique stable paths', () => {
  const counts = Object.fromEntries(['catalog', 'loan', 'sql', 'beginner', 'coding'].map(group =>
    [group, entries.filter(e => e.group === group).length]));
  assert.deepEqual(counts, { catalog: 499, loan: 8, sql: 120, beginner: 63, coding: 6 });
  assert.equal(new Set(entries.map(e => e.key)).size, entries.length);
  assert.ok(entries.every(e => /^[a-z0-9-]+\/[a-z0-9-]+$/.test(e.key)));
  for (const entry of entries) assert.deepEqual(selectEntries(entries, entry.legacyKey), [entry]);
});

test('refresh preserves candidate work, adds missing files, and removes no files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-practice-'));
  try {
    generate(root);
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8')).compilerOptions.strict, true);
    const exercise = entries.find(e => e.mode === 'javascript');
    const file = path.join(root, exercise.key, exercise.filename);
    fs.writeFileSync(file, '// My own work');
    const notes = path.join(root, exercise.key, 'answer.md');
    fs.writeFileSync(notes, 'My investigation');
    const review = entries.find(entry=>entry.source.nextjsPractice?.mode==='framework-review');
    const reviewFile = path.join(root,review.key,'working',review.source.codeReviewFiles[0].filename);
    fs.writeFileSync(reviewFile,'// My corrected Next.js review');
    generate(root);
    assert.equal(fs.readFileSync(file, 'utf8'), '// My own work');
    assert.equal(fs.readFileSync(notes, 'utf8'), 'My investigation');
    assert.equal(fs.readFileSync(reviewFile,'utf8'),'// My corrected Next.js review');
    assert.ok(fs.existsSync(path.join(root,review.key,'reference-files',review.source.codeReviewFiles[0].filename)));
    for (const entry of entries) {
      assert.ok(fs.existsSync(path.join(root, entry.key, 'README.md')), entry.key);
      assert.ok(fs.existsSync(path.join(root, entry.key, 'reference.md')), entry.key);
      assert.ok(fs.existsSync(path.join(root, entry.key, entry.filename)), entry.key);
    }
    for (const relative of ['INDEX.md', ...['catalog', 'loan', 'sql', 'beginner', 'coding'].map(group => `${group}/README.md`)]) {
      const guide = path.join(root, relative);
      const text = fs.readFileSync(guide, 'utf8');
      assert.match(text, /```mermaid/);
      for (const [, link] of text.matchAll(/\]\(([^)]+)\)/g)) {
        // The root README is maintained separately, not emitted into temporary generation directories.
        if (link === '../README.md') continue;
        assert.ok(fs.existsSync(path.resolve(path.dirname(guide), link)), `${relative}: ${link}`);
      }
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
