const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

test('asset cache skips unchanged work and invalidates changed inputs or missing/modified outputs', async () => {
  const { inspectAssetCache } = await import('../../scripts/runtime-asset-cache.mjs');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'practice-asset-cache-'));
  const input = path.join(root, 'source.ts'), output = path.join(root, 'runtime.js'), manifest = path.join(root, 'cache.json');
  try {
    await fs.writeFile(input, 'initial'); await fs.writeFile(output, 'bundle');
    const first = await inspectAssetCache(manifest, [input], [output]);
    assert.equal(first.current, false); await first.save();
    assert.equal((await inspectAssetCache(manifest, [input], [output])).current, true);
    await fs.writeFile(input, 'changed input');
    const changed = await inspectAssetCache(manifest, [input], [output]);
    assert.equal(changed.current, false); await changed.save();
    await fs.writeFile(output, 'modified output');
    assert.equal((await inspectAssetCache(manifest, [input], [output])).current, false);
    await fs.unlink(output);
    assert.equal((await inspectAssetCache(manifest, [input], [output])).current, false);
  } finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('practice-asset-cache-'));
    await fs.rm(root, { recursive: true, force: true });
  }
});
