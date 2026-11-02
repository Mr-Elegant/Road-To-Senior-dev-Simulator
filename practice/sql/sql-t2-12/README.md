# UUIDv4 vs. BIGINT / ULID for Primary Keys

Collection: sql · ID: `sql-t2-12` · Mode: **guided**

## Business context

A microservices application generates customer IDs on the client side before writing to PostgreSQL, but database writes slow down significantly after reaching 50 million rows.

## Task

Why does random UUIDv4 cause severe B-Tree index fragmentation and write degradation at scale? How do sequential identifiers (BIGINT, UUIDv7, ULID) solve this?

## Follow-up questions

- What is the risk of using auto-incrementing BIGINT identifiers in public-facing web URLs?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
