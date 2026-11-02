# E-commerce and SaaS challenge expansion

## Objective and scope

Add six hands-on senior engineering challenges to the existing simulator. The user selected simulator content rather than a separate commerce application. Each challenge uses the current `solution(input)` JavaScript editor, test runner, hints, reference solution, rubric, and account progress.

The examples model business decisions with deterministic fixtures. Passing them does not prove database concurrency, cryptographic verification, provider integration, or production isolation. Solutions must explain those deployment boundaries explicitly.

## Capability map and build order

| ID | Challenge | Depends on |
| --- | --- | --- |
| commerce-reservations | Inventory reservations, retries, release | Existing scenario contract |
| commerce-payments | Duplicate payment notifications and business identity | Existing scenario contract |
| saas-authorization | Tenant-scoped access and role checks | Existing scenario contract |
| saas-entitlements | Subscription snapshots and entitlement expiry | Existing scenario contract |
| commerce-imports | Resumable, tenant-scoped catalog imports | Existing scenario contract |
| saas-audit | Safe audit records and secret redaction | Existing scenario contract |

Implement in that order, verifying each increment before expanding. These are independent content modules sharing the existing execution interface, not new runtime services.

## Architecture decisions

- Keep existing technical topics; use searchable `E-commerce` and `SaaS` titles/subtopics.
- Add content modules under `src/data/scenarios/`, register through `src/data/index.ts`, and avoid new dependencies, schema migrations, or credentials.
- Use JSON fixtures with independently specified expected outputs, including negative and replay cases. Starters must genuinely fail; all authored references must pass strict comparisons.
- Keep production guidance in reference explanations and follow-ups. Never present an in-memory reducer as a replacement for transactions, database authorization, or webhook signature checks.
- Unit verification may execute only repository-authored snippets in a bounded Node VM. Candidate submissions keep using the existing browser execution path; this change does not strengthen its isolation guarantees.

## Verification checkpoints

For each content increment: focused Vitest behavioral tests plus catalog validation. At the final checkpoint: all unit tests, TypeScript, ESLint, production build, and browser verification of catalog discovery, opening a challenge, failed starter, passing reference, and solution display.

Commands: `npm test`, `npm run typecheck`, `npm run lint`, `node scripts/auth-check.mjs build`. Browser tests use the repository's Playwright configuration and existing authentication fixtures.

## Boundaries

Always keep existing scenarios and progress IDs stable; write reproducible fixtures and explain business invariants. Never read or publish environment secret values, replace the existing app, or connect to live payment services. Database changes, provider integration, and a separate standalone app are outside this content expansion.

## Sources

- [PostgreSQL row locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Stripe webhook delivery, duplication, and ordering](https://docs.stripe.com/webhooks)
- [OWASP tenant isolation](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)

Detailed acceptance criteria and completion evidence live in [todo.md](todo.md).
