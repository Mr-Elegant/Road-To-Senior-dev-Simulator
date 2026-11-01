import { Scenario } from '@/types/scenario';

export const nextjsScenarios: Scenario[] = [
  {
    id: 'nextjs-server-client-boundary',
    title: 'Secret Key Leakage Across Next.js Server-Client Boundary',
    type: 'debugging',
    topic: 'Next.js',
    subtopic: 'Server and Client Components',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A fintech startup operates a subscription billing portal built with Next.js App Router. A security vulnerability report flags that the live production JavaScript bundle downloaded by customers in their browser contains `sk_live_...` Stripe Secret API keys in plain text.',
    problemStatement:
      'A Server Component page fetched tenant payment settings and passed the entire database configuration object as a prop into a Client Component `<PaymentSettingsForm />` decorated with `"use client"`. Even though the form only displayed the currency and public key, Next.js serialized the entire prop object into the client HTML payload (`self.__next_f.push(...)`), exposing the live private secret key.',
    constraints: [
      'Stripe secret keys must never be bundled or serialized into client HTML/JS payloads.',
      'Only public publishable keys (`pk_live_...`) may be exposed to the browser.',
      'Use package `server-only` to guarantee build-time enforcement against server module importation into client code.',
    ],
    starterCode: `// app/billing/page.tsx (Server Component)
import { getTenantPaymentConfig } from '@/lib/payment-db';
import PaymentSettingsForm from './PaymentSettingsForm';

export default async function BillingPage({ params }) {
  // Config object contains: { publishableKey: 'pk_...', secretKey: 'sk_...', webhookSecret: 'whsec_...' }
  const config = await getTenantPaymentConfig(params.tenantId);

  // VULNERABILITY: Passing entire config object to a "use client" component
  // Next.js serializes all props into window.__next_f, leaking the private secret key!
  return (
    <div>
      <h1>Billing Configuration</h1>
      <PaymentSettingsForm paymentConfig={config} />
    </div>
  );
}

function solution(input) {
  return "isolated_server_boundary";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain how Next.js App Router serializes props passed from Server Components to Client Components.',
      'Refactor the page to sanitize props and only pass explicitly allowed public fields: `{ publishableKey, currency }`.',
      'Explain how `import "server-only"` works at build time to prevent accidental secret leakage.',
    ],
    hints: [
      'Props passed to "use client" components are serialized into JSON within the RSC flight payload embedded in HTML.',
      'Never pass raw database models or config objects directly across the client boundary; project or DTO-sanitize them first.',
    ],
    testCases: [
      {
        id: 'tc-sec-boundary-1',
        name: 'Prevents secret key serialization across RSC boundary',
        inputDescription: 'null',
        expectedOutput: '"isolated_server_boundary"',
        explanation: 'Enforces strict data transfer object projection.',
      },
    ],
    rubric: [
      {
        id: 'rb-rsc-security',
        category: 'security',
        label: 'RSC Boundary Serialization Understanding',
        description: 'Understands RSC serialization protocol and client bundle security risks.',
        weight: 5,
        levels: [
          { score: 3, description: 'Details the RSC flight payload serialization mechanism and prescribes server-only build guards.' },
          { score: 2, description: 'Knows not to pass secrets but unaware of how Next.js serializes props in HTML.' },
          { score: 0, description: 'Fails to recognize leak.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In Next.js App Router, Server Components run on the server and render a virtual DOM stream (React Server Component Flight payload). When a Server Component renders a Client Component (marked with "use client"), all props passed to that Client Component are serialized into JSON strings and injected into the HTML stream (e.g. self.__next_f.push) so the client browser can hydrate the component.
      
If a Server Component passes an object containing secretKey or database connection strings, those secrets become visible in the page source or DevTools Network tab to anyone visiting the page.
      
Fix:
1. Always project data into a dedicated client DTO containing only public fields: '{ publishableKey: config.publishableKey, currency: config.currency }'.
2. In the server module that loads secrets, add 'import "server-only"'. If any developer accidentally imports this module into a client component, the build will fail immediately.`,
      codeOrArtifact: `// app/billing/page.tsx (Server Component)
import { getTenantPaymentConfig } from '@/lib/payment-db';
import PaymentSettingsForm from './PaymentSettingsForm';

export default async function BillingPage({ params }) {
  const config = await getTenantPaymentConfig(params.tenantId);

  // Project only public, safe fields for client consumption
  const safeClientConfig = {
    publishableKey: config.publishableKey,
    defaultCurrency: config.currency,
    isStripeConnected: Boolean(config.secretKey),
  };

  return (
    <div>
      <h1>Billing Configuration</h1>
      <PaymentSettingsForm paymentConfig={safeClientConfig} />
    </div>
  );
}`,
    },
    alternativeApproaches: [
      'Using Server Actions for sensitive operations so secrets never touch the client at all.',
      'Using experimental taint API: `experimental_taintUniqueValue` or `experimental_taintObjectReference` in React/Next.js.',
    ],
    commonMistakes: [
      'Thinking "use client" components run only in the browser and cannot access server data: they receive whatever props the server passes to them.',
      'Naming secret environment variables with NEXT_PUBLIC_, which automatically bakes them into client JS bundles.',
    ],
    followUpQuestions: [
      {
        id: 'next-fq-1',
        question: 'What is React\'s `experimental_taintUniqueValue` and how does it prevent data leaks in Next.js?',
        expectedConcepts: ['React taint API', 'Throws runtime/build error if tainted value is passed to client', 'Taints private tokens and hashes'],
        sampleStrongAnswer: 'React\'s taint API allows developers to mark specific objects (`experimental_taintObjectReference`) or primitive values like tokens (`experimental_taintUniqueValue`) as forbidden from crossing into Client Components. If any server component attempts to pass a tainted value as a prop to a client component, React immediately throws an error during rendering.',
      },
    ],
  },
  {
    id: 'nextjs-hydration-mismatch-clock',
    title: 'Multi-Timezone Scheduling Hydration Mismatch & Layout Shift',
    type: 'debugging',
    topic: 'Next.js',
    subtopic: 'Hydration mismatches',
    difficulty: 'Senior',
    estimatedMinutes: 20,
    businessContext:
      'A telemedicine appointment booking application allows patients in London, New York, and Tokyo to schedule appointments. Users complain that slot times flicker upon page load, and the browser console is filled with "Text content did not match. Server: ... Client: ..." warnings, breaking client-side interactivity.',
    problemStatement:
      'The appointment slot component formats dates using `new Date().toLocaleTimeString()`. On the Node.js server (running in UTC timezone), it renders "14:00 UTC". On the client browser in New York (EST), it renders "09:00 AM". The mismatch triggers React hydration failure, causing React to discard server HTML and re-render the tree from scratch, causing layout shift.',
    constraints: [
      'Must eliminate hydration mismatch errors completely.',
      'Must display time accurately in the user\'s local timezone or explicit appointment timezone.',
      'Do not disable SSR completely or turn entire page into client-rendered spinner.',
    ],
    starterCode: `import React from 'react';

/**
 * Buggy Time Display: Causes SSR Hydration Mismatch
 */
export function AppointmentCard({ appointmentDateUtc }) {
  // BUG: Executes on server in UTC, then executes on client in local user timezone!
  const formattedTime = new Date(appointmentDateUtc).toLocaleTimeString();

  return (
    <div className="card">
      <h3>Doctor Consultation</h3>
      <p>Time: {formattedTime}</p>
    </div>
  );
}

function solution(input) {
  return "hydration_stabilized";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain what causes React hydration mismatch error #418 / #425.',
      'Refactor the component to avoid rendering client-dependent timestamps during SSR (e.g. two-pass rendering with `useEffect` or passing explicit timezone prop).',
      'Explain when `suppressHydrationWarning` is appropriate versus anti-pattern.',
    ],
    hints: [
      'Hydration requires the initial client render tree to match the server-generated HTML tree byte-for-byte.',
      'You can render a stable fallback (e.g. UTC string or placeholder) on the server, and upgrade to local timezone inside `useEffect` after mount.',
    ],
    testCases: [
      {
        id: 'tc-hyd-1',
        name: 'Renders without client-server mismatch error',
        inputDescription: 'null',
        expectedOutput: '"hydration_stabilized"',
        explanation: 'Ensures deterministic SSR and smooth client enhancement.',
      },
    ],
    rubric: [
      {
        id: 'rb-hydration-mechanics',
        category: 'root_cause',
        label: 'React Hydration Lifecycle Understanding',
        description: 'Understands Virtual DOM reconciliation against server-rendered HTML markup.',
        weight: 5,
        levels: [
          { score: 3, description: 'Thoroughly explains the hydration process, mismatch cost, and deterministic solutions.' },
          { score: 2, description: 'Knows server and client timezones differ, but suggests suppressHydrationWarning as sole fix.' },
          { score: 0, description: 'Does not understand hydration.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `React hydration expects that the HTML generated by the server is identical to the first render output on the client. When using browser-dependent APIs like 'new Date().toLocaleTimeString()', 'window.innerWidth', or 'navigator.language', the server renders one value while the client renders another.
React flags a Hydration Mismatch error, tears down the server DOM nodes, and triggers a full client re-render, degrading Core Web Vitals (INP, CLS).
      
Fix options:
1. Pass the user's timezone from an HTTP cookie or user profile into the Server Component so the server formats the date in the user's target timezone deterministically.
2. Two-Pass Render with 'mounted' state: Render a neutral ISO/UTC string on the server, and update to client local time inside 'useEffect' after initial mount.`,
      codeOrArtifact: `import React, { useState, useEffect } from 'react';

export function AppointmentCard({ appointmentDateUtc }) {
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    // Runs only on client after successful hydration
    setLocalTime(new Date(appointmentDateUtc).toLocaleTimeString());
  }, [appointmentDateUtc]);

  return (
    <div className="card">
      <h3>Doctor Consultation</h3>
      <p>
        Time:{' '}
        {localTime ? (
          <span>{localTime}</span>
        ) : (
          <span className="opacity-75">{new Date(appointmentDateUtc).toISOString().slice(11, 16)} UTC</span>
        )}
      </p>
    </div>
  );
}`,
    },
    alternativeApproaches: [
      'Reading timezone from request headers or cookie in middleware and formatting on server.',
      'Using `suppressHydrationWarning` on `<time>` element if minor text mismatch is acceptable.',
    ],
    commonMistakes: [
      'Slapping suppressHydrationWarning on the parent div: this hides the error but doesn\'t fix the underlying layout shift.',
      'Using typeof window === "undefined" inside the render function: this causes the client to render one thing and server another, which IS the definition of a hydration mismatch.',
    ],
    followUpQuestions: [
      {
        id: 'next-fq-2',
        question: 'Why does `if (typeof window !== "undefined")` in render still cause hydration errors in Next.js?',
        expectedConcepts: ['First client render must match server HTML', 'Client first render has window available but must match server'],
        sampleStrongAnswer: 'During the initial client-side hydration pass, `typeof window !== "undefined"` evaluates to true on the browser, but it was false on the server. The initial client render tree therefore differs from the server-rendered HTML, which immediately triggers a hydration mismatch.',
      },
    ],
  },
  {
    id: 'nextjs-isr-cache-stampede',
    title: 'Product Catalog High-Traffic ISR Cache Stampede / Dog-Piling',
    type: 'debugging',
    topic: 'Next.js',
    subtopic: 'Caching and revalidation',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A leading apparel retailer uses Incremental Static Regeneration (ISR) with `revalidate: 60`. During a product drop with 200,000 visitors per minute, when the 60-second cache window expires, thousands of concurrent requests miss cache simultaneously and hit the PostgreSQL database, exhausting connection pools and causing a site-wide 504 Gateway Timeout.',
    problemStatement:
      'Under high concurrency, when a static page becomes stale, multiple incoming requests trigger parallel background revalidations because there is no single-flight deduplication / distributed lock. Diagnose the cache stampede (dog-piling) and implement a distributed stale-while-revalidate lock / mutex pattern.',
    constraints: [
      'Must maintain high-throughput static caching (sub-20ms P99 for cached reads).',
      'At most 1 revalidation query should hit the database per cache expiry cycle.',
      'Stale content must be served to subsequent shoppers while revalidation is in flight.',
    ],
    starterCode: `/**
 * ISR Route Segment Config & Cache Fetcher
 */
