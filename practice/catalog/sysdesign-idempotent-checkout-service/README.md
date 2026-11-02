# High-Volume Idempotent Checkout & Order Processing System

Collection: catalog · ID: `sysdesign-idempotent-checkout-service` · Mode: **guided**

## Business context

A global e-commerce marketplace handles $100M/month in Gross Merchandise Value. During flash promotions, simultaneous checkouts cause race conditions in inventory reservation, duplicate credit card charges when users refresh payment screens, and inconsistent order states when payment gateways disconnect.

## Task

Design a resilient checkout and payment orchestration platform. Ensure absolute idempotency across client retries, two-phase distributed inventory reservation, payment gateway integration with webhooks and reconciliation jobs, and eventual consistency using the Outbox Pattern.

## Candidate tasks

- Design the State Machine transitions and database schema for Orders, Payments, and Inventory Holds.
- Explain the Transactional Outbox Pattern to guarantee orders and message queue events commit atomically.
- Design the Idempotency Layer using Redis distributed locks and unique database constraints.
- Explain the Reconciliation Cron Job to detect abandoned/in-flight payment discrepancies with Stripe.

## Constraints

- Zero double-charges under any network failure or user retry.
- Zero overselling of limited inventory items.
- Sustain 2,500 checkouts/second at peak with P99 latency < 1.5 seconds.

## Follow-up questions

- What is the Dual-Write problem in distributed systems and how does the Outbox Pattern solve it?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
