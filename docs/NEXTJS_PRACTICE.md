# Next.js 15–16 engineering practice

The dedicated `/nextjs` track adds 110 original challenges: 20 executable policy models, 70 framework code reviews, and 20 architecture challenges. They span beginner, intermediate, senior, and staff/architect work. Existing Next.js scenarios remain available alongside this curriculum.

Version snapshot: **4 November 2026**. Official documentation and the npm `next` dist-tags identify **16.4.5** as latest stable and **15.5.29** as the current 15.x backport. The simulator remains on **16.4.3**. Canary releases are excluded. A version label is a teaching scope, not a promise that every 15.x patch has identical types or security behavior; use patched releases and version-matched declarations.

## Execution boundaries

- **Policy coding:** `solution(input)` runs against exact input/output cases in the existing isolated browser Worker and local practice CLI. It models application decisions; it does not execute React Server Components or prove Next.js cache behavior.
- **Framework review:** inspect the defective file, write actionable review comments, and compare with corrected code, version notes and acceptance checks. Actual routing, headers, streaming and caching must be verified in a real Next.js project using `next build` and `next start`. The browser does not pretend to execute a Next.js server.
- **Architecture:** use the existing design canvas, contracts, schema, capacity and failure analysis fields. Reference decisions include consistency boundaries, rollout and measurable verification. Scores are rubric-based self-assessment.

Every exercise has progressive hints, a reference, pitfalls, official sources, and an interview variation with an answer. Framework references are focused review files; imported application services describe integration boundaries rather than shipping a database or third-party service.

## Learning progression

1. App Router conventions, layouts, boundaries, navigation, async request APIs, metadata and static assets.
2. Server data, caching, mutations, routing composition, forms and React 19 interactions.
3. Security, cache invalidation, migrations, testing, performance, runtime and production operations.
4. Multi-tenancy, distributed caches, commerce, observability, deployment and architectural trade-offs.

The hub filters by chapter, level, execution mode and version scope. Catalog scenarios use stable `next-lab-*` IDs so bookmarks and attempts remain independent of older exercises.

## Local IDE

Run `npm run practice:generate`, then `npm run practice:list -- next-lab`. All 110 exercises appear under `practice/catalog/next-lab-*`. Existing solutions and notes are preserved. Coding models run with `npm run practice:test -- catalog/<id>`; reviews and designs require manual evidence against their acceptance checks. Review files and corrected files are exported separately; do not import intentionally broken practice files into the simulator.

## Version rules emphasized

- Request APIs and route props are asynchronous in 15; temporary synchronous compatibility is removed in 16.
- Next.js 15 changes the default caching of fetch and GET handlers. Route output, request memoization, the Data Cache and client Router Cache are different layers.
- Cache Components is explicitly enabled in the 16-specific exercises. It is not assumed to be enabled in every Next.js 16 app.
- Next.js 16 renames Middleware to Proxy. Proxy is not a replacement for authorization in a data-access layer, Route Handler or Server Action.
- In 16, `revalidateTag(tag, 'max')` supports stale-while-revalidate; `updateTag` is for immediate read-your-own-writes inside Server Actions. Exact historical patch signatures must be checked before migration.

Sources: [Next.js 15 upgrade](https://nextjs.org/docs/app/guides/upgrading/version-15), [Next.js 16 upgrade](https://nextjs.org/docs/app/guides/upgrading/version-16), [caching](https://nextjs.org/docs/app/getting-started/caching), [support policy](https://nextjs.org/support-policy).

## Opt-in real-version verification

The small framework matrix is isolated from app dependencies and does not alter the simulator’s version:

```sh
npm run nextjs:prepare-versions
npm install --prefix .playwright-mcp/nextjs-versions/15 --ignore-scripts --no-audit --no-fund --package-lock=true
npm install --prefix .playwright-mcp/nextjs-versions/16 --ignore-scripts --no-audit --no-fund --package-lock=true
npm run nextjs:verify-versions
```

It builds and runs Next.js 15.5.29 and 16.4.5 sequentially on ports 3205/3206, checks representative async params/searchParams/cookies, missing-resource boundaries, metadata, request-specific GET responses, soft navigation and Middleware/Proxy headers. The 16 fixture also enables Cache Components, cacheLife and partial prefetching. This matrix verifies those framework boundaries; it does not execute all 70 code reviews or prove the 20 architecture designs against deployed infrastructure. Fixtures, installs, logs and results remain under ignored `.playwright-mcp/`.

The 15 fixture skips integrated lint to avoid inheriting the parent simulator?s Next.js 16 ESLint configuration; its real TypeScript/build checks stay enabled. Run the simulator?s explicit `npm run lint` separately. Fixture tracing is bounded to its directory and automatic lockfile repair is disabled only in the fixture process. `--major=15` or `--major=16` selects one fixture; `--serve-built` rechecks existing compiled output without rebuilding it.


`--serve-built` is a diagnostic mode: it checks available compiled output and does not certify that a complete production build succeeded.

## Verification recorded for this addition

- App production build, TypeScript checks and ESLint passed. The simulator remains on Next.js 16.4.3.
- 25 curriculum/unit checks passed, including syntax checks of all 70 corrected review references. Syntax checks do not prove framework behavior.
- All 89 policy cases passed through the terminal reference runner. Browser checks covered the policy runner, submission guard, framework review and architecture workspaces.
- Hub search, filters, navigation and layouts at 320, 375, 768, 1440 and 1920 pixels passed. The focused hub check was rerun after correcting an ambiguous search expectation. Six session/account regression checks also passed.
- Six local workspace checks passed. The export contains 696 exercises; 1,024 existing candidate files were preserved during generation.
- The isolated Next.js 16.4.5 fixture completed its production build and seven grouped runtime checks.
- The isolated Next.js 15.5.29 fixture compiled, typechecked and prerendered, but final build tracing exceeded the 420-second limit on this machine. Six grouped runtime checks passed using that compiled output. A complete Next.js 15 production build is therefore not certified.
