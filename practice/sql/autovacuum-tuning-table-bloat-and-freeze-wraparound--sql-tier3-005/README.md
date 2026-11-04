# Autovacuum Tuning, Table Bloat, and Freeze Wraparound

Collection: sql · ID: `sql-tier3-005` · Mode: **guided**

## Business context

A production PostgreSQL database with high write volume triggers a critical monitoring alert: `database age is 1,850,000,000 transactions; danger of shutdown in 150 million transactions`. Autovacuum appears unable to keep up.

## Task

Explain the PostgreSQL Transaction ID (XID) wraparound hazard and the purpose of `VACUUM FREEZE`. What causes autovacuum worker starvation, and how do you tune autovacuum cost limits, scale factors, and workers to prevent database emergency shutdown?

## Follow-up questions

- Why does a long-running transaction or an abandoned replication slot prevent VACUUM from cleaning dead rows, even if autovacuum runs constantly?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
