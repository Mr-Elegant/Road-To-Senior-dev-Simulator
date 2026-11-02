# Enterprise Labs implementation

## Agreed scope

Add an Enterprise Labs navigation entry, a project hub at `/enterprise-labs`, and three overview pages. Loan Operations exposes the existing authenticated dashboard and eight bug exercises. Commerce Operations and Multi-Tenant SaaS group the six existing coding challenges. Keep existing challenge URLs and attempt IDs unchanged.

## Acceptance criteria

- [x] Hub offers three project cards with business context, capabilities, skills, exercise count, and Open Lab links.
- [x] Each project has an overview, learning sequence, and links to working exercises. Loan Operations also links to the dashboard.
- [x] Progress derives from existing account-scoped attempts. Loan scores use the existing full-suite validation; catalog scores follow existing rubric semantics. Repeated attempts count once using the best score.
- [x] Enterprise Labs is reachable on desktop, compressed desktop, and mobile navigation. The existing loan dashboard URL remains available.
- [x] Unknown project IDs show the application's not-found page.
- [x] New pages work in dark/light mode and at 320px, 768px, 1024px, and 1440px without horizontal overflow.

## Implementation order

1. Add typed project registry and progress computation with behavioral tests.
2. Build hub and overview pages using the existing design system.
3. Connect navigation and verify keyboard navigation, links, progress, and responsive layouts in Chromium.
4. Run unit tests, TypeScript, ESLint, production build, and browser regression; document usage and results.

No new dependencies, schema, credentials, execution engines, or scoring systems are needed. Future projects are added through the registry when usable; do not publish empty project cards. Project-specific progress is a view of existing history, not another persisted store.

## Verification — 2 November 2026

- 203 unit tests passed across 17 suites, including five project registry/progress tests.
- All four new Chromium journeys passed against the production build: project navigation and launches, shared rubric progress, loan full-suite progress with account isolation, and responsive/themed layouts.
- Existing browser journeys verified: 33 of 34 total journeys passed in the final full run; the remaining existing loan cloud-sync check passed in a focused rerun after waiting for each server save acknowledgment. Application code did not change between those runs.
- TypeScript, ESLint, Turbopack production build, and Git whitespace checks passed.
- Desktop hub, mobile hub, and project overview screenshots inspected under `.playwright-mcp/enterprise-*.png` (ignored verification artifacts).
- All 36 local links checked in the README, project guide, and this plan resolve.

Two test-fixture issues surfaced in the expanded suite and were corrected: disposable accounts now use separate test client subnets for all browser requests, avoiding shared auth throttling; the eight-exercise loan journey waits for each asynchronous save's server acknowledgment. Production authentication and rate limits were unchanged.
