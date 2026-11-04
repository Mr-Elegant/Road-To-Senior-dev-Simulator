import './build-react-typescript-runtime.mjs';
import { inspectAssetCache } from './runtime-asset-cache.mjs';

// Self-host React + the JSX transformer. No external bundler or CDN is used by the preview.
const cache = await inspectAssetCache('.next/cache/react-runtime-build.json',
  ['scripts/build-react-runtime.mjs', 'scripts/runtime-asset-cache.mjs', 'src/lib/reactPractice/runtime.ts', 'package-lock.json'],
  ['public/react-practice-runtime.js']);
if (!cache.current) {
const { build } = await import('esbuild');
const result = await build({
  entryPoints: ['src/lib/reactPractice/runtime.ts'],
  outfile: 'public/react-practice-runtime.js',
  bundle: true,
  platform: 'browser',
  format: 'iife',
  globalName: 'ReactPractice',
  target: 'es2022',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
  metafile: true,
});
await cache.save(Object.keys(result.metafile.inputs));
}
