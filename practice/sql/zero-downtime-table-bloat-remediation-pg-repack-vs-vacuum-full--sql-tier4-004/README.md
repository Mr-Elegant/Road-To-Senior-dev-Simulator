# Zero-Downtime Table Bloat Remediation: pg_repack vs VACUUM FULL

Collection: sql · ID: `sql-tier4-004` · Mode: **guided**

## Business context

Due to a buggy batch job that updated 5 million rows 20 times in a loop, the `inventory` table ballooned from 4 GB to 85 GB. Queries doing sequential scans are now 20x slower. Running `VACUUM FULL inventory;` is rejected by leadership because it requires an ACCESS EXCLUSIVE lock for 3 hours.

## Task

Explain why standard `VACUUM` cannot return space to the OS. Compare `VACUUM FULL` with `pg_repack`. Detail step-by-step how `pg_repack` rebuilds the table and all indexes online without holding exclusive locks, and explain its log-replay catch-up phase.

## Follow-up questions

- What disk space requirement must the database server satisfy before running `pg_repack` or `VACUUM FULL` on an 85GB table?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
