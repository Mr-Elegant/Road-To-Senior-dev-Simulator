import type { ReviewDefinition } from './types';
const B = 'Beginner',
  M = 'Mid-Level';
export const foundationReviews: ReviewDefinition[] = [
  {
    slug: 'root-layout',
    title: 'Repair the App Router root layout',
    difficulty: B,
    chapter: 'App Router foundations',
    file: 'app/layout.tsx',
    broken: `export default function Layout({children}: {children: React.ReactNode}) { return <main>{children}</main>; }`,
    fixed: `import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><nav aria-label="Main">Engineering Lab</nav><main>{children}</main></body></html>;
}`,
    explanation:
      'The root layout owns html and body; a nested layout must not create a second document. Keep shared navigation here while allowing page content to render through children. A layout persists across ordinary client navigation, so it is a poor place to derive a continuously changing pathname from server-only props.',
    checks: [
      'Build with a real root page and verify one html/body pair.',
      'Navigate between two sibling pages and verify shared client state persists.',
      'Reload a nested URL directly and verify the same shell.',
    ],
    tweak: 'When would you use template.tsx instead?',
    answer:
      'A template remounts its children during navigation and resets their state/effects. Use it for deliberate per-navigation lifecycle behavior, not as a workaround for stale authorization. Put authorization near protected data reads.',
    doc: 'app/api-reference/file-conventions/layout',
  },
  {
    slug: 'client-island',
    title: 'Move interactivity into a small Client Component',
    difficulty: B,
    chapter: 'Server and client boundaries',
    file: 'app/counter.tsx',
    broken: `import { useState } from 'react';
export default function Counter(){ const [n,setN]=useState(0); return <button onClick={()=>setN(n+1)}>{n}</button>; }`,
    fixed: `'use client';
import { useState } from 'react';
export default function Counter(){
  const [count,setCount]=useState(0);
  return <button type="button" onClick={()=>setCount(value=>value+1)}>Count: {count}</button>;
}`,
    explanation:
      'State and event handlers require a client boundary. Put the directive before imports in this leaf module and render it from a Server Component page. Marking the entire root layout client-side expands the dependency graph unnecessarily. Client Components can still participate in the initial server-rendered HTML; client does not mean browser-only rendering.',
    checks: [
      'Build a Server Component page importing Counter.',
      'Click repeatedly and verify the count.',
      'Inspect the client graph and confirm the data-access module was not imported.',
    ],
    tweak: 'Can the Client Component import a Server Component?',
    answer:
      'Do not import a server-only data component into the client graph. Compose it in a Server Component parent and pass its rendered output through a slot such as children; that preserves ownership of the server work.',
    doc: 'app/getting-started/server-and-client-components',
  },
  {
    slug: 'async-route-params',
    title: 'Migrate dynamic route params from 15 compatibility to 16',
    difficulty: B,
    chapter: 'Routing and URL state',
    file: 'app/products/[id]/page.tsx',
    versions: '15-to-16',
    broken: `export default function Page({params}: {params:{id:string}}){ return <h1>Product {params.id}</h1>; }`,
    fixed: `export default async function Page({params}: {params:Promise<{id:string}>}) {
  const {id}=await params;
  return <h1>Product {id}</h1>;
}`,
    next15:
      'Next.js 15 introduces promised params with temporary synchronous compatibility. Migrate callers and types instead of relying on that compatibility.',
    next16:
      'Synchronous params access is removed. Await the promise, or unwrap with React use in an appropriate synchronous component.',
    explanation:
      'Update the route-prop type and implementation together. Await before reading id, then validate it according to the resource contract. The asynchronous boundary is not solved by casting away the promise or suppressing diagnostics; those approaches conceal a runtime migration problem.',
    checks: [
      'Build a dynamic route and directly request /products/abc.',
      'Verify generated route types accept the promised params signature.',
      'Test a missing resource separately from an invalid identifier.',
    ],
    tweak: 'What changes for Route Handlers and metadata?',
    answer:
      'Their dynamic params are also asynchronous in the migration. Update page, layout, route and metadata consumers consistently; next typegen can help validate generated contracts on supported versions.',
    doc: 'app/guides/upgrading/version-16',
  },
  {
    slug: 'async-search-params',
    title: 'Read and validate server searchParams',
    difficulty: B,
    chapter: 'Routing and URL state',
    file: 'app/search/page.tsx',
    versions: '15-to-16',
    broken: `export default function Page({searchParams}: {searchParams:{q:string}}){ return <h1>{searchParams.q.toUpperCase()}</h1>; }`,
    fixed: `type Query = Record<string,string|string[]|undefined>;
export default async function Page({searchParams}: {searchParams:Promise<Query>}) {
  const query=await searchParams;
  const term=typeof query.q==='string'?query.q.trim():'';
  return <h1>{term ? 'Results for '+term : 'Enter a search term'}</h1>;
}`,
    next15:
      'Await promised page searchParams even while temporary synchronous access exists.',
    next16:
      'Await is required. Plain-object server searchParams is distinct from the client useSearchParams interface.',
    explanation:
      'A query parameter can be missing or repeated, and reading it can require request-time rendering. Narrow the scalar input before using string methods. HTML escaping by React protects text rendering; it does not authorize a database query or validate every domain constraint.',
    checks: [
      'Request no q, q=books and repeated q values.',
      'Build with the promised route-prop type.',
      'Verify hostile text renders as text rather than executable HTML.',
    ],
    tweak: 'How do you retain a cacheable search shell?',
    answer:
      'Separate request-dependent results from the static shell and use a deliberate Suspense boundary when using Cache Components. Cache public results only with keys that include all admitted search/filter dimensions.',
    doc: 'app/api-reference/file-conventions/page',
  },
  {
    slug: 'async-cookies',
    title: 'Read request cookies on the server',
    difficulty: B,
    chapter: 'Server and client boundaries',
    file: 'app/preferences/page.tsx',
    versions: '15-to-16',
    broken: `'use client';
import { cookies } from 'next/headers';
export default function Page(){ return <p>{cookies().get('theme')?.value}</p>; }`,
    fixed: `import { cookies } from 'next/headers';
export default async function Page(){
  const theme=(await cookies()).get('theme')?.value==='dark'?'dark':'light';
  return <p>Preferred theme: {theme}</p>;
}`,
    next15:
      'cookies() is asynchronous; synchronous access is temporary compatibility, not a stable pattern.',
    next16:
      'Await cookies(). With Cache Components enabled, read request data in a runtime subtree behind Suspense instead of inside use cache.',
    explanation:
      'next/headers is a server request API, not a client storage library. Whitelist the represented preference instead of copying an arbitrary cookie into classes or HTML. Reading a cookie is separate from permission to mutate it; set cookies in supported mutation contexts before streaming commits headers.',
    checks: [
      'Set light, dark and unknown theme cookies and inspect rendered text.',
      'Confirm the client bundle contains no next/headers import.',
      'Repeat with Cache Components explicitly enabled and add the required runtime boundary.',
    ],
    tweak: 'Should this cookie establish authentication?',
    answer:
      'A display preference is not an identity proof. Authentication cookies need integrity, secure attributes, expiry and server-side verification; never trust a role string merely because it arrived in a cookie.',
    doc: 'app/api-reference/functions/cookies',
  },
  {
    slug: 'client-prop-contract',
    title: 'Replace a non-serializable event prop across the boundary',
    difficulty: B,
    chapter: 'Server and client boundaries',
    file: 'app/page.tsx',
    broken: `import Button from './button';
export default function Page(){ return <Button onClick={()=>console.log('clicked')} />; }`,
    fixed: `// app/page.tsx (Server Component)
import Button from './button';
export default function Page(){ return <Button label="Save draft" />; }
// app/button.tsx is a separate file:
// 'use client';
// export default function Button({label}:{label:string}) {
//   return <button onClick={()=>console.log('clicked')}>{label}</button>;
// }`,
    explanation:
      'An ordinary server-created callback cannot be serialized as a client event handler. Keep the interactive callback in a Client Component and pass supported data props. Server Actions are a specific server-function capability, not a general exception allowing arbitrary closures to cross the boundary.',
    checks: [
      'Split the two files at the annotated boundary and build.',
      'Confirm the button works after hydration.',
      'Verify no sensitive object fields are included in the props payload.',
    ],
    tweak: 'Are Dates always forbidden as RSC props?',
    answer:
      'Do not reduce the RSC serialization contract to JSON-only folklore. React supports specific richer values; check its current supported types. Still prefer an intentional DTO and avoid arbitrary class instances or ordinary function props.',
    doc: 'app/getting-started/server-and-client-components',
  },
  {
    slug: 'not-found-control-flow',
    title: 'Terminate a missing resource with notFound',
    difficulty: B,
    chapter: 'Rendering and streaming',
    file: 'app/items/[id]/page.tsx',
    broken: `export default async function Page(){ const item=null; return <h1>{item!.title}</h1>; }`,
    fixed: `import { notFound } from 'next/navigation';
const items:Record<string,{title:string}>={one:{title:'First item'}};
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const item=items[id];
  if(!item)notFound();
  return <h1>{item.title}</h1>;
}`,
    explanation:
      'Missing data is an expected route outcome. notFound terminates the segment and renders its not-found boundary, allowing the type system to narrow the remaining value. Do not swallow framework control-flow exceptions in broad catch blocks. HTTP status behavior must also be checked before versus after streaming starts.',
    checks: [
      'Render an existing item.',
      'Request a missing item directly and inspect its body, robots metadata and status.',
      'Test a streamed missing subtree separately; do not assert that every streamed response can change its committed status.',
    ],
    tweak: 'When should a missing item redirect instead?',
    answer:
      'Redirect when a known canonical replacement exists and choose permanence deliberately. A login redirect, deleted resource and nonexistent identifier have different semantics; do not turn all failures into a 200 empty page.',
    doc: 'app/api-reference/functions/not-found',
  },
  {
    slug: 'error-boundary',
    title: 'Build a retryable route error boundary',
    difficulty: B,
    chapter: 'Rendering and streaming',
    file: 'app/dashboard/error.tsx',
    broken: `export default function Error({error}:{error:Error}){ return <pre>{error.stack}</pre>; }`,
    fixed: `'use client';
export default function ErrorBoundary({reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <section role="alert"><h2>Dashboard unavailable</h2><p>Try again in a moment.</p><button onClick={()=>reset()}>Retry</button></section>;
}`,
    explanation:
      'error.tsx is a Client Component boundary with a reset callback. Show a useful recovery action without exposing server stack traces to users. A boundary catches errors in its child segment; it does not catch an error in its own layout, and it does not replace validation-error handling or authorization.',
    checks: [
      'Force a child render failure in a production build.',
      'Remove the failure and verify Retry recovers the subtree.',
      'Verify no server stack, secrets or database query is visible in the error UI.',
    ],
    tweak: 'What handles a root layout failure?',
    answer:
      'Use global-error.tsx with its own html and body, and test its production behavior. Keep expected action validation in returned serializable state instead of routing every field error through an exception boundary.',
    doc: 'app/api-reference/file-conventions/error',
  },
  {
    slug: 'suspense-loading',
    title: 'Place Suspense before the slow work',
    difficulty: B,
    chapter: 'Rendering and streaming',
    file: 'app/reports/page.tsx',
    broken: `import { Suspense } from 'react';
export default async function Page(){ await new Promise(r=>setTimeout(r,800)); return <Suspense fallback={<p>Loading</p>}><p>Report ready</p></Suspense>; }`,
    fixed: `import { Suspense } from 'react';
async function Report(){await new Promise(resolve=>setTimeout(resolve,800));return <p>Report ready</p>;}
export default function Page(){return <><h1>Reports</h1><Suspense fallback={<p role="status">Loading report</p>}><Report/></Suspense></>;}`,
    explanation:
      'A fallback cannot reveal earlier when the parent has already awaited the slow operation. Move the suspending work into the child and wrap that child before it executes. loading.tsx creates a segment-level boundary, while explicit Suspense permits smaller independent reveal regions.',
    checks: [
      'Use a production server with proxy buffering disabled for the experiment.',
      'Confirm the heading/fallback can arrive before report completion.',
      'Navigate away during loading and verify the UI remains usable.',
    ],
    tweak: 'Does streaming necessarily improve LCP?',
    answer:
      'No. The largest visible element may still depend on slow work, and an excessive skeleton can shift layout. Measure the actual critical content, reserve dimensions and inspect buffering at every deployment hop.',
    doc: 'app/api-reference/file-conventions/loading',
  },
  {
    slug: 'link-navigation',
    title: 'Preserve accessible client navigation with Link',
    difficulty: B,
    chapter: 'Navigation and performance',
    file: 'app/page.tsx',
    broken: `'use client';
export default function Page(){return <div onClick={()=>window.location.href='/products'}>Products</div>;}`,
    fixed: `import Link from 'next/link';
export default function Page(){return <Link href="/products">Browse products</Link>;}`,
    explanation:
      'An anchor provides native keyboard, context-menu and modified-click behavior. Link integrates eligible internal navigation with the Next.js router; it does not require making the parent a Client Component. A clickable div with window.location loses those semantics and forces a document navigation.',
    checks: [
      'Navigate using keyboard Enter, ordinary click and a modified click.',
      'Check the actual anchor href before hydration.',
      'Inspect prefetch traffic in production, where development behavior may differ.',
    ],
    tweak: 'Should a thousand-card catalog prefetch every destination?',
    answer:
      'Measure first, then disable prefetch on appropriate links or apply intent-based admission. Disabling prefetch must not disable native navigation or make the route dependent on JavaScript-only click handlers.',
    doc: 'app/api-reference/components/link',
  },
  {
    slug: 'generate-static-params',
    title: 'Match generateStaticParams to the dynamic segment',
    difficulty: B,
    chapter: 'App Router foundations',
    file: 'app/docs/[slug]/page.tsx',
    broken: `export function generateStaticParams(){return [{id:'intro'}];}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <h1>{(await params).slug}</h1>;}`,
    fixed: `export function generateStaticParams(){return [{slug:'intro'},{slug:'routing'}];}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <h1>{(await params).slug}</h1>;}`,
    explanation:
      'The returned object keys must match the filesystem’s dynamic segment names. Static param enumeration is a build-time sampling decision; it is not a request-time authorization list or a promise that it is rerun on every revalidation. Dynamic fallback policy depends on the selected rendering model and configuration.',
    checks: [
      'Build and inspect generated intro/routing routes.',
      'Request a slug outside the list and record the configured behavior.',
      'Repeat after changing the source list; distinguish a new build from cache revalidation.',
    ],
    tweak: 'What if the catalog has a million slugs?',
    answer:
      'Prebuild a valuable bounded subset or generate on demand under a supported deployment model. Quantify build time, origin load and first-request latency; do not enumerate unbounded tenant data without a budget.',
    doc: 'app/api-reference/functions/generate-static-params',
  },
  {
    slug: 'metadata-server-boundary',
    title: 'Keep metadata exports in a Server Component',
    difficulty: B,
    chapter: 'Metadata and assets',
    file: 'app/about/page.tsx',
    broken: `'use client';
export const metadata={title:'About'};
export default function Page(){return <h1>About</h1>;}`,
    fixed: `import type { Metadata } from 'next';
export const metadata:Metadata={title:'About Engineering Lab',description:'Version-aware engineering practice.'};
export default function Page(){return <h1>About Engineering Lab</h1>;}`,
    explanation:
      'Metadata exports belong to the server route module. Extract any interactive part into a separate client leaf rather than marking the metadata owner client-side. Metadata inheritance and streaming are framework behavior, so inspect the real output instead of manually appending competing head tags in an effect.',
    checks: [
      'Build without a client metadata-export error.',
      'Inspect the rendered title and description on a direct request.',
      'Navigate client-side to and from the route and verify the head updates.',
    ],
    tweak:
      'How do you avoid duplicate product fetches in generateMetadata and Page?',
    answer:
      'Share the appropriate server data function and understand request memoization versus persistent caching. Both consumers must use the same admitted key and error policy; do not create a second public HTTP hop to your own Route Handler.',
    doc: 'app/api-reference/functions/generate-metadata',
  },
  {
    slug: 'image-dimensions',
    title: 'Reserve image space and constrain remote sources',
    difficulty: B,
    chapter: 'Metadata and assets',
    file: 'app/product-image.tsx',
    broken: `import Image from 'next/image';
export default function ProductImage(){return <Image src="https://images.example.com/product.jpg" alt="Product"/>;}`,
    fixed: `import Image from 'next/image';
export default function ProductImage(){return <Image src="https://images.example.com/catalog/product.jpg" alt="Blue insulated bottle" width={640} height={480} sizes="(max-width: 768px) 100vw, 640px"/>;}
// next.config.ts: images.remotePatterns must admit only the intended HTTPS host/path.`,
    explanation:
      'Dimensions or a correctly sized fill container establish aspect ratio before the image arrives. A meaningful alt describes the content’s purpose; decorative images use empty alt. A bounded remotePatterns policy is separate from responsive sizing and prevents treating arbitrary user URLs as trusted optimization inputs.',
    checks: [
      'Configure the exact allowed host and /catalog/** path in the local lab.',
      'Verify an off-policy URL is rejected.',
      'Measure layout shift and requested image width on mobile and desktop.',
    ],
    tweak: 'How does critical-image loading differ in 15 and 16?',
    answer:
      'The exercise deliberately avoids a version-sensitive loading hint. In 15 inspect priority behavior; in 16 consult the current preload/fetchPriority guidance and avoid preloading competing images indiscriminately. Verify the actual LCP resource and network priority.',
    doc: 'app/api-reference/components/image',
  },
  {
    slug: 'font-ownership',
    title: 'Load a font once in the root layout',
    difficulty: B,
    chapter: 'Metadata and assets',
    file: 'app/layout.tsx',
    broken: `export default function Layout({children}:{children:React.ReactNode}){return <html><body><link rel="stylesheet" href="https://fonts.example.com/font.css"/>{children}</body></html>;}`,
    fixed: `import localFont from 'next/font/local';
const ui=localFont({src:'./fonts/ui.woff2',display:'swap',variable:'--font-ui'});
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body className={ui.className}>{children}</body></html>;}
// Supply a licensed ui.woff2 at app/fonts/ui.woff2 in this lab.`,
    explanation:
      'next/font keeps font ownership near the layout and avoids repeated runtime stylesheet insertion. A local file makes the build input explicit and can avoid remote build-time fetching. The lab must supply the licensed font asset; the source snippet does not pretend to include binary font content.',
    checks: [
      'Provide the local font and build offline.',
      'Verify pages share the same generated font styling.',
      'Check fallback readability and layout shift while the font loads.',
    ],
    tweak: 'Why might a CI build fail with a Google font?',
    answer:
      'Font optimization can need network access during the build. Make that dependency explicit, permit the required fetch or use a licensed local asset; do not fix it by quietly disabling all optimization or hiding build failures.',
    doc: 'app/getting-started/fonts',
  },
  {
    slug: 'scoped-css',
    title: 'Scope a component style without global collisions',
    difficulty: M,
    chapter: 'App Router foundations',
    file: 'app/card.tsx',
    broken: `import './card.css';
export default function Card(){return <article className="title">Invoice</article>;}`,
    fixed: `import styles from './card.module.css';
export default function Card(){return <article className={styles.title}>Invoice</article>;}
// card.module.css is a separate file containing: .title { padding: 1rem; border: 1px solid currentColor; }`,
    explanation:
      'A generic global class can collide with unrelated route content, particularly as layouts persist and styles accumulate. CSS Modules scope component classes while root global styles retain their deliberate application-wide role. Style scoping is not a reason to move server-rendered content into the client graph.',
    checks: [
      'Render a second component that uses an unrelated title class.',
      'Navigate between routes repeatedly and compare computed styles.',
      'Build production output and verify generated module class names are applied.',
    ],
    tweak: 'When would you keep a global stylesheet?',
    answer:
      'For intentional resets, typography variables, theme tokens and global utilities. Define ownership and order rather than converting every reusable token into a private module.',
    doc: 'app/getting-started/css',
  },
  {
    slug: 'route-group-collision',
    title: 'Detect colliding URLs hidden by route groups',
    difficulty: M,
    chapter: 'Routing composition',
    file: 'route-plan.ts',
    broken: `export const files=['app/(shop)/about/page.tsx','app/(marketing)/about/page.tsx'];`,
    fixed: `export const files=['app/(shop)/products/page.tsx','app/(marketing)/about/page.tsx'];
// Route groups organize layouts; parentheses do not create URL path segments.`,
    explanation:
      'Both defective files resolve to /about because route groups are omitted from URLs. Resolve the conflict intentionally instead of assuming group names namespace public paths. Multiple root layouts also have navigation implications and must be tested as part of route ownership.',
    checks: [
      'Build the defective plan in a disposable lab and observe the conflict.',
      'Build the revised route tree and directly request both URLs.',
      'Test navigation across multiple root layouts if the architecture uses them.',
    ],
    tweak: 'How do private folders differ from route groups?',
    answer:
      'Private _folders opt a subtree out of routing, while (groups) organize routes without adding URL segments. A private folder is an organizational mechanism, not a server authorization boundary.',
    doc: 'app/api-reference/file-conventions/route-groups',
  },
  {
    slug: 'parallel-slot-default',
    title: 'Provide a hard-navigation fallback for a parallel slot',
    difficulty: M,
    chapter: 'Routing composition',
    file: 'app/dashboard/@analytics/default.tsx',
    broken: `// No default.tsx exists; the team only tested soft navigation.`,
    fixed: `export default function AnalyticsDefault(){return <p>Choose a report to load analytics.</p>;}`,
    explanation:
      'A parallel slot’s active state during soft navigation may not be recoverable on a full load. Provide the intended default fallback and consider the implicit children slot as well. A slot is not a URL segment; guessing its active subpage on refresh can produce an unexpected 404 or incorrect content.',
    checks: [
      'Navigate softly into an analytics subpage.',
      'Reload a sibling URL directly and inspect the fallback.',
      'Verify children and each named slot have deliberate unmatched-route behavior.',
    ],
    tweak: 'Should a privileged slot rely on being hidden?',
    answer:
      'No. Authorize its underlying read and any actions independently. Slot visibility and navigation state are presentation concerns, not access controls.',
    doc: 'app/api-reference/file-conventions/parallel-routes',
  },
  {
    slug: 'intercepted-modal',
    title: 'Close a route modal using navigation semantics',
    difficulty: M,
    chapter: 'Routing composition',
    file: 'app/@modal/(.)photo/[id]/close.tsx',
    broken: `'use client';
export default function Close(){return <button onClick={()=>location.href='/'}>Close</button>;}`,
    fixed: `'use client';
import { useRouter } from 'next/navigation';
export default function Close(){const router=useRouter();return <button type="button" onClick={()=>router.back()}>Close photo</button>;}
// The full-page photo route and @modal/default.tsx remain separate route files.`,
    explanation:
      'An intercepted soft navigation can present the destination as a modal while a direct request renders its full page. Closing should restore the prior navigation state. The dialog also needs focus entry, escape handling and focus restoration; changing history alone does not implement an accessible modal.',
    checks: [
      'Open a photo through a soft link and close it.',
      'Directly load the photo URL and confirm a useful full-page route.',
      'Verify back/forward behavior, keyboard focus and an unmatched modal-slot fallback.',
    ],
    tweak: 'What if there is no trusted back-stack entry?',
    answer:
      'Define how users reach the modal, and supply a deliberate fallback destination for entry modes without an originating page. Avoid assuming every hard-loaded route has a safe history entry.',
    doc: 'app/api-reference/file-conventions/intercepting-routes',
  },
  {
    slug: 'client-search-suspense',
    title: 'Contain a client useSearchParams read with Suspense',
    difficulty: M,
    chapter: 'Routing and URL state',
    file: 'app/search/page.tsx',
    broken: `import Search from './search-client';
export default function Page(){return <Search/>;}
// search-client.tsx calls useSearchParams on a statically rendered route.`,
    fixed: `import { Suspense } from 'react';
import Search from './search-client';
export default function Page(){return <><h1>Search</h1><Suspense fallback={<p>Reading query…</p>}><Search/></Suspense></>;}`,
    explanation:
      'A development render can mask the production behavior of a static route with a client search-parameter read. Put the client subtree behind a deliberate Suspense boundary so the surrounding page can retain its rendering strategy. If the requirement is a request-time page, make that choice explicitly instead of accidentally bailing out the entire shell.',
    checks: [
      'Implement the documented client hook and run a production build.',
      'Request with and without a query string.',
      'Check that the heading remains meaningful during the fallback and no unintended full-page client bailout occurs.',
    ],
    tweak: 'Could the page read searchParams on the server instead?',
    answer:
      'Yes, if server-owned query-dependent rendering is desired. Await the page prop and pass admitted data into the client island, while documenting the request-time rendering and cache implications.',
    doc: 'app/api-reference/functions/use-search-params',
  },
  {
    slug: 'server-content-slot',
    title: 'Compose server-fetched content through a client slot',
    difficulty: M,
    chapter: 'Server and client boundaries',
    file: 'app/page.tsx',
    broken: `'use client';
import SecretReport from './secret-report';
export default function Page(){return <SecretReport/>;}`,
    fixed: `import TogglePanel from './toggle-panel';
import SecretReport from './secret-report';
export default function Page(){return <TogglePanel><SecretReport/></TogglePanel>;}
// toggle-panel.tsx is a client leaf accepting children: React.ReactNode.
// secret-report.tsx remains a server module and authorizes its own data read.`,
    explanation:
      'A server parent owns the server data component and passes rendered content into the interactive client container. The client module does not import the server-only dependency. Remember that rendered content sent to a browser is visible to that browser, even while collapsed; a toggle is not a permission boundary.',
    checks: [
      'Mark the report data module server-only and build.',
      'Verify the toggle remains interactive.',
      'Inspect the initial payload and prove no unauthorized or secret report is sent.',
    ],
    tweak: 'How do you avoid fetching a report until it is authorized?',
    answer:
      'Authorize before the read, close to the data source. If the product requires explicit lazy retrieval, design an authenticated read boundary and state flow rather than assuming hidden children are never evaluated.',
    doc: 'app/getting-started/server-and-client-components',
  },
];
