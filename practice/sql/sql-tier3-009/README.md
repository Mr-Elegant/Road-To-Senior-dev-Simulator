# Advisory Locks: Application-Level Distributed Locking in Postgres

Collection: sql · ID: `sql-tier3-009` · Mode: **guided**

## Business context

Your microservices backend must execute a monthly interest accrual batch job. Three container instances run concurrently. If two containers run the job simultaneously for the same loan portfolio, interest is doubled.

## Task

Compare PostgreSQL Advisory Locks with row-level locks (`SELECT FOR UPDATE`). Explain the differences between session-level and transaction-level advisory locks (`pg_advisory_lock` vs `pg_advisory_xact_lock`), and between blocking and non-blocking variants (`pg_try_advisory_lock`).

## Follow-up questions

- What disaster occurs if an application uses session-level `pg_advisory_lock()` through PgBouncer configured in `pool_mode = transaction`?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
