# Authentication and progress ownership

The existing Next.js 15 / Prisma 6 application uses Better Auth 1.7.15 for email/password authentication. The package declares compatibility with Next.js 15, React 19, and Prisma 6. Credentials, session cookies, validation, CSRF checks, and rate limiting are handled by the library. The application adds bounded request bodies, signup confirmation validation, protected page checks, and account ownership at each private API.

## Configuration

Set these server-only values in `.env.local` (use your existing database connection):

```dotenv
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
BETTER_AUTH_SECRET="replace-with-at-least-32-cryptographically-random-characters"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate a secret with a cryptographic password generator; use a stable, unique value on every instance of one deployment. In production, `BETTER_AUTH_URL` must be the public HTTPS origin. Do not prefix any of these values with `NEXT_PUBLIC_`. Gemini variables are unchanged. Changing the signing secret invalidates existing session cookies unless a planned Better Auth secret rotation is used.

`.npmrc` disables dependency lifecycle scripts and selects legacy peer resolution because Better Auth advertises optional adapters for frameworks whose Vite peer versions conflict with this project's Vitest 2. The Next.js/React/Prisma versions used here satisfy Better Auth's own peer ranges. After `npm ci`, run `npm run db:generate` explicitly. Do not enable all dependency scripts just to generate Prisma Client.

## Sessions and passwords

- Better Auth stores salted scrypt password hashes in `Account.password`; plaintext passwords are never stored or logged.
- The session identifier is signed and sent through an HttpOnly, SameSite=Lax, path=/ cookie. Production cookies use Secure and the `__Secure-` prefix.
- Sessions live in PostgreSQL, expire after seven days, and refresh after one day of activity. Cookie session caching is disabled so revocation and expiry are checked against the database.
- Logout deletes the active server session and clears its cookie. Account offers “Sign out other devices.” Authentication values are never written to localStorage.
- Email login failures use the same error for unknown users and incorrect passwords. Signup validates name, email, password length (12–128), and confirmation; the database enforces uniqueness.
- Authentication throttles use the database RateLimit table: 5 email login requests/minute and 3 signup requests/minute per resolved client IP/path. AI operations have an additional 20-request/minute account quota.

The deployment proxy must overwrite `x-real-ip` and prevent direct access to the origin so clients cannot spoof this header. If the platform uses a different trusted header, configure `advanced.ipAddress.ipAddressHeaders` in `src/lib/auth.ts` for that platform. Without a resolved IP, Better Auth conservatively shares a per-path bucket. The library's database rate-limit adapter does not promise perfectly atomic increments across simultaneous replicas; use an atomic shared limiter before the app for high-volume hostile traffic.

## Public and protected routes

Public: `/`, `/library`, `/challenge/[id]`, `/practice`, `/sql`, `/interview`, `/progress`, `/login`, `/signup`. Practice and progress here can be anonymous and device-local. The interview page displays a sign-in action when selecting the AI workspace without a session. Anonymous SQL and beginner evaluations use the existing offline rubrics.

Server-protected pages: `/account`, `/settings`, `/challenges/loan-management`. Their page components validate the session and redirect to `/login?next=...`. Redirect targets are restricted to safe local paths.

Server-protected APIs: all `/api/progress/**`, `/api/applications/**`, `/api/dashboard/stats`, POST `/api/ai-interview`, and `/api/sql/evaluate`. The AI health/config GET remains public and contains no credentials or user data. Each API authenticates independently of its UI. User IDs in client bodies or query parameters cannot select another user's account; progress requests that supply them are rejected. Status counts are scoped to the authenticated account.

Private writes require JSON and an Origin matching `BETTER_AUTH_URL`. Better Auth additionally applies its built-in CSRF/origin protections to authentication routes. API responses have no-store headers. Gemini receives only the current request's bounded interview context, never queried cross-account history. Loan records are synthetic practice data: each account gets its own in-memory simulation (one-hour idle expiry, bounded process cache). These simulations reset on restart and are not durable underwriting records.

## Schema and safe migration

Existing User, ScenarioAttempt, Bookmark, and UserNote records and relationships remain intact. User gains emailVerified/image; Session, Account, Verification, and RateLimit are added. ScenarioAttempt gains reviewComments and clientAttemptId, with a unique `(userId, clientAttemptId)` key. A database-generated attempt ID prevents an imported client ID from colliding with another account's primary key.

Migrations:

1. `20261101000000_existing_schema` captures the pre-authentication schema.
2. `20261101010000_authentication` adds authentication tables/columns/indexes and contains no DROP/TRUNCATE/DELETE.

For a new empty database: `npm run db:migrate` then `npm run db:generate`.

For an existing database without migration history: first back up and verify it matches the baseline; then mark **only** `20261101000000_existing_schema` as applied using `node scripts/prisma-auth.mjs migrate resolve --applied 20261101000000_existing_schema`, and run `npm run db:migrate`. Never resolve the authentication migration without applying it. Never use migrate reset. The wrapper loads the same `.env.local` precedence as Next.js. The connected development database was inspected, baselined, and migrated during implementation; Prisma reported no schema drift afterward.

Rollback: prefer rolling back application deployment while leaving the additive schema in place. Do not drop credential/session tables to roll back code. A destructive down migration is deliberately not supplied because it would remove registered users' authentication data.

The old shared default-user remains preserved but is never automatically assigned to a new account. Its ownership cannot be established from the legacy schema. Any manual reassignment must be reviewed separately.

## Anonymous history and import

Original anonymous keys remain unchanged:

- `fullstack_interview_lab_progress_v1`
- `fullstack_interview_lab_tier1_v1`
- `fullstack_interview_lab_sql_v1`
- `fullstack_ai_interview_session_v1`

Account caches append `:user:<authenticated-id>` to each key. Authentication initialization selects the cache before workspace components mount. A full page navigation on login/logout clears in-memory UI state. No account data is copied into anonymous keys.

Login does not upload anonymous data. The user explicitly chooses **Account → Import anonymous progress**. Server-side validation caps payloads at 2 MB, bounds strings/arrays/numeric scores and validates timestamps and allowed fields. The merge runs in a transaction with a per-user row lock:

- Attempts are append-only and deduplicated by client ID within that account; existing server records win on a collision.
- Bookmarks/completed-question IDs are unioned.
- Existing server notes win because old anonymous notes have no reliable modification time.
- Tier-1 and SQL histories are merged by attempt ID, scores/counts are recomputed, and the latest activity date is retained.
- Repeating the request cannot duplicate attempts, and the original anonymous keys are never deleted.

Signed-in practice writes use the same authenticated APIs. Device updates remain immediate; background writes are queued, and a visible message reports sync failures. Settings offers a repeatable account merge after an offline period. Cloud-to-device reads merge into the account cache rather than replacing unsynced history. There is no durable background retry queue or cross-device conflict resolution for intentional bookmark removals; server history is authoritative when reloading, and an explicit additive import may restore a previously removed bookmark.

AI conversations remain device-local until archived as a normal attempt. System-design canvas geometry is still only in the active UI unless included in the existing submitted notes format. No email delivery, password-recovery flow, verification flow, OAuth or MFA was added; email ownership is not verified. These are outside the requested signup/login/logout scope.

## Verification commands

```powershell
npm run db:generate
npm run typecheck
npm run lint
npm test
npm run build
node scripts/prisma-auth.mjs migrate status
node scripts/prisma-auth.mjs migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --exit-code
```

`scripts/auth-check.mjs build` can validate a build with an ephemeral test secret if no persistent secret is configured; `scripts/auth-check.mjs serve` starts that build on port 3100 with a separate ephemeral secret. This helper is strictly for testing, not deployment. Browser tests run with `PLAYWRIGHT_BASE_URL=http://localhost:3100`, `PLAYWRIGHT_EXTERNAL_SERVER=1`, and `AUTH_EXPECT_SECURE=true`. They create isolated temporary accounts and delete only those accounts afterward, leaving existing application users/data untouched. Authentication traces are disabled to avoid storing test credentials/cookies in trace archives.

Official references: [Next.js authorization](https://nextjs.org/docs/app/guides/authentication), [Better Auth Next.js](https://better-auth.com/docs/integrations/next), [Prisma adapter](https://better-auth.com/docs/adapters/prisma), [sessions](https://better-auth.com/docs/concepts/session-management), [passwords and CSRF](https://better-auth.com/docs/reference/security), [rate limits](https://better-auth.com/docs/concepts/rate-limit).

## Changed-file map

New authentication files:

```text
src/lib/auth.ts
src/lib/auth-client.ts
src/lib/auth/server.ts
src/lib/auth/validation.ts
src/lib/auth/request.ts
src/lib/auth/aiQuota.ts
src/app/api/auth/[...all]/route.ts
src/app/login/page.tsx
src/app/signup/page.tsx
src/app/account/page.tsx
src/components/auth/AuthForm.tsx
src/components/auth/AuthBoundary.tsx
src/components/auth/AccountMenu.tsx
src/components/auth/AccountControls.tsx
```

Persistence and integration:

```text
src/lib/persistence/progressMerge.ts                  (new validated merge rules)
src/lib/persistence/progressServer.ts                 (new ownership/transaction handler)
src/lib/persistence/localStorageAdapter.ts
src/lib/persistence/prismaAdapter.ts
src/lib/persistence/aiSessionStorage.ts
src/lib/prisma.ts
src/app/api/progress/route.ts
src/app/api/progress/{attempt,bookmark,notes,import,reset,status,tier1,sql}/route.ts
src/app/api/applications/route.ts
src/app/api/applications/[id]/route.ts
src/app/api/applications/[id]/status/route.ts
src/app/api/dashboard/stats/route.ts
src/app/api/ai-interview/route.ts
src/app/api/sql/evaluate/route.ts
src/data/mockLoans.ts
src/app/layout.tsx
src/components/layout/Navbar.tsx
src/app/settings/page.tsx
src/components/auth/SettingsWorkspace.tsx             (existing settings UI moved here)
src/app/challenges/loan-management/page.tsx
src/components/loan/LoanDashboardPage.tsx              (existing loan page moved here)
src/components/interview/AiInterviewerWorkspace.tsx
src/components/sql/{SqlPracticeView,SqlIncidentView,SqlMockInterviewView}.tsx
src/lib/evaluation/sqlClientEvaluation.ts             (new anonymous rubric dispatch)
src/lib/evaluation/tier1Evaluator.ts
```

Schema, tooling, tests and documentation:

```text
prisma/schema.prisma
prisma/migrations/20261101000000_existing_schema/migration.sql
prisma/migrations/20261101010000_authentication/migration.sql
prisma/migrations/migration_lock.toml
scripts/prisma-auth.mjs
scripts/inspect-auth-db.mjs
scripts/auth-check.mjs
tests/unit/auth.test.ts
tests/unit/aiInterview.test.ts
tests/e2e/auth.spec.ts
tests/e2e/support/account.ts
tests/e2e/interviewLab.spec.ts
playwright.config.ts
next.config.mjs
package.json
package-lock.json
.npmrc
.env.example
README.md
docs/AUTHENTICATION.md
```

The existing SQL execution/evaluation engines, PGlite internals, question banks and reference content were not changed.

## Verification recorded on 2 November 2026

- TypeScript type checking and `npm run lint`: passed.
- Vitest: 100 tests passed across 9 suites.
- Playwright Chromium: all 15 tests in the complete suite passed, followed by the newly added Tier-1/SQL cloud-persistence test passing separately (16 browser/integration tests total).
- The browser tests cover signup, duplicate signup, input validation, login, generic credential errors, logout, protected pages/APIs, invalid/expired sessions, CSRF, throttling, account isolation, device-session revocation, anonymous progress preservation, idempotent import and existing application journeys. Tier-1/SQL writes and independent reset behavior were verified against the connected database.
- Production build: passed using the test helper's ephemeral secret. Normal deployment still requires a persistent `BETTER_AUTH_SECRET`.
- Prisma schema validation/migration status: passed; both migrations recorded, no drift detected.
- Client JavaScript scan: 71 files checked; no configured secret value found.
- Login layouts were inspected in light/dark themes and signup at 320 px; overflow checks also passed at 768, 1024, 1440, 1536, 1800 and 1920 px.
- Legacy database user/attempt counts stayed at 1/0. Disposable test accounts were removed; existing records were preserved.
- The existing AI browser journey uses mocked Gemini responses. No claim is made that a live external Gemini call was verified.

The native npm audit still reports repository dependency advisories, including moderate Next.js and high transitive PostCSS findings in production dependencies, plus Prisma/toolchain/Vite/Vitest findings in development dependencies (including critical development-tool advisories). Authentication's new Better Auth/Zod packages were not listed as vulnerable in this audit. Dependency remediation is separate from this authentication change; no forced upgrades were applied. The build also retains the pre-existing Next.js warning that its ESLint plugin was not detected, despite the standalone lint command passing. Node emits an existing punycode deprecation warning during production startup.
