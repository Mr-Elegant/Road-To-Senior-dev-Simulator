# Advisory Locks for Distributed Idempotency and Rate Limiting

Collection: sql · ID: `sql-tier3-030` · Mode: **guided**

## Business context

An e-commerce API allows customers to redeem a single-use coupon code. High-concurrency automated scripts send 20 requests within 50 milliseconds using the same coupon code. Multiple requests succeed simultaneously before the `used` flag can be checked and written.

## Task

Design a concurrency-safe single-use coupon redemption mechanism using PostgreSQL advisory locks. Contrast using `pg_advisory_xact_lock(hashtext(coupon_code))` against `SELECT ... FOR UPDATE`, explaining deadlocks, memory consumption, and transaction isolation interactions.

## Follow-up questions

- What is a potential hash collision hazard when using `hashtext(string)` with 32-bit advisory locks, and how do you resolve it?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
