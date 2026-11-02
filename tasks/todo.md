# Implementation checklist

Each numbered task depends on the existing scenario contract and registration. Implement sequentially; mark complete only after focused verification.

- [x] 1. Inventory reservations (`commerce-reservations`)
  - Accept: prevent overselling; retry without reserving twice; reject changed payloads; release once; reject invalid quantities.
  - Files: commerce content, scenario registration, business challenge tests.
  - Verify: focused Vitest tests exercise all authored cases and fail the broken starter.
- [x] 2. Payment reconciliation (`commerce-payments`)
  - Accept: deduplicate event and payment identity; verify order, amount, currency; preserve paid orders on later failure.
  - Files: commerce content, business challenge tests.
  - Verify: focused behavioral tests including distinct event IDs for one payment.
- [x] 3. Tenant authorization (`saas-authorization`)
  - Accept: deny cross-tenant records, untrusted tenant selection, inactive memberships, unknown actions, and unauthorized roles.
  - Files: SaaS content, scenario registration, business challenge tests.
  - Verify: focused tests exercise allow and deny branches.
- [x] 4. Subscription entitlements (`saas-entitlements`)
  - Accept: deterministic time; reject stale internal snapshots; tenant ownership; explicit allowed statuses; expiry boundaries.
  - Files: SaaS content, business challenge tests.
  - Verify: focused tests for replay, ordering, cancellation-at-period-end, and expiry.
- [x] 5. Catalog import recovery (`commerce-imports`)
  - Accept: row-level idempotency, reject changed replays, tenant-scoped SKUs, validation, partial success.
  - Files: commerce content, business challenge tests.
  - Verify: focused retry and cross-tenant fixtures.
- [x] 6. Audit records (`saas-audit`)
  - Accept: allowlist auditable fields; exclude secrets; record true changes; enforce trusted tenant and actor context.
  - Files: SaaS content, business challenge tests.
  - Verify: focused redaction, no-op, and tenant mismatch fixtures.
- [x] 7. Final integration checkpoint
  - Accept: catalog discovery, editor run, solution reveal, and existing app checks succeed; README reflects new count.
  - Files: browser regression, README, this checklist.
  - Verify: all unit tests, typecheck, lint, production build, focused browser journey.

## Completion evidence

Verified locally on 2 November 2026:

- 65 registered scenarios, including all six new business challenges.
- All 53 new reference cases pass strict JSON comparisons with deeply frozen inputs; each starter has a reproducible failure.
- All 53 reference cases also pass through the existing practice evaluator and real Chromium workspace.
- `npm test`: 198 tests passed across 16 suites.
- `npm run typecheck`: passed, including the new browser tests.
- `npm run lint`: passed.
- `node scripts/auth-check.mjs build`: Turbopack production build passed.
- Full Chromium regression: 30 tests passed against that production build, including the two new journeys.
- Catalog search, all six starter/reference runs, and solution dialogs verified without page errors in the new execution journey.

Implementation remains local for review; no deployment or live provider configuration was performed.
