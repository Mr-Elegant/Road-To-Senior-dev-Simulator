# Next.js 16 and Turbopack migration

The application was upgraded from Next.js 15.5.28 to pinned Next.js 16.4.3 on 2 November 2026. React/React DOM remain at the existing 19.3.1 version; Prisma, Better Auth, question banks, database schema and environment files were not upgraded or migrated as part of this change.

## Staged verification

1. Upgraded only Next.js and its required transitive packages while retaining Webpack. All 100 existing unit tests, type checking and lint passed. The first build reused mixed old output and failed in the Webpack runtime; moving generated `.next` output aside and rebuilding cleanly resolved it without application changes.
2. The first cold signup request exposed a request-stream cloning issue. The auth route now validates/reads the bounded body once and creates a fresh Request for Better Auth, preserving Origin/cookies/signal while removing the stale Content-Length. Bodyless logout/revocation requests remain supported. Two regression tests cover this transport boundary. After the fix, the complete 18-test browser suite passed on a freshly started Next.js 16 Webpack server.
3. Enabled Turbopack and added only the compatibility aliases demonstrated necessary by its build errors. Production compilation, type checking and prerendering passed. The complete 18-test browser suite also passed against the Turbopack production server.

## Compatibility changes

- `next` is pinned to `16.4.3`; `eslint-config-next` was already on 16.4.3. Node.js 20.9+ is required by Next.js. The test environment uses Node 22.12.0, which satisfies Next.js, but an existing ESLint transitive package warns that it needs Node 20.19+, 22.13+ or 24+. Use a supported LTS satisfying that range for fresh setups.
- `npm run dev` and `npm run build` use Turbopack by default. Next.js 16 no longer runs ESLint as part of the build, so continue running `npm run lint` separately.
- The prior Webpack exclusions for `react-native`, `react-native-fs`, and `react-native-fetch-blob` now have equivalent Turbopack aliases to `src/lib/compat/emptyOptionalModule.ts`. AlaSQL's Node/SSR export statically references these optional native adapters, including Flow syntax that is not valid in the web bundle. The web application never executes those native integrations. No new Node built-in stubs were added: server filesystem/crypto access remains intact, and PGlite's existing browser package mappings handle its browser environment.
- Next.js made the required TypeScript `jsx: react-jsx` change and added `.next/dev/types/**/*.ts`. Existing async params/searchParams/headers code was already compatible.
- `scripts/auth-check.mjs` accepts an optional bundler flag and supports `dev` plus an `AUTH_CHECK_PORT` override. The helper's generated secret remains ephemeral and test-only.
- Next.js 16 automatically generated an `AGENTS.md` pointer to its installed, version-matched documentation when the development server detected the agent. The standard generated block is retained.

## Commands and recovery

```sh
npm ci
npm run db:generate
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Configure a persistent `BETTER_AUTH_SECRET`, the application origin in `BETTER_AUTH_URL`, and the existing `DATABASE_URL` as described in the authentication guide. The test helper can supply an ephemeral secret for verification without changing `.env.local`:

```sh
node scripts/auth-check.mjs build
node scripts/auth-check.mjs serve
```

If a deployment-specific Turbopack issue appears, use the verified Webpack configuration without changing application code:

```sh
npm run dev:webpack
npm run build:webpack
npm start
```

Stop the relevant server before rebuilding its production output. After changing major Next.js versions or bundlers, move the generated `.next` directory aside before a clean rebuild if mixed-artifact errors appear. No database reset or schema rollback is needed. The pre-upgrade source checkpoint is commit `e6901389346903e1882c213533d49dad1b791a27`; the initial mixed generated output was preserved in ignored `.playwright-mcp/next-before-next16/` for diagnosis.

## Checks

- 104 unit tests passed across 11 suites, including authentication transport and Turbopack configuration boundaries.
- All 18 browser/integration tests passed on Next.js 16 with Webpack, then on the Turbopack production build. Added tests edit real Monaco models, execute a PostgreSQL-specific JSONB query in PGlite WASM, run an AlaSQL query, and execute JavaScript through the browser practice runner. Existing tests exercise authentication, expiry/revocation, authorization, CSRF, local-progress import and the existing dashboard/library/interview/loan flows.
- The same 18 tests passed against `next dev` with `PLAYWRIGHT_DEV_SERVER=1`. This explicit profile allows 90 seconds per test and 15 seconds per assertion for on-demand compilation, versus the unchanged production limits of 30/5 seconds. An initial dev run under production timing limits timed out while loading routes/workspaces; it did not reveal an API or rendering exception. Test cleanup now resolves disposable IDs from the exact generated test emails, so failures before session capture also clean up correctly.
- Fast Refresh was verified in an isolated browser: changing the login heading and restoring it updated the UI twice, preserved the entered test email, and kept the same `performance.timeOrigin` (no full-page reload). The temporary source edit was reverted exactly; `AuthForm.tsx` has no migration diff.
- Type checking, standalone ESLint and the Turbopack production build passed. The build helper used an ephemeral test secret; production deployments need their own persistent secret.
- `npm audit --omit=dev` reports **0 vulnerabilities** after the upgrade (the previous Next.js/transitive PostCSS production findings are removed). The full audit still reports 23 existing development/tooling findings: 17 moderate, 4 high, and 2 critical. No forced audit remediation was applied.

Live Gemini responses remain mocked in the browser journey; this upgrade does not claim to verify the external Gemini service. No changes were made to SQL evaluator semantics or the question banks.

The development browser console had the existing missing `/favicon.ico` 404; no application runtime exception was reported by the browser smoke tests. This unrelated asset issue was not changed.

Official references: [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [Turbopack configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack), and the version-matched guides in `node_modules/next/dist/docs/`.
