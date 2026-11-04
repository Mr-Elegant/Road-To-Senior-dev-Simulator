import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { inspectAssetCache } from './runtime-asset-cache.mjs';

const require = createRequire(import.meta.url);
const directory = path.dirname(require.resolve('typescript/lib/typescript.js'));
const declarations = [
  ...(await readdir(directory)).filter(file => /^lib.*\.d\.ts$/.test(file)).map(file => [`/${file}`, path.join(directory, file)]),
  ...['index.d.ts', 'global.d.ts', 'jsx-runtime.d.ts'].map(file => [`/node_modules/@types/react/${file}`, `node_modules/@types/react/${file}`]),
  ['/node_modules/csstype/index.d.ts', 'node_modules/csstype/index.d.ts'],
];
const licensePaths = ['node_modules/typescript/LICENSE.txt', 'node_modules/@types/react/LICENSE', 'node_modules/csstype/LICENSE'];
const cache = await inspectAssetCache('.next/cache/react-typescript-build.json',
  ['scripts/build-react-typescript-runtime.mjs', 'scripts/runtime-asset-cache.mjs', 'src/lib/reactTypescript/check.ts', 'src/lib/reactTypescript/worker.ts', 'package-lock.json',
    path.join(directory, 'typescript.js'), ...declarations.map(([, file]) => file), ...licensePaths],
  ['public/react-typescript-libs.json', 'public/react-typescript-worker.js', 'public/react-typescript-licenses.txt']);
if (!cache.current) {
  const files = Object.fromEntries(await Promise.all(declarations.map(async ([name, file]) => [name, await readFile(file, 'utf8')])));
  const { build } = await import('esbuild');
  const result = await build({ entryPoints: ['src/lib/reactTypescript/worker.ts'], outfile: 'public/react-typescript-worker.js', bundle: true, platform: 'browser', format: 'iife', target: 'es2022', minify: true, external: ['fs', 'path', 'os', 'crypto', 'perf_hooks', 'inspector', 'buffer', 'source-map-support'], legalComments: 'eof', metafile: true });
  await writeFile('public/react-typescript-libs.json', JSON.stringify(files));
  const licenses = await Promise.all(licensePaths.map(async file => `${file}\n\n${await readFile(file, 'utf8')}`));
  await writeFile('public/react-typescript-licenses.txt', licenses.join('\n\n'));
  await cache.save(Object.keys(result.metafile.inputs));
}
