// Opt-in integration matrix. All installs/builds live in ignored, disposable fixtures.
const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const versions = { 15: '15.5.29', 16: '16.4.5' };
const parent = path.join(root, '.playwright-mcp/nextjs-versions');
const reactVersion = require('react/package.json').version;
const targets = Object.entries(versions).map(([major, version]) => ({
  major,
  version,
  directory: path.join(parent, major),
}));
const selectedMajor = process.argv.find(argument=>/^--major=(15|16)$/.test(argument))?.split('=')[1];
const selectedTargets = selectedMajor ? targets.filter(target=>target.major===selectedMajor) : targets;

function prepare(target) {
  const write = (file, code) => {
    const output = path.join(target.directory, file);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, code);
  };
  write(
    'package.json',
    JSON.stringify(
      {
        private: true,
        scripts: { build: 'next build' },
        dependencies: {
          next: target.version,
          react: reactVersion,
          'react-dom': reactVersion,
        },
        devDependencies: {
          typescript: require('typescript/package.json').version,
          '@types/react': require('@types/react/package.json').version,
          '@types/node': require('@types/node/package.json').version,
        },
      },
      null,
      2,
    ),
  );
  write(
    'next.config.mjs',
    `export default {outputFileTracingRoot:process.cwd(),experimental:{cpus:2}${target.major === '16' ? ',turbopack:{root:process.cwd()},cacheComponents:true,partialPrefetching:true' : ''}};`,
  );
  write(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'esnext'],
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'preserve',
          esModuleInterop: true,
          plugins: [{ name: 'next' }],
        },
        include: [
          'next-env.d.ts',
          'app/**/*.ts',
          'app/**/*.tsx',
          '.next/types/**/*.ts',
        ],
        exclude: ['node_modules'],
      },
      null,
      2,
    ),
  );
  write(
    'app/layout.tsx',
    `export const metadata={title:'Version fixture'};export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}`,
  );
  write(
    'app/page.tsx',
    `import Link from 'next/link';${target.major === '16' ? "import {cacheLife} from 'next/cache';async function Cached(){'use cache';cacheLife('minutes');return <p>Cached public content</p>;}" : ''}export default function Page(){return <main><h1>Version fixture</h1><Link href="/products/one">Product one</Link>${target.major === '16' ? '<Cached/>' : ''}</main>;}`,
  );
  write(
    'app/products/[id]/page.tsx',
    `import {Suspense} from 'react';import {notFound} from 'next/navigation';type Props={params:Promise<{id:string}>};async function Product({params}:Props){const {id}=await params;if(id!=='one')notFound();return <h1>Product {id}</h1>;}export default function Page(props:Props){return <Suspense fallback={<p>Loading product</p>}><Product {...props}/></Suspense>;}`,
  );
  write(
    'app/products/[id]/not-found.tsx',
    `export default function Missing(){return <h1>Product missing</h1>;}`,
  );
  write(
    'app/search/page.tsx',
    `import {Suspense} from 'react';type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};async function Search({searchParams}:Props){const query=await searchParams;return <h1>{typeof query.q==='string'?query.q:'Enter query'}</h1>;}export default function Page(props:Props){return <Suspense fallback={<p>Reading query</p>}><Search {...props}/></Suspense>;}`,
  );
  write(
    'app/preferences/page.tsx',
    `import {Suspense} from 'react';import {cookies} from 'next/headers';async function Preference(){return <h1>Theme: {(await cookies()).get('theme')?.value==='dark'?'dark':'light'}</h1>;}export default function Page(){return <Suspense fallback={<p>Reading preference</p>}><Preference/></Suspense>;}`,
  );
  write(
    'app/about/page.tsx',
    `export const metadata={title:'About fixture'};export default function Page(){return <h1>About fixture</h1>;}`,
  );
  write(
    'app/api/echo/[id]/route.ts',
    `export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return Response.json({id:(await params).id,marker:request.headers.get('x-marker')},{headers:{'Cache-Control':'no-store'}});}`,
  );
  const handler = target.major === '15' ? 'middleware' : 'proxy';
  write(
    handler + '.ts',
    `import {NextResponse} from 'next/server';export function ${handler}(){const response=NextResponse.next();response.headers.set('x-fixture-major','${target.major}');return response;}export const config={matcher:['/api/echo/:path*']};`,
  );
}
function start(target, port) {
  const cli = path.join(target.directory, 'node_modules/next/dist/bin/next');
  const log = fs.openSync(path.join(target.directory, 'serve.log'), 'w');
  const child = spawn(process.execPath, [cli, 'start', '-p', String(port),'-H','127.0.0.1'], {
    cwd: target.directory,
    stdio: ['ignore', log, log],
    windowsHide: true,
  });
  fs.closeSync(log);
  return child;
}
async function verify(target, port) {
  const cli = path.join(target.directory, 'node_modules/next/dist/bin/next');
  if (!fs.existsSync(cli))
    throw Error(
      `Install fixture dependencies first: npm install --prefix "${target.directory}" --ignore-scripts --no-audit --no-fund --package-lock=true`,
    );
  // Dependency installs are pinned and isolated. Prevent Next 15's automatic lockfile
  // repair from reaching the parent repository or adding a network step to this test.
  // Next 15's integrated lint would otherwise discover the parent app's Next 16
  // ESLint configuration. App lint is a separate required gate; fixture types stay enabled.
  const reuseBuild = process.argv.includes('--serve-built');
  const buildLog = reuseBuild ? undefined : fs.openSync(path.join(target.directory, 'build.log'), 'w');
  const useTurbo15=target.major==='15'&&process.argv.includes('--turbopack15');
  const build = reuseBuild ? {status:fs.existsSync(path.join(target.directory,'.next/BUILD_ID'))?0:1} : spawnSync(process.execPath, [cli, 'build', ...(target.major==='15'?['--no-lint']:[]),...(useTurbo15?['--turbopack']:[])], {
    cwd: target.directory,
    env: {
      ...process.env,
      NEXT_IGNORE_INCORRECT_LOCKFILE: '1',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', buildLog, buildLog],
    timeout: 420000,
    windowsHide: true,
  });
  if(buildLog!==undefined)fs.closeSync(buildLog);
  if (build.status !== 0)
    throw Error(
      `Next ${target.version} build failed (${build.error?.message ?? build.status}); inspect ${path.join(target.directory, 'build.log')}`,
    );
  const child = start(target, port);
  const origin = `http://127.0.0.1:${port}`;
  let browser;
  try {
    let ready = false;
    let startupProblem='not listening';
    const deadline=Date.now()+60000;
    while (Date.now()<deadline) {
      try {
        const response=await fetch(origin,{signal:AbortSignal.timeout(2000)});
        if (response.ok) {
          ready = true;
          break;
        }
        startupProblem='HTTP '+response.status;
      } catch(error) {startupProblem=error.message;}
      if(child.exitCode!==null)break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(ready, `${target.version} server readiness: ${startupProblem}; inspect serve.log`);
    for (const marker of ['first', 'second']) {
      const response = await fetch(origin + '/api/echo/one', {
        headers: { 'x-marker': marker },
      });
      assert.deepEqual(await response.json(), { id: 'one', marker });
      assert.equal(response.headers.get('x-fixture-major'), target.major);
    }
    browser = await require('@playwright/test').chromium.launch();
    const page = await browser.newPage();
    await page.goto(origin);
    await page.getByRole('link', { name: 'Product one', exact: true }).click();
    await page
      .getByRole('heading', { name: 'Product one', exact: true })
      .waitFor();
    await page.goto(origin + '/products/missing');
    await page
      .getByRole('heading', { name: 'Product missing', exact: true })
      .waitFor();
    await page.goto(origin + '/search?q=hello');
    await page.getByRole('heading', { name: 'hello', exact: true }).waitFor();
    await page.goto(origin + '/search?q=a&q=b');
    await page
      .getByRole('heading', { name: 'Enter query', exact: true })
      .waitFor();
    await page
      .context()
      .addCookies([{ name: 'theme', value: 'dark', url: origin }]);
    await page.goto(origin + '/preferences');
    await page
      .getByRole('heading', { name: 'Theme: dark', exact: true })
      .waitFor();
    await page.goto(origin + '/about');
    assert.equal(await page.title(), 'About fixture');
    if (target.major === '16') {
      await page.goto(origin);
      await page.getByText('Cached public content', { exact: true }).waitFor();
    }
    return {
      version: target.version,
      bundler: target.major==='16'||useTurbo15?'turbopack':'webpack',
      productionBuild: reuseBuild ? 'not rerun; existing compiled output only' : true,
      checks: [
        'async params and soft navigation',
        'missing-resource boundary',
        'async scalar/repeated searchParams',
        'async cookies',
        'metadata',
        'request-specific GET and routing header',
        ...(target.major === '16'
          ? ['Cache Components with explicit cacheLife and partialPrefetching']
          : []),
      ],
    };
  } finally {
    await browser?.close();
    child.kill();
  }
}
(async () => {
  if (process.argv.includes('--prepare')) {
    for (const target of selectedTargets) prepare(target);
    console.log('Prepared ignored Next.js 15 and 16 integration fixtures.');
    return;
  }
  const results = [];
  for (const target of selectedTargets) {
    results.push(await verify(target, target.major==='15'?3205:3206));
    console.log(JSON.stringify(results.at(-1)));
  }
  fs.writeFileSync(
    path.join(parent, selectedMajor?`verification-${selectedMajor}.json`:'verification.json'),
    JSON.stringify(results, null, 2),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
