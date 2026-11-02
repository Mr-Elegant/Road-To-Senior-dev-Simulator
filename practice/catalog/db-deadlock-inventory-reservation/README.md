# Flash Sale Cart Reservation PostgreSQL Transaction Deadlock

Collection: catalog · ID: `db-deadlock-inventory-reservation` · Mode: **guided**

## Business context

During a flash sale, shoppers simultaneously checkout carts containing multiple shared items (e.g. Shoes + Socks). Under peak concurrency, PostgreSQL logs show surging `ERROR: deadlock detected (SQLSTATE 40P01)`, causing 15% of checkout transactions to fail and abort.

## Task

When two concurrent checkout transactions attempt to lock the same inventory rows in different orders (Transaction A locks Product #101 then Product #205; Transaction B locks Product #205 then Product #101), neither transaction can proceed, causing a cyclical deadlock. Refactor the reservation logic to guarantee deterministic lock ordering.

## Candidate tasks

- Analyze PostgreSQL deadlock error logs and explain the Coffman conditions required for deadlocks.
- Enforce deterministic lock acquisition ordering by sorting item IDs before executing `SELECT ... FOR UPDATE`.
- Discuss alternative lock acquisition methods like `SELECT ... FOR UPDATE NOWAIT` or `SKIP LOCKED`.

## Constraints

- Must eliminate deadlocks completely.
- Must maintain strict inventory consistency (no overselling beyond available stock).
- Use deterministic sorting by Primary Key before locking (`SELECT ... FOR UPDATE`).

## Follow-up questions

- What is the purpose of `SELECT ... FOR UPDATE SKIP LOCKED` and where is it used?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
