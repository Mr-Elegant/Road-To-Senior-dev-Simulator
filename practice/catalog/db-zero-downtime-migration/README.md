# 50M-Row User Schema Column Rename Zero-Downtime Migration

Collection: catalog · ID: `db-zero-downtime-migration` · Mode: **guided**

## Business context

A social and commerce platform has 50,000,000 records in the `users` table. The engineering team needs to rename and split `full_name` into `first_name` and `last_name`. Running `ALTER TABLE users ADD COLUMN first_name ...; UPDATE users SET ...` in a single migration script locks the table exclusively for 25 minutes, taking the entire platform offline.

## Task

Design a multi-phase, zero-downtime database migration strategy (Expand and Contract / Parallel Run pattern). Describe the schema changes, dual-writing application layer, backfill script with throttling, and final deprecation cleanup without locking production tables.

## Candidate tasks

- Map out the 5 phases of the Expand and Contract (Parallel Run) migration pattern.
- Show how to add nullable columns without rewriting the table or acquiring heavy AccessExclusiveLocks.
- Design a background backfill script that batches updates in chunks of 1,000 with sleep intervals.
- Explain when to drop the old column and remove dual-writing code.

## Constraints

- Zero downtime (zero table locks exceeding 100ms).
- Both old and new application versions must function concurrently during deployment.
- Backfill must not starve database replication lag or max out IOPS.

## Follow-up questions

- Why should you always create indexes using `CREATE INDEX CONCURRENTLY` in PostgreSQL production?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
