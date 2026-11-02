# Evolving production incidents

Open `/incidents` from the navigation or the challenge catalog. Eight new challenges add 24 developments and 72 response choices to the existing library (59 scenarios in total). Existing static incidents remain available through `/library?type=incident`.

| Challenge | Main lesson |
|---|---|
| Connection Storm: Autoscaling Makes Checkout Worse | Fleet-wide pool budgets, retry amplification and payment reconciliation |
| Cache Stampede: The Five-Minute Expiry Cliff | Origin admission, cross-pod refresh leases and safe freshness boundaries |
| Migration Lock: A Small DDL Change Stops Orders | Lock queues, cancellation, expand-contract and bounded backfill |
| Regional Failover: The Replica Is Ninety Seconds Behind | Writer fencing, measured RPO, WAL recovery and divergence reconciliation |
| Payment Timeout: Did the Customer Already Pay? | Ambiguous outcomes, durable idempotency and webhook reconciliation |
| Consumer Backlog: One Poison Event Blocks Fulfillment | Schema compatibility, durable quarantine, offsets and side-effect deduplication |
| Restart Cascade: A Database Blip Kills Every Pod | Separate startup/liveness/readiness and prevent reconnect amplification |
| Tenant Isolation: A CDN Serves Another Customer’s Invoice | Cache authorization boundaries, global containment and exposure investigation |

The incident clock starts paused. Developments arrive at 00:00, 02:00 and 05:00, with a final deadline at 08:00. Start/Pause uses visible-tab time; Advance moves directly to the next event and expires any unanswered current decision. Every choice needs a rationale and is recorded once. A future development changes its briefing according to the previous outcome. Logs, metrics, severity and customer impact reflect selected actions; future/unchosen observations are never added to the visible stream.

The decision benchmark assigns 2 points to an effective action, 1 to a partial response, and 0 to a harmful action or missed deadline, normalized across all three developments. It is separate from the existing written self-assessment score. Reference solutions include the assumptions, alternatives and operational trade-offs behind the recommended responses.

Drafts (run, decision rationale and six report fields) are stored only on the current device, under `fullstack_incident_draft_v1:<scenarioId>` with the existing `:user:<accountId>` suffix for signed-in users. Refresh restores a validated draft paused. Recorded attempts sync through the existing progress API: `interviewAnswers` stores the `incident.summary`, `incident.development-*` journal and `incident.evidence`; existing columns retain the written diagnosis, mitigation, fix, testing and monitoring. No schema migration or new dependency is introduced.

## Objective and scope

Extend the incident workspace with deterministic, browser-only simulations. Add eight original incidents spanning database capacity, payment reconciliation, Kafka processing, cache stampedes, migration locks, regional recovery, Kubernetes health checks, and tenant isolation. Existing static incidents and saved attempts stay compatible.

## Behavior and acceptance criteria

- Each new incident has three scheduled developments and three plausible actions per development. Choosing an action changes observed metrics, customer impact, severity, and the next development's briefing. There is no random or live infrastructure dependency.
- A simulation starts paused. Users can run/pause simulated time or advance to the next development. An unanswered development expires at the next deadline and records the consequences of inaction. Actions cannot be edited or applied twice.
- Future telemetry and decision explanations stay hidden until their development or deliberate reference-solution reveal. A completed exercise presents a separate, deterministic decision benchmark; the existing self-assessed rubric remains clearly separate.
- Capture a rationale for each action. Save the decision transcript and supporting evidence with the existing attempt record, using the existing question/answer JSON field. No database migration is required.
- Save an in-progress browser draft under the existing account-scoping convention; restore paused after refresh. Reset clears this draft. Invalid/stale drafts are discarded through replay validation.
- Each authored solution explains diagnosis with evidence, containment, permanent correction, verification gates, regression tests, rollback constraints, communications, acceptable alternatives, common mistakes, and stage-by-stage decisions. Link official technical references. These are reference responses for stated assumptions, not guarantees for real outages.
- Make new incidents discoverable from the library with an evolving badge and a direct incident entry point. Preserve existing coding, interview, SQL and static incident behavior.
- Verify engine boundaries, timeouts, branching, restoration and content completeness with Vitest. Verify choice consequences, refresh, reset, reference reveal, mobile reachability and persisted submission with Playwright.

## Structure and implementation order

1. `src/types/incident.ts`, `src/lib/incidents/engine.ts`: pure state transitions and telemetry derivation, with failing tests first.
2. `src/data/incidents/`: authored scenarios and shared presentation scaffolding, registered in `src/data/index.ts`.
3. `src/components/workspace/`: incident control room, draft persistence and debrief; reuse existing telemetry and response form.
4. Existing challenge page: state ownership, reset, attempt transcript, solution integration. Library: discovery links and badges.
5. Browser regression tests, production build and documentation updates.

## Commands and verification

```sh
npm test
npm run typecheck
npm run lint
node scripts/auth-check.mjs build
node scripts/auth-check.mjs serve
```

Against the verification server in a second terminal (PowerShell):

```powershell
$env:PLAYWRIGHT_BASE_URL='http://localhost:3100'
$env:PLAYWRIGHT_EXTERNAL_SERVER='1'
node node_modules/@playwright/test/cli.js test --workers=1
```

## Conventions and boundaries

Use explicit TypeScript interfaces and pure transitions returning fresh state, for example `advanceIncident(definition, state, seconds)`. Use existing Tailwind colors, native buttons/labels, and readable status announcements. Keep simulation state independent of free-text self-assessment.

Always validate restored browser data, bound rationale input, retain account scoping, and test backward compatibility. Schema changes, new services, external execution and new dependencies are outside this implementation. Never execute operational commands, contact incident customers, alter environment secrets, or reset existing progress.

## Verification results (2 November 2026)

- All 121 unit tests passed across 13 suites. The 17 new tests cover simulation transitions, clock boundaries, missed deadlines, invalid/reordered draft restoration, telemetry visibility/timestamps, eight complete authored playbooks and progress-schema compatibility.
- The final Next.js 16.4.3 Turbopack production build, TypeScript checks and standalone ESLint passed.
- All 23 Playwright tests passed against the production build, including five new incident journeys. They verify harmful-action consequences and subsequent briefings, locked decisions, deadlines, refresh, reset, native solution-dialog focus/Escape, browser clock progression, saved written evidence and journal, account/anonymous draft isolation, all eight launch routes and the original static incident workspace. Existing authentication, SQL engines, Monaco execution, interviews and loan-dashboard regression tests also passed.
- The five new journeys also passed against the existing development server. A separate attempted dev server detected the already-running workspace instance and exited; the existing server was left running.
- Screenshots and DOM checks verified responsive behavior at 320, 390, 768, 1024 and 1440 pixels. The new workspace uses natural page scrolling on smaller screens and a split workspace on larger screens. The existing missing favicon 404 remains unrelated to this feature.
- Configured server secrets were absent from the 42 scanned production client JavaScript files. Environment files, package/lock files, Prisma schema and migrations have no feature diff. Legacy `default-user` count remains 1 with 0 legacy attempts, and disposable test-account count is 0 after cleanup.

The simulations are deterministic teaching exercises; operational actions are never executed against real infrastructure. Live Gemini service behavior is outside this feature's verification.
