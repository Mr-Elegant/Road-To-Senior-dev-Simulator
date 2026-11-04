import type { DesignDefinition } from './types';
export const nextjsDesigns: DesignDefinition[] = [
  {
    slug: 'tenant-platform',
    title: 'Architect an isolated multi-tenant Next.js SaaS',
    chapter: 'Platform architecture',
    scale: '2,000 tenants; 10,000 peak reads/second; private account data',
    situation:
      'A SaaS proposes deriving its tenant from an arbitrary Host header and caching every dashboard by pathname.',
    requirements: [
      'Resolve only admitted domains to tenants.',
      'Enforce tenant membership on every read and mutation.',
      'Keep public assets cacheable without caching private dashboards globally.',
    ],
    design:
      'Terminate traffic at a trusted ingress and resolve a normalized, allowlisted domain to a server-owned tenant ID. Verify the current actor and tenant membership in the data-access boundary, then constrain database predicates by tenant. Partition cached public representations by tenant, locale and schema/version; keep sensitive per-user data outside shared entries. Separate public shells from runtime private subtrees, document cookie domain/SameSite policy, and never trust a proxy rewrite as object authorization.',
    failure:
      'A custom domain can change ownership while an old cache entry remains. Make domain changes an audited workflow with verification, cache/version rotation and a bounded propagation SLO. Reject ambiguous Host/forwarded-host inputs at the trusted boundary.',
    verification: [
      'Attempt cross-tenant IDs, forged domains and action calls outside Proxy coverage.',
      'Warm caches in tenant A before requesting the same pathname in B.',
      'Revoke membership and verify the documented access-revocation bound.',
    ],
    tweak: 'Should all tenants share one deployment?',
    answer:
      'Compare isolation needs, regional requirements, noisy-neighbor budgets and operational cost. Shared infrastructure can work with strong logical boundaries; high-risk tenants may justify separate deployments and data partitions. Deployment isolation does not remove application authorization.',
    doc: 'app/guides/multi-tenant',
  },
  {
    slug: 'distributed-cache',
    title: 'Design cross-instance cache consistency and invalidation',
    chapter: 'Platform architecture',
    scale:
      '30 stateless instances across two regions; 100,000 cached product representations',
    situation:
      'An in-memory cache appears correct on a single developer server but serves different versions after scale-out.',
    requirements: [
      'Name authoritative state and cache ownership.',
      'Define public stale-serving and private-data exclusion.',
      'Handle invalidation duplication, delay and out-of-order delivery.',
    ],
    design:
      'Keep the database as authority and choose a supported shared cache handler/storage strategy for the selected Next.js rendering model. Partition keys by representation/version and use bounded lifetimes. Publish invalidations through a durable outbox after commit, consume them idempotently, and include entity versions so older updates cannot supersede newer values. Distinguish Next server data/route caches, client Router Cache, CDN caches and browser caches in the read graph.',
    failure:
      'One region can miss an invalidation during a network partition. Bound staleness with expiry and version checks, expose served version/age in telemetry, and define when a representation must fail closed rather than serve stale.',
    verification: [
      'Write through one instance and read through all others.',
      'Delay, duplicate and reorder invalidation events.',
      'Restart instances and measure cold-start/origin amplification against the stated freshness SLO.',
    ],
    tweak: 'Would updateTag make a distributed transaction?',
    answer:
      'No. It expresses a framework cache invalidation operation in an allowed context. Durable business commit, event delivery, cache-handler support and multi-region convergence remain explicit architectural responsibilities.',
    doc: 'app/api-reference/config/next-config-js/cacheHandlers',
  },
  {
    slug: 'commerce-consistency',
    title: 'Separate a cached storefront from authoritative checkout',
    chapter: 'Domain architecture',
    scale:
      '50,000 visitors/minute during a launch; inventory must never go negative',
    situation:
      'A fast cached product page is being used as proof that an item is still available when payment begins.',
    requirements: [
      'Keep product browsing fast.',
      'Reserve stock atomically with bounded expiry.',
      'Handle payment timeouts without duplicate charges.',
    ],
    design:
      'Serve public catalog content under a measured caching policy while treating displayed availability as advisory. Route checkout through authenticated server admission, atomic inventory reservations, idempotent order creation and a durable payment workflow. Keep the database transaction short; persist a reservation and outbox before external calls. Model ambiguous remote outcomes as pending/unknown and reconcile using stable provider idempotency keys. Invalidate public representations after authoritative state transitions, without using cache freshness as a stock lock.',
    failure:
      'The payment provider may commit a charge before the response times out. Do not release stock or create a second charge solely because the HTTP call failed; reconcile the stored order/payment attempt and handle reservation expiry with a defined compensation policy.',
    verification: [
      'Race many buyers for the last unit in real database integration tests.',
      'Crash between reservation, outbox delivery and provider response.',
      'Replay provider webhooks and verify exactly-once business effects through constraints, not process memory.',
    ],
    tweak: 'Can optimistic UI mark the order paid?',
    answer:
      'It can show a pending interaction, but paid must come from an authoritative confirmed transition. Client optimism, Next.js revalidation and a disabled button cannot establish a financial outcome.',
    doc: 'app/guides/backend-for-frontend',
  },
  {
    slug: 'migration-program',
    title: 'Plan a reversible Next.js 15-to-16 production migration',
    chapter: 'Platform architecture',
    scale:
      '400 routes; ten teams; zero planned downtime; existing 15.x production deployment',
    situation:
      'The team proposes upgrading Next, React, bundler, authentication and caching in one unreviewed commit.',
    requirements: [
      'Inventory version-sensitive surfaces.',
      'Retain a tested rollback artifact.',
      'Separate behavioral compatibility from performance adoption.',
    ],
    design:
      'Capture the exact patched baseline, route inventory, build timings, error rate and critical browser journeys. First migrate async request APIs and remove hidden lint/build assumptions while still on 15. In a separate change switch the major and explicitly review Proxy naming, generated metadata props and custom bundler behavior. Keep Cache Components/partial prefetching adoption as deliberate later rendering changes unless required. Run direct and soft navigation, authorization, cache-isolation and packaged-deployment tests, then stage traffic with automatic rollback gates.',
    failure:
      'A rollback of code may encounter data written by the new release. Use backward-compatible schema transitions and versioned payloads; record which changes can actually be reversed rather than equating redeployment with full system rollback.',
    verification: [
      'Compare route status/head/header behavior against the baseline.',
      'Run both version production fixtures.',
      'Exercise rollback under the same data and cache compatibility assumptions used during rollout.',
    ],
    tweak: 'Would you use canary as the meaning of latest?',
    answer:
      'No for this curriculum’s stable baseline. Record stable version and patch support explicitly; evaluate canary features in isolated experiments with separate expectations and rollback, not as an implicit production upgrade.',
    doc: 'app/guides/upgrading/version-16',
  },
  {
    slug: 'streaming-edge-path',
    title: 'Design a streaming path through CDN, proxy and server',
    chapter: 'Delivery architecture',
    scale:
      'Three network hops; p95 useful shell under 400 ms; report data may take 3 seconds',
    situation:
      'Suspense works locally but users receive the entire response only after the slow report finishes.',
    requirements: [
      'Deliver a meaningful initial shell.',
      'Identify buffering and compression boundaries.',
      'Contain dependency failures without leaking private data.',
    ],
    design:
      'Place boundaries below the layouts shared by the relevant navigation, then start only necessary independent work. Trace byte arrival from application through reverse proxy/CDN to the browser; configure supported streaming and inspect compression/buffering behavior. Reserve fallback dimensions and protect private runtime reads. Measure time to useful content rather than equating first byte with a completed interaction. Define how errors after headers commit are represented and observed.',
    failure:
      'After streaming begins, the server cannot reliably replace the committed HTTP status with a later error. Use proper error boundaries and correlation, and avoid promising a 404/500 status from an already-committed successful stream.',
    verification: [
      'Use a controlled delayed child and capture chunk arrival at each hop.',
      'Compare direct loads and sibling client transitions.',
      'Break a late dependency and inspect visible recovery, logs and final response status.',
    ],
    tweak: 'Does disabling all compression solve it?',
    answer:
      'It can reveal a buffering symptom but is not a complete delivery design. Compare supported proxy settings, payload sizes and actual browser performance before accepting a bandwidth or CPU regression.',
    doc: 'app/api-reference/file-conventions/loading',
  },
  {
    slug: 'rsc-data-boundary',
    title: 'Design an auditable RSC data-exposure boundary',
    chapter: 'Security architecture',
    scale:
      'A regulated portal with internal account records and public client islands',
    situation:
      'Developers assume that anything computed in a Server Component cannot reach a browser.',
    requirements: [
      'Prevent sensitive props and errors from crossing the boundary.',
      'Centralize authorized data access.',
      'Provide reviewable DTO contracts and regression evidence.',
    ],
    design:
      'Mark server data modules server-only and define explicit public/actor-scoped DTO projections near the data-access boundary. Authorize before fetching or projecting, then send only values required by the rendered representation. Review children, action results, metadata, errors and RSC payloads as exposure channels. Treat server-only and optional taint mechanisms as guardrails, not substitutes for projection and object authorization. Log redacted identifiers and versioned policy decisions, not raw records.',
    failure:
      'A future database column can silently leak if a DTO spreads a record. Use allowlist construction and a sensitive-field regression fixture; never rely on the client ignoring fields or on collapsed UI hiding serialized content.',
    verification: [
      'Insert sentinel secrets and inspect HTML, RSC, script chunks and action responses.',
      'Test different actors against the same resource ID.',
      'Fail a server read and verify production error redaction.',
    ],
    tweak: 'Would encryption of transport eliminate the risk?',
    answer:
      'TLS protects transport against intermediaries; the authorized browser is still the receiver. Encrypting or hiding framework payload syntax does not authorize delivering secrets to that receiver.',
    doc: 'app/guides/data-security',
  },
  {
    slug: 'regional-data-residency',
    title: 'Plan regional rendering around data residency and latency',
    chapter: 'Delivery architecture',
    scale:
      'EU and India tenants; p95 private-page latency under 900 ms; residency constraints',
    situation:
      'The application pushes every request to the nearest compute region while its database and cache remain in one distant region.',
    requirements: [
      'Keep protected data in admitted regions.',
      'Avoid region-to-database waterfalls.',
      'Define regional failover and legal constraints explicitly.',
    ],
    design:
      'Map trusted tenant identity to an allowed home region and locate authorized reads/mutations near its source of truth. Cache only representations allowed in each region and separate public asset delivery from private data. Bound cross-region dependencies and include region/tenant in telemetry. Choose single-writer or explicit conflict resolution instead of assuming globally distributed rendering provides globally consistent writes. Treat deployment-provider region controls as implementation-specific inputs to the design.',
    failure:
      'The home region may fail while the nearest region remains healthy. Decide which operations can serve stale public data, which can fail over to an admitted replica and which must be unavailable to preserve correctness or residency.',
    verification: [
      'Inject region latency and loss, measuring end-to-end rather than compute-only time.',
      'Inspect cache/object locations and routing decisions for representative tenants.',
      'Rehearse a failover and reconciliation of in-flight mutations.',
    ],
    tweak: 'Is an Edge runtime always faster?',
    answer:
      'No. Runtime compatibility, cold starts, data distance and connection constraints matter. A small function near a user can be slower if it repeatedly crosses an ocean to the database.',
    doc: 'app/guides/self-hosting',
  },
  {
    slug: 'bff-contract',
    title: 'Design a Next.js backend-for-frontend with bounded ownership',
    chapter: 'Domain architecture',
    scale: 'Web UI plus mobile/external consumers; three upstream services',
    situation:
      'One Route Handler proxies arbitrary user URLs with server credentials and buffers unlimited responses.',
    requirements: [
      'Expose an explicit admitted API surface.',
      'Keep credentials server-side.',
      'Bound work and separate public consumer contracts from UI composition.',
    ],
    design:
      'Use server-owned upstream destinations, validated DTOs, per-operation authorization and explicit timeouts/body limits. Keep reusable business/data logic outside the HTTP adapter so Server Components call it directly when appropriate. Expose stable Route Handler contracts to actual HTTP consumers and map upstream errors into documented response shapes. Propagate cancellation and trace context, apply bounded retries only for safe/idempotent operations, and choose streaming versus buffering intentionally.',
    failure:
      'A client-supplied destination can become SSRF or credential exfiltration. Reject arbitrary hosts/redirect chains, constrain egress at the infrastructure layer, and avoid forwarding authentication headers to untrusted origins.',
    verification: [
      'Test malformed, oversized and unauthorized requests.',
      'Inject stalls, partial bodies and non-JSON upstream failures.',
      'Prove no credential crosses an unauthorized host or appears in client errors.',
    ],
    tweak: 'Should mobile clients depend on React Flight payloads?',
    answer:
      'Prefer a documented stable application API for external clients. Framework transport is not a general version-independent public business contract; separate that boundary from internal UI rendering.',
    doc: 'app/guides/backend-for-frontend',
  },
  {
    slug: 'cache-stampede',
    title: 'Protect the origin during cold-cache and invalidation storms',
    chapter: 'Reliability architecture',
    scale:
      '10,000 requests/second; a shared homepage cache expires during a deploy',
    situation:
      'Every instance recomputes an expensive dashboard simultaneously after a broad invalidation.',
    requirements: [
      'Bound concurrent origin work.',
      'Keep freshness and fairness explicit.',
      'Avoid cache locks becoming a permanent failure mode.',
    ],
    design:
      'Choose cache scopes and invalidation granularity based on actual read graphs. Use supported request coalescing/lease behavior in the shared cache or data layer, bounded concurrency and timeouts. Where the product permits it, serve a bounded stale representation while a controlled refresh runs. Warm only a measured valuable set after deployment and jitter refresh scheduling where appropriate. Preserve actor/tenant partitions and do not claim a process-local promise deduplicates work across all instances.',
    failure:
      'A lease owner can crash. Bound lease expiry, prevent obsolete refresh results from overwriting newer versions, and expose refresh queue depth, error rates and served age to operators.',
    verification: [
      'Send a synchronized cold burst across multiple instances.',
      'Kill the refresh owner and verify eventual progress.',
      'Trigger narrow and broad invalidations while measuring database connections and p99 latency.',
    ],
    tweak: 'Can a very long TTL solve the incident?',
    answer:
      'It can hide load by accepting more staleness, but may violate freshness or revocation. Define the product’s stale-service budget and durable source behavior before treating TTL as a capacity strategy.',
    doc: 'app/api-reference/config/next-config-js/cacheHandlers',
  },
  {
    slug: 'authentication-lifecycle',
    title: 'Design session verification, rotation and account switching',
    chapter: 'Security architecture',
    scale:
      '100,000 active sessions; shared-device usage and immediate privileged revocation',
    situation:
      'A global client loading gate blocks navigation on every session refresh and briefly shows the previous account’s history.',
    requirements: [
      'Keep navigation usable during background verification.',
      'Prevent cross-account state reuse.',
      'Define sensitive-operation revocation semantics.',
    ],
    design:
      'Use a server-verified session boundary for privileged reads/actions and a client session state machine distinguishing initial unknown, verified, refreshing and signed-out states. Scope local caches/history by actor identity, cancel or ignore stale responses on account changes, and keep usable public shell/UI mounted during refresh. Prefer secure HTTP-only cookie transport when using cookie sessions and define rotation, expiry and revocation checks. Never treat a cached client session display as authoritative permission to mutate.',
    failure:
      'An old history response can arrive after a second account signs in. Associate each request and merge operation with its initiating actor/version, reject stale ownership and clear private state deliberately on switch.',
    verification: [
      'Delay session and history responses while navigating.',
      'Switch accounts rapidly and replay late responses.',
      'Revoke a privileged session and test real action/data endpoints, not just hidden navigation controls.',
    ],
    tweak: 'Would storing a JWT in localStorage remove the need to check?',
    answer:
      'It does not solve expiry, revocation, changing entitlements or XSS exposure. Choose the session model against explicit requirements and keep current server authorization regardless of client transport.',
    doc: 'app/guides/authentication',
  },
  {
    slug: 'deployment-skew',
    title: 'Handle rolling-deployment client/server version skew',
    chapter: 'Delivery architecture',
    scale: 'Long-lived browser tabs while deployments roll across 20 instances',
    situation:
      'An old tab submits an action after the serving deployment has changed and the team assumes every payload is interchangeable.',
    requirements: [
      'Preserve a usable old-tab experience.',
      'Avoid serving mismatched static assets.',
      'Plan backward-compatible application payloads.',
    ],
    design:
      'Keep immutable build assets available for their supported client lifetime and use the deployment platform’s supported version-skew/affinity strategy where available. Version business payloads and keep additive schema transitions during rolling release. Design user recovery for incompatible action/navigation attempts and avoid silently retrying non-idempotent writes. Observe build/deployment IDs on errors without exposing secrets or assuming a deployment ID alone migrates sessions and data.',
    failure:
      'The CDN may retain an old HTML document while its referenced chunks are deleted. Retain assets through the support window, coordinate cache headers and verify that rollback assets remain fetchable.',
    verification: [
      'Open a tab on release A, roll to B, then navigate and mutate.',
      'Test mixed instances and a partial deployment rollback.',
      'Verify chunk availability, action error handling and mutation idempotency under skew.',
    ],
    tweak: 'Can you fix all skew with a forced reload?',
    answer:
      'Reload is a recovery option, not a consistency protocol. Preserve drafts where appropriate, detect incompatibility before repeating writes and retain old assets while managing application/API compatibility.',
    doc: 'app/guides/self-hosting',
  },
  {
    slug: 'observability-slo',
    title: 'Build an actionable Next.js latency and reliability SLO',
    chapter: 'Reliability architecture',
    scale:
      'p95 route interaction under 1 second; 99.9% successful authenticated operations',
    situation:
      'The only metric is next build duration, yet users report slow navigation and intermittent action failures.',
    requirements: [
      'Measure user-visible and server dependency boundaries.',
      'Separate cold/warm and direct/soft navigation.',
      'Link alerts to operational response.',
    ],
    design:
      'Define successful operations, excluded conditions and a measurement window before choosing an error budget. Collect real-user navigation/LCP/interaction signals, server route/action traces, dependency duration and cache hit/age data with correlated request and deployment IDs. Segment by region and route family, sample responsibly and redact sensitive attributes. Alert on burn rate and sustained user impact, with runbooks that distinguish origin latency, buffering, hydration, session gates and cache misses.',
    failure:
      'A global average can hide a tenant-specific outage or a cold-cache tail. Preserve bounded-cardinality cohorts and inspect distributions; do not attach arbitrary user emails or full URLs as unbounded metric labels.',
    verification: [
      'Inject latency separately into auth, database and client code.',
      'Confirm an alert points to useful diagnostic evidence and a bounded mitigation.',
      'Compare cold/warm and direct/client navigation measurements without combining unlike events.',
    ],
    tweak: 'Would more telemetry always improve diagnosis?',
    answer:
      'Unbounded logs and high-cardinality metrics can create cost, privacy and reliability problems. Instrument a causal model with useful sampling and retention, and measure the telemetry pipeline’s own failure behavior.',
    doc: 'app/guides/instrumentation',
  },
  {
    slug: 'cms-publishing',
    title: 'Design CMS publishing with draft isolation and bounded freshness',
    chapter: 'Domain architecture',
    scale:
      '10,000 content routes; editors need immediate previews; public freshness under 60 seconds',
    situation:
      'The CMS webhook invalidates every page and draft content sometimes appears in the public cache.',
    requirements: [
      'Separate draft and published representations.',
      'Authenticate and deduplicate publishing events.',
      'Bound invalidation fan-out and observe convergence.',
    ],
    design:
      'Resolve CMS events through signature verification, durable event admission and a server-owned content/tag map. Keep draft-mode access authenticated and separate from public cache entries. Publish an authoritative content version, then invalidate the affected entity/list/path representations according to the freshness contract. Use current revalidation APIs in allowed contexts, and expose publication version/age in operational telemetry. Preview correctness must not require sharing an editor’s cookie with the public CDN.',
    failure:
      'Out-of-order publish/unpublish events can revive withdrawn content. Compare version/sequence semantics at the authoritative boundary and make unpublish/revocation propagation a distinct correctness requirement.',
    verification: [
      'Replay, duplicate and reorder CMS events.',
      'Warm public caches before opening an authenticated draft preview.',
      'Unpublish content and measure removal from all supported regions and navigation paths.',
    ],
    tweak: 'Why not call updateTag directly in the webhook?',
    answer:
      'In Next.js 16 updateTag is Server-Action-only. A Route Handler uses the documented revalidateTag profile; API context and chosen consistency semantics are both part of the design.',
    doc: 'app/guides/draft-mode',
  },
  {
    slug: 'large-catalog-build',
    title: 'Control build cost for a million-page catalog',
    chapter: 'Platform architecture',
    scale:
      '1,000,000 slugs; 10-minute build budget; origin limited to 100 concurrent reads',
    situation:
      'generateStaticParams enumerates every record and each page performs several serial network calls.',
    requirements: [
      'Bound build time and origin concurrency.',
      'Serve useful cold routes.',
      'Preserve missing/deleted resource semantics.',
    ],
    design:
      'Measure a representative cold/warm build and enumerate only a bounded valuable set when the deployment model supports on-demand generation. Batch or deduplicate shared build reads, keep origins within concurrency budgets and avoid calling a local Route Handler during prerender. Choose route cache lifetimes and invalidation based on content volatility; a static export is a different deployment with no request-time server fallback. Record how unknown slugs, deletions and origin failures behave before promising arbitrary page coverage.',
    failure:
      'A broad rebuild during an origin incident can turn a serving site into a failed deployment. Retain the last verified artifact and separate deploy-time availability from the ongoing stale/fresh serving policy.',
    verification: [
      'Run an origin-counted scale sample and extrapolate with measured bottlenecks.',
      'Request unenumerated and deleted slugs after deployment.',
      'Fail the origin mid-build and test rollback/retained-serving behavior.',
    ],
    tweak: 'Would increasing worker count always help?',
    answer:
      'It may move the bottleneck to memory, the database or remote rate limits. Increase concurrency only against measured capacity and error/latency budgets; cached inputs and smaller graphs can be more effective.',
    doc: 'app/api-reference/functions/generate-static-params',
  },
  {
    slug: 'realtime-dashboard',
    title: 'Combine a server-rendered dashboard with live client updates',
    chapter: 'Domain architecture',
    scale:
      '5,000 connected users; events can be duplicated and delivered out of order',
    situation:
      'A dashboard remounts the full application every few seconds to fetch a new session and replace all data.',
    requirements: [
      'Deliver an authorized initial snapshot.',
      'Reconcile live events without cross-account leakage.',
      'Handle disconnect and catch-up explicitly.',
    ],
    design:
      'Fetch an authorized versioned initial snapshot on the server and hydrate a small client island for live state. Use an authenticated supported real-time service/transport, resource-scoped sequence/version checks and idempotent event application. Keep subscriptions and reconnect timers owned by the active actor/resource, with cleanup on unmount or account switch. On a gap, fetch a bounded reconciliation snapshot instead of assuming every missed event is still available. Avoid presenting serverless request instances as durable socket infrastructure without platform support.',
    failure:
      'A stale connection can deliver events after the user switches tenants. Reject messages by active subscription ownership and server-authorized channel scope; client-side filtering alone cannot secure the upstream stream.',
    verification: [
      'Duplicate/reorder events and introduce sequence gaps.',
      'Disconnect, reconnect and change accounts during catch-up.',
      'Measure visible freshness, subscription cleanup and bounded memory growth.',
    ],
    tweak: 'Should every event call router.refresh?',
    answer:
      'Use it deliberately for server-owned reconciliation rather than as an unbounded per-event rebuild. Coalesce refreshes, preserve client state and measure server load; some events can update an admitted client projection directly.',
    doc: 'app/getting-started/server-and-client-components',
  },
  {
    slug: 'server-action-capacity',
    title: 'Define Server Action ownership and throughput boundaries',
    chapter: 'Domain architecture',
    scale:
      'Human form submissions plus a machine client sending hundreds of operations/second',
    situation:
      'A team exposes internal action identifiers as its long-term external batch API and assumes unconstrained parallel dispatch.',
    requirements: [
      'Keep UI mutations secure and observable.',
      'Provide an intentional external API contract.',
      'Bound concurrency and durable work.',
    ],
    design:
      'Use Server Actions for supported UI mutation flows with input validation, current authorization and serializable state. Expose a separate documented HTTP/job interface for machine clients needing explicit versioning, batching, concurrency and retry semantics. Keep shared business logic behind authorized operations, persist long-running work before acknowledging it, and use transaction/idempotency boundaries appropriate to the resource. Measure actual framework dispatch and platform limits instead of treating an action call as a general unconstrained RPC transport.',
    failure:
      'A client retries after navigation or a dropped response while the mutation committed. Stable operation identity, durable outcome lookup and receiver-side uniqueness prevent duplicate effects; action transport alone does not supply them.',
    verification: [
      'Test forged action inputs and current object permissions.',
      'Load-test the documented batch API and UI actions separately.',
      'Drop responses after commit and verify safe recovery without a second business effect.',
    ],
    tweak: 'Can both adapters share code?',
    answer:
      'Yes, share explicit domain operations and DTOs while preserving each adapter’s authentication, request limits and transport semantics. Do not make the Server Component call its own HTTP adapter merely to reuse logic.',
    doc: 'app/guides/data-security',
  },
  {
    slug: 'search-architecture',
    title: 'Design URL-driven search with safe caching and indexing lag',
    chapter: 'Domain architecture',
    scale:
      '10 million documents; p95 search under 600 ms; index lag up to 30 seconds',
    situation:
      'Each keystroke requests a full server page, mixes tenant results in one cache key and loses filters on navigation.',
    requirements: [
      'Preserve shareable admitted query state.',
      'Bound request/caching cardinality.',
      'Communicate stale index semantics and authorization.',
    ],
    design:
      'Keep draft input separate from committed URL query state, debounce navigation deliberately and preserve unrelated filters. Normalize and bound query length, filters and pagination before server reads. Authorize tenant/resource scope in the search query and result projection; cache only eligible bounded representations with complete keys. Use a dedicated index for search while treating its lag as an explicit product property, and revalidate sensitive object access against the authoritative system before actions.',
    failure:
      'A deleted or newly restricted document may remain in the index. Enforce result visibility at a trusted boundary and define removal/permission propagation bounds, rather than assuming eventual indexing lag is acceptable for private data.',
    verification: [
      'Race old/new queries and confirm late results cannot overwrite the current query.',
      'Warm one tenant’s query then repeat it from another.',
      'Delete or revoke indexed content and measure the visibility boundary.',
    ],
    tweak: 'Would rendering every result as a Client Component improve it?',
    answer:
      'It changes bundle and hydration cost, not search correctness. Use server-owned search data and small client interactions, then measure rendering cost and pagination/virtualization needs independently.',
    doc: 'app/api-reference/functions/use-search-params',
  },
  {
    slug: 'failure-isolation',
    title: 'Partition route failures without hiding data integrity errors',
    chapter: 'Reliability architecture',
    scale:
      'Dashboard with billing, reports and notifications; dependencies have independent SLOs',
    situation:
      'A notification outage turns every account page into a blank loading screen indefinitely.',
    requirements: [
      'Keep essential navigation usable.',
      'Define which partial failures are tolerable.',
      'Preserve error ownership, retry and cancellation.',
    ],
    design:
      'Place Suspense/error boundaries around independently valuable subtrees below shared layouts, and start independent work without a parent waterfall. Give each dependency a bounded deadline and define a visible empty/error/retry state. Keep critical billing authorization and mutation failures distinct from optional notification availability. Preserve the actor/resource context during retry and avoid remounting a whole authenticated shell for background refresh. Correlate failures without exposing sensitive stack details.',
    failure:
      'A fallback can hide an endless request and make a broken page appear merely slow. Track pending age and terminal outcomes, propagate cancellation and alert on sustained failure rather than leaving unbounded spinners.',
    verification: [
      'Fail each dependency independently and in combinations.',
      'Retry after recovery without losing unrelated client state.',
      'Test navigation/account changes while old requests remain in flight.',
    ],
    tweak: 'Should Promise.allSettled replace every error boundary?',
    answer:
      'No. It is a promise-composition tool, not an ownership or UX policy. Decide which partial results are safe and useful, then choose boundaries and response handling that express that decision.',
    doc: 'app/getting-started/error-handling',
  },
  {
    slug: 'frontend-delivery-budget',
    title: 'Reduce JavaScript and prefetch cost without weakening features',
    chapter: 'Platform architecture',
    scale:
      '500 challenge routes; 200 KB compressed initial-route budget; low-end mobile devices',
    situation:
      'The dashboard imports full answers, fixtures, editors and compilers for every challenge into its client bundle.',
    requirements: [
      'Ship summaries for listing/search.',
      'Load only selected challenge details.',
      'Preserve practice, search and account isolation.',
    ],
    design:
      'Keep the full content registry behind server boundaries and pass intentional summary DTOs to client listing controls. Resolve the selected challenge on the server, dynamically load heavy interactive tools when needed, and cache trusted generated runtime assets without rebuilding unchanged inputs. Disable unbounded catalog prefetch where measurements justify it. Separate app build types from unfinished candidate files while retaining full tooling checks. Measure transferred/decoded bytes, interaction latency and cold/warm preparation separately.',
    failure:
      'A summary refactor can accidentally remove search fields, progress IDs or badges. Preserve stable IDs and verify search/readiness parity; keep solutions and fixtures out of listing payloads without dropping user-facing functionality.',
    verification: [
      'Compare route bundles before/after in production.',
      'Verify search, bookmarks, scores and all challenge entry points.',
      'Test cache invalidation for changed inputs and missing generated outputs, and profile low-end CPU hydration.',
    ],
    tweak: 'Can a development timing prove a production performance win?',
    answer:
      'It is useful diagnostic evidence but has different compilation, HMR and transfer characteristics. Report the environment and compare production builds before asserting user-facing production results.',
    doc: 'app/guides/package-bundling',
  },
  {
    slug: 'test-pyramid-versions',
    title: 'Design a versioned Next.js regression and release matrix',
    chapter: 'Platform architecture',
    scale:
      'Supported Next.js 15 maintenance and 16 stable; 100 practice scenarios',
    situation:
      'A unit suite of policy models is labeled proof that every routing, cache and deployment behavior works on both major versions.',
    requirements: [
      'Keep exact policy tests cheap and deterministic.',
      'Verify representative real framework boundaries on both versions.',
      'Record unperformed integration claims honestly.',
    ],
    design:
      'Use unit tests for pure input policies and curriculum integrity, production-server tests for routing/metadata/headers/actions/streaming, and deployment integration for CDN/cache handlers/queues/databases. Pin patched 15 and stable 16 in isolated fixtures, with cache/config assumptions in the test names. Keep cold/warm and direct/soft-navigation cases separate. Validate the simulator’s own browser flows and content exports without claiming those checks execute every infrastructure design. Store source links, version snapshot and known verification limits with the curriculum.',
    failure:
      'An always-green mock can conceal an unsupported API or a server cache leak. Introduce deliberate negative fixtures, assert real HTTP/output evidence and fail unsupported claims rather than manufacturing a passing score for guided work.',
    verification: [
      'Run the supported-version fixtures from clean installs and production builds.',
      'Mutate a policy/reference to prove the intended check fails.',
      'Audit report wording against actual executed checks and retained evidence.',
    ],
    tweak: 'Should latest be an unpinned CI dependency?',
    answer:
      'Use a reviewed pinned release matrix and a separate dependency-update job. Unbounded latest installs can change the baseline silently; record exactly what was tested and refresh the version snapshot deliberately.',
    doc: 'app/guides/testing/playwright',
  },
];