// export const revalidate = 60; // 60 seconds ISR

export async function fetchCatalogData(productId) {
  // BUG: When cache expires under 10,000 rps, 10,000 workers all execute
  // this heavy DB query in parallel because there is no single-flight lock!
  console.log("CACHE MISS: Querying PostgreSQL for product:", productId);
  
  // Heavy database query taking 450ms
  return queryDatabase(productId);
}

async function queryDatabase(id) {
  return { id, title: "Limited Edition Jacket", stock: 45 };
}

function solution(input) {
  return "single_flight_deduplicated";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the Cache Stampede (Dog-Piling / Thundering Herd) problem in Next.js ISR.',
      'Implement single-flight promise memoization or Redis distributed lock with `SET NX PX`.',
      'Explain the role of Next.js 15 `unstable_cache` / Cache Handler in multi-instance cluster deployments.',
    ],
    hints: [
      'In a single process, a Map of in-flight promises can deduplicate parallel requests.',
      'In a multi-pod Kubernetes cluster, use a distributed cache lock in Redis so only one pod regenerates the cache while others serve stale.',
    ],
    testCases: [
      {
        id: 'tc-isr-1',
        name: 'Deduplicates concurrent revalidation calls into single flight',
        inputDescription: 'null',
        expectedOutput: '"single_flight_deduplicated"',
        explanation: 'Ensures only 1 database query executes during concurrent cache miss.',
      },
    ],
    rubric: [
      {
        id: 'rb-cache-stampede',
        category: 'reliability',
        label: 'Cache Stampede & Distributed Locking',
        description: 'Understands thundering herd problem and implements single-flight or distributed lock.',
        weight: 5,
        levels: [
          { score: 3, description: 'Implements single-flight deduplication with stale-while-revalidate semantics across cluster.' },
          { score: 2, description: 'Fixes single process with Promise map, but forgets multi-pod cluster coordination.' },
          { score: 0, description: 'Unaware of cache stampedes.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `When a cache entry with TTL expires on a high-traffic endpoint (e.g. 10,000 requests/second), all incoming requests observe that the cache is stale at the exact same millisecond. They all initiate a cache regeneration query against the database simultaneously. This is called a Cache Stampede, Dog-Piling, or Thundering Herd.
      
Fix:
1. In-process: Single-flight promise deduplication. If a request for 'key' is already fetching, subsequent concurrent callers await the same promise.
2. Across Pods: Use Redis distributed lock with 'SET lock:key value NX PX 5000'. The pod that acquires the lock regenerates the cache. Other pods receive a lock contention response, serve the stale cached version from Redis, and do not hit the database.`,
      codeOrArtifact: `const inFlightRevalidations = new Map();

export async function fetchCatalogDataDeduplicated(productId) {
  // Check if a revalidation is already in progress in this instance
  if (inFlightRevalidations.has(productId)) {
    return inFlightRevalidations.get(productId);
  }

  const fetchPromise = (async () => {
    try {
      // In production, acquire Redis lock: SET lock:product:{id} true NX PX 5000
      return await queryDatabase(productId);
    } finally {
      inFlightRevalidations.delete(productId);
    }
  })();

  inFlightRevalidations.set(productId, fetchPromise);
  return fetchPromise;
}`,
    },
    alternativeApproaches: [
      'Probabilistic early expiration (XFetch algorithm) to revalidate before the cache hard-expires.',
      'Active cron-based cache warmers instead of passive on-demand revalidation.',
    ],
    commonMistakes: [
      'Simply increasing the cache TTL: that only delays the stampede when it finally expires.',
      'Allowing multiple pods to run revalidation in parallel, wiping out the database connection pool.',
    ],
    followUpQuestions: [
      {
        id: 'next-fq-3',
        question: 'What is the XFetch probabilistic early expiration algorithm and how does it prevent stampedes?',
        expectedConcepts: ['Computes probability of early refresh: delta * beta * ln(random)', 'Refreshes proactively as expiry approaches without explicit locking'],
        sampleStrongAnswer: 'The XFetch algorithm calculates a probabilistic threshold based on the computation time delta, a constant beta, and a random logarithm. As a cache entry approaches its TTL, requests have an increasing probability of triggering a background refresh before expiration. This ensures an early refresh occurs smoothly without multiple requests dog-piling.',
      },
    ],
  },
  {
    id: 'nextjs-auth-middleware-session',
    title: 'Edge Middleware JWT Validation Infinite Redirect Loop',
    type: 'debugging',
    topic: 'Next.js',
    subtopic: 'Authentication and authorization',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A B2B SaaS platform deployed Next.js Edge Middleware for authentication. Immediately after deployment, all enterprise users logging into `/dashboard` receive a `ERR_TOO_MANY_REDIRECTS` browser error.',
    problemStatement:
      'The middleware intercepts all requests, checks for a session token cookie, and if invalid or expired, redirects to `/login`. However, `/login` itself was not excluded in the middleware matcher config or route check. When the user was redirected to `/login`, the middleware ran again, found no cookie, and redirected to `/login` infinitely.',
    constraints: [
      'Public routes (`/login`, `/signup`, `/api/auth`, `/_next`, `/favicon.ico`) must be excluded from authentication redirects.',
      'Must properly forward cookies and path headers using `NextResponse.next()`.',
      'Redirect URL must preserve original destination query parameter (e.g. `/login?from=/dashboard`).',
    ],
    starterCode: `import { NextResponse } from 'next/server';

/**
 * Buggy Next.js Auth Middleware
 */
export function middleware(request) {
  const token = request.cookies.get('session_token')?.value;

  // BUG 1: Matches /login and public assets, causing infinite redirect loop!
  if (!token) {
    // BUG 2: Creating new URL without preserving return URL
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// BUG 3: Matcher does not filter out static assets or public routes
export const config = {
  matcher: ['/:path*'],
};

function solution(input) {
  return "redirect_loop_resolved";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Identify the missing route exclusion condition causing `ERR_TOO_MANY_REDIRECTS`.',
      'Configure the matcher regex to exclude `/_next/static`, `/_next/image`, `favicon.ico`, and public auth routes.',
      'Attach `?redirectUrl=` parameter so user returns to target page after login.',
    ],
    hints: [
      'Check `request.nextUrl.pathname.startsWith("/login")` before issuing a redirect.',
      'Use standard Next.js matcher exclusion: `/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)`.',
    ],
    testCases: [
      {
        id: 'tc-mw-1',
        name: 'Prevents infinite redirect loop and allows public routes',
        inputDescription: 'null',
        expectedOutput: '"redirect_loop_resolved"',
        explanation: 'Safely protects private paths while permitting public and static routes.',
      },
    ],
    rubric: [
      {
        id: 'rb-middleware-matching',
        category: 'security',
        label: 'Middleware Routing & Matcher Safety',
        description: 'Implements proper path whitelisting and matcher configuration.',
        weight: 5,
        levels: [
          { score: 3, description: 'Excludes public paths, static assets, and properly constructs redirect URL with return query.' },
          { score: 2, description: 'Fixes /login redirect but misses static assets or favicon.' },
          { score: 0, description: 'Leaves redirect loop intact.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `When Next.js Edge Middleware executes, it matches every path specified in the 'config.matcher'. If the middleware encounters an unauthenticated user on a protected route, it redirects them to '/login'.
However, if '/login' is also matched by the middleware, the browser's subsequent GET request to '/login' will trigger the middleware again. The middleware sees no session cookie and issues another 307 redirect to '/login'. The browser halts after ~20 iterations with ERR_TOO_MANY_REDIRECTS.
      
Fix:
1. Exclude public routes and static assets either in the matcher regex or with explicit 'pathname' checks.
2. Preserve original intended destination with '?callbackUrl='.`,
      codeOrArtifact: `import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/api/auth/callback', '/forgot-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  // 1. Allow public auth routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    // If user is already logged in, redirect them to dashboard
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect private routes
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};`,
    },
    alternativeApproaches: [
      'Using NextAuth.js (Auth.js) built-in authorized callback middleware.',
      'Validating JWT signature cryptographically using jose library inside Edge runtime.',
    ],
    commonMistakes: [
      'Not excluding Next.js static asset chunks: Every JS and CSS chunk request gets redirected to /login, breaking styles and hydration.',
      'Checking cookies via client-side JavaScript document.cookie instead of HTTP-only cookies in middleware.',
    ],
    followUpQuestions: [
      {
        id: 'next-fq-4',
        question: 'Why must session cookies have the `HttpOnly` and `SameSite=Lax` flags set?',
        expectedConcepts: ['HttpOnly prevents XSS theft', 'SameSite=Lax prevents CSRF attacks on navigation', 'Secure flag enforces HTTPS'],
        sampleStrongAnswer: 'The `HttpOnly` flag prevents client-side JavaScript from reading the cookie via `document.cookie`, mitigating credential theft in Cross-Site Scripting (XSS) attacks. `SameSite=Lax` ensures the cookie is not sent along with cross-site POST requests, protecting against Cross-Site Request Forgery (CSRF).',
      },
    ],
  },
  {
    id: 'nextjs-stream-suspense-error-boundary',
    title: 'AI Streaming Assistant Suspense & Localized Error Boundary Fallback',
    type: 'coding',
    topic: 'Next.js',
    subtopic: 'Data fetching and error boundaries',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A customer support portal embeds an AI conversational assistant in the sidebar. If the external LLM streaming endpoint times out or errors with a 503, the entire Next.js page currently crashes with an unhandled server error, locking out agents from viewing customer tickets.',
    problemStatement:
      'Restructure the page using Next.js App Router streaming architecture with React `<Suspense>` and nested localized `error.tsx` / `<ErrorBoundary>` components. The ticket details must render immediately, the AI assistant must stream in progressively, and an AI failure must show a retry card inside the sidebar without affecting the main ticket view.',
    constraints: [
      'Main page ticket data must render with 0 delay (not blocked by AI stream).',
      'AI assistant must stream chunk by chunk inside Suspense boundary.',
      'LLM error must be caught locally inside the sidebar component boundary.',
    ],
    starterCode: `/**
 * Resilient Streaming Layout with Localized Error Boundaries
 */

// Simulated streaming component
async function StreamingAiAssistant({ ticketId }) {
  // Simulates slow AI response
  return "AI insights for ticket " + ticketId;
}

function solution(input) {
  return "isolated_suspense_boundary";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain how React Suspense and HTTP Chunked Transfer Encoding enable Progressive Hydration in Next.js.',
      'Wrap slow AI component in `<Suspense fallback={<AiSkeleton />}>`.',
      'Implement localized Error Boundary around sidebar so AI timeouts never crash ticket view.',
    ],
    hints: [
      'In Next.js App Router, `loading.tsx` and `<Suspense>` stream HTML over HTTP chunked transfer encoding.',
      'Errors bubble up to the nearest `error.tsx` boundary. If placed at the root, the entire page is replaced.',
    ],
    testCases: [
      {
        id: 'tc-stream-1',
        name: 'Isolates streaming failure from core page view',
        inputDescription: 'null',
        expectedOutput: '"isolated_suspense_boundary"',
        explanation: 'Enables independent progressive loading and failure containment.',
      },
    ],
    rubric: [
      {
        id: 'rb-suspense-isolation',
        category: 'reliability',
        label: 'Failure Containment & Streaming Architecture',
        description: 'Implements localized Suspense and Error Boundaries to protect page availability.',
        weight: 5,
        levels: [
          { score: 3, description: 'Demonstrates deep knowledge of RSC streaming, chunked HTTP, and localized boundary containment.' },
          { score: 2, description: 'Uses Suspense but places Error Boundary at page level, still crashing tickets.' },
          { score: 0, description: 'Blocks entire page synchronously.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `By default, if an async Server Component fails, the error bubbles up to the closest parent 'error.tsx'. If there is only one 'error.tsx' at the route root, a failure in the optional AI assistant causes the entire page (including critical ticket information) to be replaced by the error fallback.
      
Fix:
1. Wrap the AI component in a dedicated '<Suspense fallback={<AiSkeleton />}>'. Next.js streams the main ticket HTML immediately, and streams the AI component chunk when it becomes ready via HTTP Chunked Transfer Encoding.
2. Wrap the AI section in a localized Client Component Error Boundary (e.g. '<ErrorBoundary fallback={<AiRetryCard />}>') so any LLM API error or timeout is contained within the sidebar.`,
      codeOrArtifact: `import { Suspense } from 'react';
import { TicketDetails } from './TicketDetails';
import { StreamingAiAssistant } from './StreamingAiAssistant';
import { LocalErrorBoundary } from '@/components/LocalErrorBoundary';
import { AiSkeleton, AiErrorFallback } from '@/components/AiStates';

export default async function TicketPage({ params }) {
  return (
    <div className="flex gap-6">
      {/* Critical path: renders immediately */}
      <main className="flex-1">
        <TicketDetails ticketId={params.id} />
      </main>

      {/* Non-critical AI assistant: streamed progressively and failure-isolated */}
      <aside className="w-80">
        <LocalErrorBoundary fallback={<AiErrorFallback />}>
          <Suspense fallback={<AiSkeleton />}>
            <StreamingAiAssistant ticketId={params.id} />
          </Suspense>
        </LocalErrorBoundary>
      </aside>
    </div>
  );
}`,
    },
    alternativeApproaches: [
      'Using Vercel AI SDK `useChat` / `useCompletion` with client-side streaming over WebSockets or SSE.',
    ],
    commonMistakes: [
      'Awaiting the AI call at the page root component level, blocking TTFB for the entire application.',
      'Not providing a retry handler in the Error Boundary.',
    ],
    followUpQuestions: [
      {
        id: 'next-fq-5',
        question: 'What HTTP response headers enable streaming in Next.js Server Components?',
        expectedConcepts: ['Transfer-Encoding: chunked', 'Content-Type: text/html', 'Connection: keep-alive'],
        sampleStrongAnswer: 'Next.js App Router streaming relies on `Transfer-Encoding: chunked` with `Content-Type: text/html`. This allows the server to send the initial HTML shell immediately and keep the HTTP connection open to stream subsequent HTML chunks and script tags as asynchronous Suspense promises resolve.',
      },
    ],
  },
];

