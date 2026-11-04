import type { ReviewDefinition } from './types';
const S = 'Senior';
export const productionReviews: ReviewDefinition[] = [
  {
    slug: 'stream-buffering',
    title: 'Preserve a streaming response through the deployment proxy',
    difficulty: S,
    chapter: 'Deployment and runtime',
    file: 'app/api/report/route.ts',
    broken: `import { createReportStream } from '@/lib/reports';
export async function GET(request:Request){const stream=await createReportStream(request.signal);const text=await new Response(stream).text();return new Response(text);}`,
    fixed: `import { createReportStream } from '@/lib/reports';
export async function GET(request:Request){const stream=await createReportStream(request.signal);return new Response(stream,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Accel-Buffering':'no'}});}
// createReportStream returns a bounded Web ReadableStream and honors cancellation.
// Configure and verify the actual reverse proxy/CDN; this header is not a universal buffering override.`,
    explanation:
      'Converting a stream to text buffers the whole body before sending it. Forward a supported stream and propagate cancellation while keeping its content type and privacy policy explicit. A correct application response can still be buffered by infrastructure, so observe real byte arrival at each hop rather than inferring streaming from the API shape.',
    checks: [
      'Use an origin emitting an immediate marker and a delayed marker.',
      'Compare first-marker arrival directly and through the deployment proxy.',
      'Cancel the client request and verify the upstream stream releases resources.',
    ],
    tweak: 'Can a late stream error change the HTTP status?',
    answer:
      'Once headers are committed, the response cannot simply become a different status. Design an application-level terminal/error representation where appropriate, cancel owned work and record correlated server evidence.',
    doc: 'app/guides/self-hosting',
  },
  {
    slug: 'proxy-migration',
    title: 'Rename Middleware to Proxy without changing routing intent',
    difficulty: S,
    chapter: 'Versions and migrations',
    file: 'proxy.ts',
    versions: '15-to-16',
    broken: `import { NextResponse } from 'next/server';
export const runtime='edge';
export function middleware(){return NextResponse.next();}`,
    fixed: `import { NextResponse,type NextRequest } from 'next/server';
export function proxy(request:NextRequest){const response=NextResponse.next();response.headers.set('x-route-policy','v2');return response;}
export const config={matcher:['/account/:path*']};`,
    next15:
      'Keep this logic in middleware.ts with the middleware export. Runtime support depends on the exact 15.x release; do not assume all 15 patches share Node middleware support.',
    next16:
      'Use proxy.ts and proxy. Proxy defaults to Node.js; setting the runtime export in the Proxy file is unsupported.',
    explanation:
      'Filename, export and runtime rules migrate together. Preserve a statically analyzable matcher and compare ordinary navigation, direct loads and mutation requests. The sample header is routing instrumentation, not an authentication decision; the data layer must still verify identity.',
    checks: [
      'Compare the 15 middleware and 16 proxy path coverage.',
      'Build without an unsupported Proxy runtime export.',
      'Verify unrelated assets are not intercepted and protected actions still authorize internally.',
    ],
    tweak: 'Should Proxy make slow database calls on every navigation?',
    answer:
      'Prefer bounded lightweight routing checks and enforce real authorization near data access. Database work in the routing layer can become a latency and availability dependency for every matched request.',
    doc: 'app/api-reference/file-conventions/proxy',
  },
  {
    slug: 'matcher-security',
    title: 'Keep authorization when a Proxy matcher excludes an action path',
    difficulty: S,
    chapter: 'Security and identity',
    file: 'app/public-actions.ts',
    broken: `'use server';
export async function exportCustomers(){return await database.customer.findMany();}
// Proxy only matches /admin, but this action is used on /exports.`,
    fixed: `'use server';
import { requireCapability } from '@/lib/auth';
import { listTenantCustomerExport } from '@/lib/customers';
export async function exportCustomers(){const actor=await requireCapability('customers:export');return listTenantCustomerExport(actor.tenantId);}`,
    explanation:
      'A matcher change or moving a Server Action to another route can change routing-layer coverage. An action still needs its own current capability check and tenant-scoped read. Filtering the final response client-side is too late once customer data has crossed the browser boundary.',
    checks: [
      'Invoke the action from its actual route as an unauthorized caller.',
      'Move the action’s call site outside the matcher in a disposable lab.',
      'Verify the protected export remains tenant-scoped in both versions.',
    ],
    tweak: 'How do you keep policies consistent across entry points?',
    answer:
      'Centralize an explicit authorized data-access operation or capability policy and invoke it from every entry point. Centralization should reduce duplication without hiding which actor and object scope a call uses.',
    doc: 'app/guides/authentication',
  },
  {
    slug: 'runtime-driver',
    title: 'Choose a runtime compatible with a native database driver',
    difficulty: S,
    chapter: 'Deployment and runtime',
    file: 'app/api/report/route.ts',
    broken: `export const runtime='edge';
import fs from 'node:fs/promises';
export async function GET(){return new Response(await fs.readFile('/tmp/report','utf8'));}`,
    fixed: `export const runtime='nodejs';
import { readFile } from 'node:fs/promises';
export async function GET(){try{return new Response(await readFile('/tmp/report','utf8'),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Report unavailable'},{status:503});}}`,
    explanation:
      'The Edge runtime does not provide the full Node.js API surface. Choose a supported runtime or replace the dependency with a compatible service. Even in Node, /tmp is ephemeral and instance-local; this reference demonstrates runtime compatibility, not durable cross-instance report storage.',
    checks: [
      'Build using the target deployment/runtime rather than only a local Node process.',
      'Request with a present and absent temporary file.',
      'Replace the file source with authorized durable storage for cross-instance requirements.',
    ],
    tweak: 'Does Node runtime remove serverless connection limits?',
    answer:
      'No. Pool size, connection reuse and concurrent instance count still matter. Use an appropriate database proxy/pool strategy and measure connection saturation under scale-out.',
    doc: 'app/api-reference/edge',
  },
  {
    slug: 'lazy-browser-library',
    title: 'Keep ssr:false inside a client boundary',
    difficulty: S,
    chapter: 'Navigation and performance',
    file: 'app/chart-client.tsx',
    broken: `import dynamic from 'next/dynamic';
const Chart=dynamic(()=>import('./browser-chart'),{ssr:false});
export default function Page(){return <Chart/>;}`,
    fixed: `'use client';
import dynamic from 'next/dynamic';
const Chart=dynamic(()=>import('./browser-chart'),{ssr:false,loading:()=> <p role="status">Loading chart</p>});
export default function ChartClient(){return <Chart/>;}
// Render ChartClient from a server page; keep data fetching in the server layer.`,
    explanation:
      'A browser-only module may need a no-SSR dynamic import, but that option belongs in a Client Component. Avoid turning a whole data-heavy page into a client module to accommodate one chart. Reserve layout space and consider a useful server fallback for unavailable or slow JavaScript.',
    checks: [
      'Build with the chart library accessing a browser API at module scope.',
      'Verify the loading fallback and eventual interaction.',
      'Inspect the client chunks to ensure unrelated server data dependencies were not bundled.',
    ],
    tweak: 'Would you lazy-load the LCP hero?',
    answer:
      'Usually not just to reduce an initial chunk. Delay work based on user value and measured critical-path behavior; deferring primary content can worsen perceived performance and LCP.',
    doc: 'app/guides/lazy-loading',
  },
  {
    slug: 'image-preload-16',
    title: 'Migrate a critical image loading hint with measured intent',
    difficulty: S,
    chapter: 'Metadata and assets',
    file: 'app/hero.tsx',
    versions: '15-to-16',
    broken: `import Image from 'next/image';
export default function Hero(){return <Image src="/hero.jpg" alt="Product workspace" width={1200} height={800} priority loading="lazy"/>;}`,
    fixed: `import Image from 'next/image';
export default function Hero(){return <Image src="/hero.jpg" alt="Product workspace" width={1200} height={800} sizes="100vw" preload/>;}
// Supply public/hero.jpg; use this 16-specific preload only for the deliberate critical image.`,
    next15:
      'Use the documented priority behavior for a deliberate critical image. Do not combine an intended eager critical resource with lazy loading.',
    next16:
      'priority is deprecated in favor of the current loading guidance including preload. Choose preload/fetchPriority/loading deliberately and avoid competing hints.',
    explanation:
      'Loading hints are a resource-priority decision, not a badge to apply to every image. Correct dimensions and sizes remain necessary. This reference uses a single known hero on 16; responsive variants or multiple possible LCP candidates need an intentional network policy.',
    checks: [
      'Inspect the head preload and image request in a production build.',
      'Compare LCP and bandwidth on a small viewport.',
      'Verify below-the-fold images do not all receive the same critical hint.',
    ],
    tweak: 'What if the hero depends on a user preference?',
    answer:
      'Avoid preloading a resource before you know it will be used. Measure which representation becomes LCP and consider fetchPriority or eager loading where the current docs recommend them.',
    doc: 'app/api-reference/components/image',
  },
  {
    slug: 'turbopack-webpack-config',
    title: 'Audit a custom Webpack hook before a Turbopack build',
    difficulty: S,
    chapter: 'Versions and migrations',
    file: 'next.config.ts',
    versions: '15-to-16',
    broken: `export default {webpack(config:any){config.resolve.alias['legacy-parser']='./parser';return config;}};`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={turbopack:{resolveAlias:{'legacy-parser':'./parser'}}};
export default config;
// Validate this alias against the actual parser module; retain an explicit webpack build only as a tested fallback.`,
    next15:
      'Turbopack availability/defaults differ by 15.x release and command. Record whether development and production use the same bundler.',
    next16:
      'Turbopack is the default for dev/build. Review unsupported custom Webpack behavior rather than assuming a webpack hook is applied to the Turbopack graph.',
    explanation:
      'A bundler switch can change module resolution, loaders and emitted assets even when TypeScript succeeds. Inventory every custom hook and translate only supported behavior. An explicit Webpack fallback is a rollback option when tested; silently dropping an alias is not a migration.',
    checks: [
      'Build and execute an import that depends on the alias.',
      'Compare development and production resolution.',
      'Check loaders, Sass imports and source maps used by the real app before retiring the fallback.',
    ],
    tweak: 'Should you clear .next before every timing measurement?',
    answer:
      'Separate cold and warm measurements. Repeatedly deleting caches can hide the benefit of incremental builds and distort the normal workflow; invalidate deliberately when diagnosing stale outputs.',
    doc: 'app/api-reference/config/next-config-js/turbopack',
  },
  {
    slug: 'eslint-cli-migration',
    title: 'Preserve lint as an explicit quality gate after next lint removal',
    difficulty: S,
    chapter: 'Versions and migrations',
    file: 'package.json',
    versions: '15-to-16',
    broken: `{"scripts":{"lint":"next lint","build":"next build"}}`,
    fixed: `{"scripts":{"lint":"eslint src","typecheck":"tsc --noEmit","build":"next build","check":"npm run lint && npm run typecheck && npm run build"}}`,
    next15:
      'An existing project may use next lint and version-specific build integration. Record the actual quality gates before migration.',
    next16:
      'next lint is removed and next build does not run lint for you. Use an explicit ESLint CLI command and keep CI invoking it.',
    explanation:
      'A successful framework build is not evidence that a removed lint step still ran. Keep lint, type checking and production building visible in CI with failure propagation. Avoid passing a build by disabling TypeScript checks or swallowing command exit codes.',
    checks: [
      'Introduce a known lint violation and prove the check command fails.',
      'Introduce a type error and prove the separate gate fails.',
      'Restore both and run the production build.',
    ],
    tweak:
      'Should tests and unfinished practice files be in the app typecheck?',
    answer:
      'Choose deliberate project scopes. Exclude candidate practice code from the app build, but retain a separate full tooling/test typecheck so reducing build scope does not silently abandon quality coverage.',
    doc: 'app/guides/upgrading/version-16',
  },
  {
    slug: 'request-time-randomness',
    title: 'Defer per-request randomness under Cache Components',
    difficulty: S,
    chapter: 'Cache Components (16)',
    file: 'app/request-id/page.tsx',
    versions: '16-only',
    broken: `export default function Page(){return <p>{crypto.randomUUID()}</p>;}`,
    fixed: `import { Suspense } from 'react';
import { connection } from 'next/server';
async function RequestId(){await connection();return <p>{crypto.randomUUID()}</p>;}
export default function Page(){return <Suspense fallback={<p>Creating request identifier</p>}><RequestId/></Suspense>;}`,
    explanation:
      'When the requirement is a new value per request, defer the operation to runtime and contain it with a Suspense boundary in the Cache Components model. If a shared stable value is intended instead, use an explicit cache scope. Arbitrary randomness during prerender must not be mistaken for a current request identifier.',
    checks: [
      'Enable Cache Components and build.',
      'Compare identifiers across independent requests.',
      'Confirm the fallback/static shell behavior and avoid displaying telemetry secrets.',
    ],
    tweak: 'Would performance.now() have the same purpose?',
    answer:
      'No. It is useful for measuring a duration, not a durable or globally unique request identity. Keep timing telemetry out of rendered content unless the UI requirement explicitly needs it.',
    doc: 'app/getting-started/caching',
  },
  {
    slug: 'streaming-metadata',
    title: 'Diagnose slow metadata without forcing every page fully dynamic',
    difficulty: S,
    chapter: 'Metadata and assets',
    file: 'app/products/[id]/page.tsx',
    broken: `export async function generateMetadata(){await new Promise(r=>setTimeout(r,3000));return {title:'Product'};}
export default function Page(){return <h1>Catalog</h1>;}`,
    fixed: `import { getPublicProduct } from '@/lib/public-product';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const product=await getPublicProduct(id);return {title:product.title,description:product.summary};}
export default async function Page({params}:{params:Promise<{id:string}>}){const product=await getPublicProduct((await params).id);return <h1>{product.title}</h1>;}`,
    explanation:
      'Remove artificial or redundant work and share an admitted data function. Metadata delivery and blocking can depend on bot classification and framework version; the same direct browser navigation is not a complete crawler test. A persistent cache, request memoization and streaming behavior are separate decisions.',
    checks: [
      'Compare a browser and representative documented HTML-limited bot user agents.',
      'Inspect title/description presence and timing on the actual production server.',
      'Count shared product reads and test origin failure.',
    ],
    tweak: 'Would a broad htmlLimitedBots override help?',
    answer:
      'It can change metadata behavior for many crawlers and should not be a reflex latency fix. Verify the crawler requirement and official matching behavior, then change the narrowest necessary policy.',
    doc: 'app/api-reference/functions/generate-metadata',
  },
  {
    slug: 'async-image-id',
    title: 'Await the generated image id during the 16 migration',
    difficulty: S,
    chapter: 'Versions and migrations',
    file: 'app/icon.tsx',
    versions: '15-to-16',
    broken: `import { ImageResponse } from 'next/og';
export default function Icon({id}:{id:string}){return new ImageResponse(<div>{id}</div>,{width:64,height:64});}`,
    fixed: `import { ImageResponse } from 'next/og';
export function generateImageMetadata(){return [{id:'primary',size:{width:64,height:64},contentType:'image/png'}];}
export default async function Icon({id}:{id:Promise<string>}){const variant=await id;return new ImageResponse(<div style={{display:'flex',fontSize:20}}>{variant==='primary'?'P':'?'}</div>,{width:64,height:64});}`,
    next15:
      'Image generation props must be reviewed against the 15 API; the id contract differs from the 16 form.',
    next16:
      'The generated image function receives id as a promise. Await id and review promised params as described in the upgrade guide.',
    explanation:
      'An image-generation function is part of the route migration surface, not an exemption from asynchronous prop changes. Keep generated metadata IDs aligned with the consuming image function and verify real image bytes, content type and dimensions rather than merely type-checking the source.',
    checks: [
      'Build and request the generated icon URL.',
      'Decode the returned image and confirm 64×64 pixels.',
      'Test every declared metadata variant and the dynamic params contract if present.',
    ],
    tweak: 'Why avoid fetching arbitrary user URLs while generating OG images?',
    answer:
      'Image generation is a server-side resource consumer. Bound destinations, response sizes, timeouts and rendering work; treat user text and URLs as untrusted inputs rather than unrestricted server fetch instructions.',
    doc: 'app/guides/upgrading/version-16',
  },
  {
    slug: 'bounded-upstream-fetch',
    title: 'Bound an upstream request and propagate failure deliberately',
    difficulty: S,
    chapter: 'Data fetching',
    file: 'app/api/status/route.ts',
    broken: `export async function GET(){return new Response(await (await fetch('https://status.example.com')).text());}`,
    fixed: `export async function GET(){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),1500);try{const response=await fetch('https://status.example.com/public',{signal:controller.signal,cache:'no-store'});if(!response.ok)return Response.json({error:'Upstream unavailable'},{status:502});return Response.json(await response.json(),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Upstream unavailable'},{status:504});}finally{clearTimeout(timer);}}`,
    explanation:
      'A server timeout budget must include the upstream dependency instead of waiting until the platform kills the whole invocation. Check HTTP failures separately from transport failures and clear owned timers. The reference deliberately returns a stable failure body; a richer contract can distinguish abort from other network errors.',
    checks: [
      'Use a controlled origin returning success, 500 and a stalled body.',
      'Verify the deadline frees request-owned resources.',
      'Test caller cancellation and combine it with the deadline where the supported runtime permits.',
    ],
    tweak: 'Is retrying always appropriate after this failure?',
    answer:
      'Only when the operation is safe or receiver-enforced idempotent, with remaining deadline and attempt budgets. A timeout can leave a mutation outcome unknown; reconcile instead of blindly duplicating it.',
    doc: 'app/guides/backend-for-frontend',
  },
  {
    slug: 'tenant-cache-poisoning',
    title: 'Reject a cross-tenant cache read before lookup',
    difficulty: S,
    chapter: 'Security and identity',
    file: 'lib/tenant-report.ts',
    broken: `const reports=new Map();
export async function report(id:string){if(!reports.has(id))reports.set(id,await queryReport(id));return reports.get(id);}`,
    fixed: `import 'server-only';
import { requireTenantMember } from '@/lib/auth';
import { queryTenantReport } from '@/lib/db';
export async function report(tenantId:string,id:string){await requireTenantMember(tenantId);return queryTenantReport({tenantId,id});}
// Add a bounded explicit cache only after defining tenant/role/version keys and revocation behavior.`,
    explanation:
      'A resource ID by itself may not identify an authorized representation. The reference first removes an unsafe process-global cache and binds both authorization and the database predicate to the trusted tenant scope. Reintroducing caching requires an explicit consistency and isolation design, not just a longer concatenated string.',
    checks: [
      'Request the same local ID in two tenants.',
      'Attempt a forged tenant parameter and a revoked membership.',
      'Inspect all serialized props and HTTP caches for leaked representations.',
    ],
    tweak: 'Can a role-specific report use a tenant-only key?',
    answer:
      'Only if the output is identical for every authorized role. Otherwise include the relevant representation version/scope or avoid shared caching. Authorization must still run before access, with a defined revocation freshness policy.',
    doc: 'app/guides/data-security',
  },
  {
    slug: 'csp-nonce',
    title:
      'Plan nonce-based CSP without assuming static HTML can vary per request',
    difficulty: S,
    chapter: 'Security and identity',
    file: 'csp-policy.ts',
    broken: `export const csp="script-src 'nonce-fixed-for-all-users' 'unsafe-inline'";`,
    fixed: `export function policy(nonce:string){return "default-src 'self'; script-src 'self' 'nonce-"+nonce+"' 'strict-dynamic'; object-src 'none'; base-uri 'self'";}
// Generate an unpredictable nonce per request and propagate it through documented Next request/response headers.
// This policy fragment alone does not install CSP or nonce every application script.`,
    explanation:
      'A fixed nonce provides no meaningful per-response nonce boundary, and retaining unsafe-inline can defeat the intended protection. Nonce ownership involves the request header seen by rendering and the response policy seen by the browser. Static cached HTML and per-request nonce requirements need an explicit compatibility decision.',
    checks: [
      'Install the full documented CSP propagation in a disposable real app.',
      'Verify legitimate scripts carry the matching nonce and injected inline scripts are blocked.',
      'Test report-only deployment, third-party scripts and production rendering/caching behavior.',
    ],
    tweak: 'Would you enable a strict policy in one production step?',
    answer:
      'Start with report-only telemetry and an inventory of required script/style sources, fix violations, then enforce through a monitored rollout. CSP complements input handling and authorization; it does not repair unsafe data access.',
    doc: 'app/guides/content-security-policy',
  },
  {
    slug: 'draft-mode-entry',
    title: 'Authenticate draft-mode activation and constrain its destination',
    difficulty: S,
    chapter: 'Metadata and assets',
    file: 'app/api/draft/route.ts',
    broken: `import { draftMode } from 'next/headers';
export async function GET(){(await draftMode()).enable();return Response.redirect('https://untrusted.example');}`,
    fixed: `import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPreviewRequest } from '@/lib/cms-preview';
export async function GET(request:Request){const preview=await verifyPreviewRequest(request);if(!preview)return new Response('Unauthorized',{status:401});(await draftMode()).enable();redirect(preview.canonicalInternalPath);}`,
    explanation:
      'Draft mode changes the rendering/data-view context and must be granted only after verifying the CMS preview request. The integration returns a server-owned admitted internal destination, not an arbitrary redirect parameter. Keep draft content and its cache policy separate from public published representations.',
    checks: [
      'Reject invalid and expired preview credentials.',
      'Try an external return destination and a missing draft.',
      'Verify draft cookies, public isolation and explicit disable/exit behavior.',
    ],
    tweak: 'What if the preview link is forwarded?',
    answer:
      'Define expiry, replay and actor authorization appropriate to the CMS workflow. Do not assume a long-lived secret query parameter safely represents the current user’s permission to every draft.',
    doc: 'app/guides/draft-mode',
  },
  {
    slug: 'instrumentation-runtime',
    title: 'Load server instrumentation in its supported runtime',
    difficulty: S,
    chapter: 'Testing and operations',
    file: 'instrumentation.ts',
    broken: `import './lib/node-tracing';
export function register(){console.log(process.env.DATABASE_URL);}`,
    fixed: `export async function register(){if(process.env.NEXT_RUNTIME==='nodejs'){await import('./lib/node-tracing');}}
// node-tracing initializes the approved telemetry SDK once and redacts sensitive attributes.`,
    explanation:
      'Instrumentation initialization runs in framework-managed environments. Guard Node-specific dependencies where appropriate and never log connection strings as a diagnostic shortcut. Trace route/dependency durations and correlation IDs without collecting credentials, full session tokens or raw sensitive payloads.',
    checks: [
      'Build every configured runtime without unsupported imports.',
      'Verify one intended initialization lifecycle per process.',
      'Inspect exported spans/logs for redaction and useful route/dependency attribution.',
    ],
    tweak:
      'Why can a dashboard’s client timing disagree with its server trace?',
    answer:
      'They measure different boundaries: queueing, network, hydration, prefetch and cache hits may occur outside one server span. Join correlated telemetry and compare distributions instead of treating a single duration as the whole user experience.',
    doc: 'app/guides/instrumentation',
  },
  {
    slug: 'after-not-a-queue',
    title: 'Use after for bounded telemetry rather than durable fulfillment',
    difficulty: S,
    chapter: 'Testing and operations',
    file: 'app/api/orders/route.ts',
    broken: `import { after } from 'next/server';
export async function POST(){after(async()=>{await chargeCard();await shipOrder();});return Response.json({paid:true});}`,
    fixed: `import { after } from 'next/server';
import { createPendingOrderAndOutbox } from '@/lib/orders';
import { recordMetric } from '@/lib/metrics';
export async function POST(request:Request){const order=await createPendingOrderAndOutbox(request);after(()=>recordMetric('order.accepted'));return Response.json({id:order.id,status:'pending'},{status:202});}`,
    explanation:
      'after schedules supported post-response work within platform limits; it is not a durable job queue with transactional acknowledgement and retry. Persist the order’s pending state and outbox atomically before accepting responsibility. Never announce payment success before its authoritative outcome is known.',
    checks: [
      'Crash the request process after transaction commit and before worker delivery.',
      'Replay the worker operation and verify receiver-enforced idempotency.',
      'Verify telemetry failure cannot incorrectly mark an order paid or lose its durable event.',
    ],
    tweak: 'Was after always a stable API in 15?',
    answer:
      'Check the specific minor version: it became stable during the 15 line. The curriculum assumes a patched maintenance release, not every historical 15.0 behavior. Platform duration and lifecycle limits still apply.',
    doc: 'app/api-reference/functions/after',
  },
  {
    slug: 'async-rsc-test-strategy',
    title: 'Choose a real-server test for async Server Component behavior',
    difficulty: S,
    chapter: 'Testing and operations',
    file: 'tests/product.spec.ts',
    broken: `// A mocked React render is being presented as proof of routing, server caching and streaming correctness.
expect(mockedProduct).toEqual({id:'one'});`,
    fixed: `import { test,expect } from '@playwright/test';
test('product route supports direct navigation',async({page})=>{const response=await page.goto('/products/one');expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{name:'Product one'})).toBeVisible();});
// Run against next build + next start with a controlled data fixture, not a mocked Next transport.`,
    explanation:
      'A pure unit test is valuable for policy logic but cannot establish the framework’s async rendering, route conventions, response headers or caching. Use production-server integration/E2E tests for those boundaries and keep deterministic data fixtures. Add direct and soft-navigation cases because their behavior can differ.',
    checks: [
      'Run the test against a production build.',
      'Add missing-resource, failure and soft-navigation journeys.',
      'Use an origin counter or controlled clock for cache claims rather than inferring them from a visible heading.',
    ],
    tweak: 'Should every policy use a browser test?',
    answer:
      'No. Test pure transformations and authorization matrices cheaply at unit level, then cover the small number of real framework and deployment boundaries with integration/E2E evidence. Mocks and real-server evidence answer different questions.',
    doc: 'app/guides/testing/playwright',
  },
  {
    slug: 'standalone-output',
    title: 'Ship a standalone deployment with its required static assets',
    difficulty: S,
    chapter: 'Deployment and runtime',
    file: 'next.config.ts',
    broken: `export default {output:'standalone'};
// Deployment copies only .next/standalone and assumes all assets are included automatically.`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={output:'standalone'};export default config;
// Packaging step: copy public into .next/standalone/public and .next/static into .next/standalone/.next/static.
// Run the generated server.js with the deployment's PORT/HOSTNAME and runtime secrets.`,
    explanation:
      'Standalone output traces the server dependency subset but static/public asset packaging still needs deliberate handling or an external CDN policy. Test the packaged directory independently of the source checkout so accidental access to local node_modules or public assets does not mask omissions.',
    checks: [
      'Start the packaged artifact from an isolated directory.',
      'Request an HTML route, JS/CSS chunks and public assets.',
      'Verify runtime environment configuration and health checks without bundling secrets into NEXT_PUBLIC values.',
    ],
    tweak: 'How do monorepo file traces change this?',
    answer:
      'Set the intended tracing root and include required files outside the app boundary as documented. Audit the packaged artifact instead of copying the whole repository and assuming that is an efficient or secret-safe deployment.',
    doc: 'app/api-reference/config/next-config-js/output',
  },
  {
    slug: 'partial-prefetching',
    title: 'Adopt modern partial prefetching without losing the initial UI',
    difficulty: S,
    chapter: 'Navigation and performance',
    file: 'next.config.ts',
    versions: '16-only',
    broken: `export default {cacheComponents:true};
// Every large catalog Link has prefetch={true}; the team assumes all links share one inexpensive shell automatically.`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={cacheComponents:true,partialPrefetching:true};export default config;
// Audit full per-link prefetches; resolve URL-dependent data behind destination Suspense boundaries.
// Retain prefetch={true} only where resolving extra URL-specific cached content is an intentional budget decision.`,
    next15:
      'This current 16.x adoption pattern is not a stable 15 substitute. Use the version-matched Link/loading/cache behavior and measure its actual prefetch traffic.',
    next16:
      'The 16.4 documentation describes partialPrefetching with Cache Components. Verify exact patch support before copying this configuration to an older 16 minor.',
    explanation:
      'The initial UI of a direct load and a client navigation can differ below shared layouts. Partial prefetching changes what the App Shell downloads and reuses; explicit full per-link prefetches remain a budget decision. Instant behavior assumes suitable warm caches, and a root-only Suspense boundary may not contain a destination transition.',
    checks: [
      'Compare cold direct, warm direct and sibling client navigation.',
      'Inspect prefetch requests across many parameterized links.',
      'Use the documented instant-navigation assertions/insights to preserve intended initial UI while adopting the flag.',
    ],
    tweak: 'Does this make uncached request data instant?',
    answer:
      'No. Make the shell useful and stream request-dependent work into correctly placed fallbacks. A prefetch flag cannot repair an unbounded blocking dependency or eliminate cold-cache computation.',
    doc: 'app/guides/adopting-partial-prefetching',
  },
];
