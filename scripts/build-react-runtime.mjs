import { build } from 'esbuild';

// Self-host React + the JSX transformer. No external bundler or CDN is used by the preview.
await build({
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
});
