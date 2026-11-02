# E-commerce: Reconcile Duplicate Payment Notifications

Collection: catalog · ID: `commerce-payment-reconciliation` · Mode: **javascript**

## Business context

A retailer dispatches an order twice after two different notification IDs describe the same successful payment. A delayed failure then changes a paid order back to failed.

## Task

Implement solution({ orders, events }) returning { orders, outcomes }. Orders have unique id, total in integer minor units, currency, and status pending/failed/paid. Each normalized event has id, paymentId, orderId, amount, currency, type succeeded/failed, and verified. The fixture starts with no processed notifications or payment ledger. Process events in order. verified represents a trusted adapter decision, not a cryptographic check performed by this function. Do not mutate input orders.

## Candidate tasks

- Fix event deduplication, payment identity, order validation, and paid-state monotonicity.
- Describe durable atomic processing, signature verification, and handling a real second payment.

## Constraints

- In order: reject verified !== true as unverified; unknown types as ignored; missing orders, mismatched amount/currency, or a nonpositive/non-safe-integer amount as mismatch. Rejected events are not recorded.
- For valid events, previously seen event IDs return duplicate. For a succeeded event: a paymentId already applied to the same order returns duplicate, one applied to a different order returns conflict, and a new payment for an already paid order returns review without recording it. Otherwise mark paid, record payment identity, and return paid.
- A failed event returns ignored if the order is already paid; otherwise mark failed and return failed. Remember valid event IDs except review/conflict. IDs are nonempty strings; event ID payloads are immutable in this normalized fixture.

## Follow-up questions

- What if the worker crashes after requesting shipment but before recording success?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/commerce-payment-reconciliation
npm run practice:watch -- catalog/commerce-payment-reconciliation
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
