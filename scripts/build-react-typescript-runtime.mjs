import { build } from 'esbuild';
import { readFile, readdir, writeFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import path from 'node:path';

const require = createRequire(import.meta.url);
const directory = path.dirname(require.resolve('typescript/lib/typescript.js'));
const files = {};
for (const file of (await readdir(directory)).filter(file => /^lib.*\.d\.ts$/.test(file))) files[`/${file}`] = await readFile(path.join(directory, file), 'utf8');
for (const file of ['index.d.ts', 'global.d.ts', 'jsx-runtime.d.ts']) files[`/node_modules/@types/react/${file}`] = await readFile(`node_modules/@types/react/${file}`, 'utf8');
files['/node_modules/csstype/index.d.ts'] = await readFile('node_modules/csstype/index.d.ts', 'utf8');
const serialized = JSON.stringify(files);
const fingerprint = createHash('sha256').update(serialized)
  .update(await readFile(path.join(directory, 'typescript.js')))
  .update(await readFile('src/lib/reactTypescript/check.ts'))
  .update(await readFile('src/lib/reactTypescript/worker.ts'))
  .update(await readFile(new URL(import.meta.url))).update(await readFile('package-lock.json')).digest('hex');
const manifest = 'public/react-typescript-build.json';
let assetsCurrent = false;
try {
  if (JSON.parse(await readFile(manifest, 'utf8')).fingerprint === fingerprint) {
    await Promise.all(['public/react-typescript-worker.js', 'public/react-typescript-libs.json', 'public/react-typescript-licenses.txt'].map(file => access(file)));
    assetsCurrent = true;
  }
} catch { /* First build or changed dependencies. */ }
if (!assetsCurrent) {
await writeFile('public/react-typescript-libs.json', serialized);
await build({ entryPoints: ['src/lib/reactTypescript/worker.ts'], outfile: 'public/react-typescript-worker.js', bundle: true, platform: 'browser', format: 'iife', target: 'es2022', minify: true, external: ['fs', 'path', 'os', 'crypto', 'perf_hooks', 'inspector', 'buffer', 'source-map-support'], legalComments: 'eof' });
const licenses = [];
for (const file of ['node_modules/typescript/LICENSE.txt', 'node_modules/@types/react/LICENSE', 'node_modules/csstype/LICENSE']) licenses.push(`${file}\n\n${await readFile(file, 'utf8')}`);
await writeFile('public/react-typescript-licenses.txt', licenses.join('\n\n'));
await writeFile(manifest, JSON.stringify({ fingerprint }));
}
