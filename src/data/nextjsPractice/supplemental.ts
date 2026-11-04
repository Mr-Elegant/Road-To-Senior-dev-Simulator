import type { ReviewDefinition } from './types';
export const supplementalReviews: ReviewDefinition[] = [
  {
    slug: 'pages-ssr-dto',
    title: 'Keep Pages Router SSR props serializable and public',
    difficulty: 'Beginner',
    chapter: 'Pages Router and migration',
    file: 'pages/account.tsx',
    broken: `export async function getServerSideProps(){return {props:{createdAt:new Date(),secret:'database-password'}};}
export default function Page(props:unknown){return <h1>Account</h1>;}`,
    fixed: `import type { GetServerSideProps,InferGetServerSidePropsType } from 'next';
export const getServerSideProps=(async()=>({props:{generatedAt:new Date().toISOString()}})) satisfies GetServerSideProps<{generatedAt:string}>;
export default function Page({generatedAt}:InferGetServerSidePropsType<typeof getServerSideProps>){return <p>Generated: {generatedAt}</p>;}`,
    explanation:
      'Pages Router getServerSideProps runs on the server, but its returned props are delivered to the browser. Use a JSON-serializable explicit DTO and authorize private reads before projecting them. This differs from the richer RSC serialization contract; do not apply one router’s assumptions blindly to the other.',
    checks: [
      'Build and request the Pages route on both supported majors.',
      'Inspect the document and data-navigation payload for only generatedAt.',
      'Add a real private read and test current actor ownership before returning its DTO.',
    ],
    tweak: 'Can getServerSideProps live in app/page.tsx?',
    answer:
      'No. The App Router uses its server rendering/data APIs instead. Migrate the route ownership and data-access boundary deliberately; copying a Pages export into app is not a compatible hybrid.',
    doc: 'pages/api-reference/functions/get-server-side-props',
  },
  {
    slug: 'pages-static-paths',
    title: 'Choose Pages Router fallback and revalidation explicitly',
    difficulty: 'Beginner',
    chapter: 'Pages Router and migration',
    file: 'pages/posts/[slug].tsx',
    broken: `export function getStaticPaths(){return {paths:[{id:'intro'}],fallback:'yes'};}`,
    fixed: `import type { GetStaticPaths,GetStaticProps,InferGetStaticPropsType } from 'next';
export const getStaticPaths=(async()=>({paths:[{params:{slug:'intro'}}],fallback:'blocking'})) satisfies GetStaticPaths;
export const getStaticProps=(async({params})=>{const slug=typeof params?.slug==='string'?params.slug:'';if(!slug)return {notFound:true};return {props:{slug},revalidate:60};}) satisfies GetStaticProps<{slug:string}>;
export default function Page({slug}:InferGetStaticPropsType<typeof getStaticProps>){return <h1>{slug}</h1>;}`,
    explanation:
      'Paths use the exact params shape for the dynamic segment, and fallback accepts supported values rather than an arbitrary string. blocking can generate unknown paths on first access; it is not per-request SSR forever, and it is incompatible with a pure static export. Real data lookup must still distinguish nonexistent records.',
    checks: [
      'Build and directly request the prebuilt intro path.',
      'Request a new path and observe subsequent serving behavior.',
      'Add a missing-record fixture and verify notFound rather than fabricating a valid post.',
    ],
    tweak: 'How does this map to the App Router?',
    answer:
      'Compare generateStaticParams and the chosen rendering/cache model rather than searching for a one-to-one export rename. Unknown-path policy, revalidation and deployment support must be reverified in the destination router.',
    doc: 'pages/api-reference/functions/get-static-paths',
  },
  {
    slug: 'pages-api-methods',
    title: 'Preserve HTTP semantics in a Pages API route',
    difficulty: 'Mid-Level',
    chapter: 'Pages Router and migration',
    file: 'pages/api/health.ts',
    broken: `export default function handler(req:any,res:any){res.status(200).json({ok:true});}`,
    fixed: `import type { NextApiRequest,NextApiResponse } from 'next';
export default function handler(req:NextApiRequest,res:NextApiResponse){if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}res.setHeader('Cache-Control','no-store');return res.status(200).json({ok:true});}`,
    explanation:
      'A Pages API default handler uses NextApiRequest/NextApiResponse, unlike App Router named Web Request/Response method exports. Reject unsupported methods deliberately and publish an Allow header. A public liveness response must not reveal credentials, database contents or a privileged readiness decision.',
    checks: [
      'Send GET and POST to the actual endpoint.',
      'Assert status, Allow and Cache-Control headers.',
      'Verify the handler follows the intended liveness/readiness contract during a dependency outage.',
    ],
    tweak: 'Can you export GET beside the default Pages handler?',
    answer:
      'Named GET/POST exports are App Router Route Handler conventions. Migrate the file location and HTTP adapter together while preserving external status/body semantics and authentication.',
    doc: 'pages/building-your-application/routing/api-routes',
  },
  {
    slug: 'router-coexistence',
    title: 'Migrate a route while App and Pages routers coexist',
    difficulty: 'Mid-Level',
    chapter: 'Pages Router and migration',
    file: 'route-ownership.ts',
    broken: `export const routeFiles=['pages/products.tsx','app/products/page.tsx'];`,
    fixed: `export const routeFiles=['pages/legacy-reports.tsx','app/products/page.tsx'];
// Own /products in one router. Inventory _app providers, _document markup, next/head and next/router consumers during migration.`,
    explanation:
      'Incremental migration can retain both router directories, but a URL must have one intentional owner. Moving the page also changes layout/provider ownership, head management and navigation-hook contracts. Preserve shared business logic and test hard loads and cross-router transitions rather than assuming client state remains mounted across the boundary.',
    checks: [
      'Build with one owner for each URL.',
      'Compare auth/provider behavior on direct and cross-router navigation.',
      'Verify titles, global styles and error/loading behavior after the move.',
    ],
    tweak: 'Can next/router be reused in an App Router client island?',
    answer:
      'Use the routing API appropriate to the owner or a deliberate compatibility layer for shared components. App Router hooks expose different contracts; do not conceal the mismatch with casts or a fabricated router object.',
    doc: 'app/guides/migrating/app-router-migration',
  },
  {
    slug: 'locale-admission',
    title: 'Admit a locale before loading a server dictionary',
    difficulty: 'Mid-Level',
    chapter: 'Routing and URL state',
    file: 'app/[lang]/page.tsx',
    broken: `export default async function Page({params}:any){const dictionary=await import('../../dictionaries/'+params.lang+'.json');return <h1>{dictionary.title}</h1>;}`,
    fixed: `import { notFound } from 'next/navigation';
const dictionaries={en:async()=>({title:'Welcome'}),hi:async()=>({title:'Namaste'})};
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='en'&&lang!=='hi')notFound();const dictionary=await dictionaries[lang]();return <h1>{dictionary.title}</h1>;}`,
    explanation:
      'An admitted locale selects a known loader instead of constructing an arbitrary module path from a route parameter. Await the route prop, handle unsupported locales and keep dictionaries on the server when only rendered text is needed. Domain redirects, cookie preferences and cache keys need a consistent locale policy.',
    checks: [
      'Request en, hi and an unsupported locale.',
      'Verify the browser does not download every complete dictionary unnecessarily.',
      'Test canonical/hreflang metadata and any locale redirect loop policy in a real deployment.',
    ],
    tweak: 'Would reading Accept-Language authorize a tenant domain?',
    answer:
      'No. Language negotiation is a representation preference, not identity or domain ownership. Keep trusted tenant/domain resolution separate and include admitted locale in any shared representation key.',
    doc: 'app/guides/internationalization',
  },
  {
    slug: 'static-export-boundaries',
    title: 'Reject server-only requirements from a static export plan',
    difficulty: 'Mid-Level',
    chapter: 'Deployment and runtime',
    file: 'next.config.ts',
    broken: `export default {output:'export'};
// Requirements include authenticated request-time cookies, Server Actions and arbitrary runtime API writes.`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={output:'standalone'};export default config;
// A server-capable deployment is required for the stated authenticated runtime features.
// If static hosting is mandatory, redesign those features around an explicitly separate authenticated backend.`,
    explanation:
      'output:export produces static files, not a hidden Next.js server. Pick a deployment model that supports the actual request-time requirements or move those requirements behind an explicit external service. Enumerating dynamic paths and configuring image handling are additional static-hosting design decisions.',
    checks: [
      'Build the intended deployment artifact.',
      'Exercise cookie-dependent rendering and a real mutation on the selected server-capable host.',
      'For a separate static variant, inventory and remove unsupported server features rather than suppressing export errors.',
    ],
    tweak: 'Is standalone the same as static export?',
    answer:
      'No. Standalone packages a traced Node server subset and still needs the appropriate static/public assets. Static export serves files and cannot execute request-time server code by itself.',
    doc: 'app/guides/static-exports',
  },
  {
    slug: 'sitemap-private-routes',
    title:
      'Publish canonical public sitemap entries without exposing private resources',
    difficulty: 'Mid-Level',
    chapter: 'Metadata and assets',
    file: 'app/sitemap.ts',
    broken: `export default function sitemap(){return [{url:'https://example.com/account/private-invoice'}];}`,
    fixed: `import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://example.com/',changeFrequency:'weekly'},{url:'https://example.com/docs',changeFrequency:'weekly'}];}
// Use a trusted configured public origin and published canonical records for dynamic entries.`,
    explanation:
      'A sitemap is a public discovery artifact. Project only published canonical routes and use a trusted origin rather than an arbitrary forwarded host. robots directives are crawler instructions, not access control; private endpoints must remain authenticated even when absent from the sitemap.',
    checks: [
      'Request sitemap.xml and validate absolute canonical URLs.',
      'Seed private/draft resources and prove they are omitted.',
      'Verify robots/noindex policy independently from actual authorization.',
    ],
    tweak: 'How do very large sitemaps scale?',
    answer:
      'Partition through supported sitemap generation conventions and the search-engine protocol limits. Bound build/query cost and use real content modification times; do not fabricate a new lastModified for every unchanged URL on every request.',
    doc: 'app/api-reference/file-conventions/metadata/sitemap',
  },
  {
    slug: 'public-env-freeze',
    title:
      'Distinguish build-time public environment values from runtime secrets',
    difficulty: 'Senior',
    chapter: 'Deployment and runtime',
    file: 'app/config-client.tsx',
    broken: `'use client';
export default function Config(){return <pre>{process.env.NEXT_PUBLIC_DATABASE_URL}</pre>;}`,
    fixed: `// Keep DATABASE_URL server-only; never prefix a secret with NEXT_PUBLIC_.
// Public NEXT_PUBLIC_* references are inlined at build time, not read afresh after promoting an artifact.
export type PublicConfig={supportLabel:string};
export function projectConfig(input:{supportLabel:string;databaseUrl:string}):PublicConfig{return {supportLabel:input.supportLabel};}`,
    explanation:
      'A public prefix is an exposure decision, not a runtime injection mechanism. A promoted build can retain its build-time public values even when deployment environment variables change. Read server secrets only on the server and expose an explicit authorized/public configuration projection when runtime-adjustable browser values are required.',
    checks: [
      'Build with a sentinel public value, change it at start and inspect the client bundle.',
      'Search generated assets for a sentinel secret and prove it is absent.',
      'Promote the same artifact between environments and verify the documented runtime/public configuration path.',
    ],
    tweak:
      'Could dynamic process.env indexing be used as a browser secret store?',
    answer:
      'No. It is not a supported security or runtime configuration strategy. Browser code has no trustworthy secret boundary; use server-side reads and intentionally public DTOs.',
    doc: 'app/guides/environment-variables',
  },
  {
    slug: 'react-compiler-adoption',
    title: 'Adopt React Compiler with dependency and purity checks',
    difficulty: 'Senior',
    chapter: 'Navigation and performance',
    file: 'next.config.ts',
    versions: '15-to-16',
    broken: `export default {experimental:{reactCompiler:true}};
// No compiler plugin is installed; render functions mutate their input props.`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={reactCompiler:true};export default config;
// Install the version-compatible babel-plugin-react-compiler dev dependency in the lab.
// Fix render purity/hook-rule violations and compare interactions/build cost before enabling broadly.`,
    next15:
      'Experimental compiler configuration and support vary by the exact 15 release. Use its matching documentation and plugin compatibility rather than copying a newer stable option blindly.',
    next16:
      'The current stable reactCompiler option requires babel-plugin-react-compiler. It optimizes eligible React code; it does not repair impure components or remove the need for profiling.',
    explanation:
      'Configuration, compiler dependency and component correctness are separate prerequisites. The React Compiler can reduce manual memoization needs but does not turn mutation during render into a valid pattern or guarantee a faster application. Keep the adoption behind measured interaction/build regression evidence.',
    checks: [
      'Install the matching plugin in an isolated lab and build.',
      'Test representative pure/impure component fixtures and hook-rule diagnostics.',
      'Compare actual render interactions and cold/warm build cost before and after.',
    ],
    tweak: 'Should you remove every useMemo immediately?',
    answer:
      'No. Review correctness and integration constraints separately from optimization. Adopt incrementally with profiling and tests; unnecessary memoization can be simplified later without combining every change into the compiler rollout.',
    doc: 'app/api-reference/config/next-config-js/reactCompiler',
  },
  {
    slug: 'server-action-origins',
    title: 'Constrain reverse-proxy action origins and payload limits',
    difficulty: 'Senior',
    chapter: 'Security and identity',
    file: 'next.config.ts',
    broken: `export default {experimental:{serverActions:{allowedOrigins:['*'],bodySizeLimit:'100mb'}}};`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={experimental:{serverActions:{allowedOrigins:['trusted-proxy.example.com'],bodySizeLimit:'1mb'}}};export default config;
// If the default same-origin policy already fits the deployment, omit allowedOrigins instead of expanding it.`,
    explanation:
      'Origin admission is an additional transport protection, not authentication or object permission. Model the actual trusted proxy/host chain before adding extra allowed domains and do not use an unrestricted wildcard to silence a mismatch. Body limits should follow the admitted operation; large uploads often need a separate scoped storage flow.',
    checks: [
      'Submit through the intended proxy and verify Origin/Host/forwarded-host handling.',
      'Reject an untrusted origin and oversized action payload.',
      'Call the mutation as an authenticated but unauthorized actor and verify data-level denial remains.',
    ],
    tweak: 'Does an allowed origin prove a trustworthy action argument?',
    answer:
      'No. Validate every argument and check current identity/capability at execution. Same-origin requests can still carry malicious values, and a trusted site can still have compromised clients or unauthorized users.',
    doc: 'app/api-reference/config/next-config-js/serverActions',
  },
];
