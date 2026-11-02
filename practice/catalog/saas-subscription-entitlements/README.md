# SaaS: Repair Subscription Access After Delayed Updates

Collection: catalog · ID: `saas-subscription-entitlements` · Mode: **javascript**

## Business context

A reporting SaaS restores export access from an old billing update after a cancellation. A separate expiry bug lets trial accounts keep exporting indefinitely.

## Task

Implement solution({ state, snapshots, now }) returning { state, canExport, outcomes }. state is the current valid subscription { tenantId, version, status, plan, periodEnd, cancelAtPeriodEnd }. Each snapshot has the same fields. version is a positive integer assigned by our serialized internal reconciler, NOT a Stripe event timestamp or provider version. now and periodEnd use integer epoch seconds. Process snapshots in order, then compute export access from the final state.

## Candidate tasks

- Implement ordered snapshot reconciliation and the explicit entitlement policy.
- Explain how reconciliation obtains fresh authoritative provider state without inventing ordering guarantees.

## Constraints

- Check tenant first: a different tenant returns mismatch. Invalid fields return invalid: version positive safe integer, periodEnd nonnegative safe integer, cancelAtPeriodEnd boolean, plan starter/pro, status active/trialing/past_due/canceled/unpaid/incomplete. Then version <= current version returns stale; otherwise replace state and return applied.
- Export requires plan pro, status active or trialing, and now < periodEnd. An active subscription with cancelAtPeriodEnd true retains access until periodEnd. No grace period is configured. Do not mutate inputs; current state and now are valid.

## Follow-up questions

- Why is an internal revision not enough if provider fetches race?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/saas-subscription-entitlements
npm run practice:watch -- catalog/saas-subscription-entitlements
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
