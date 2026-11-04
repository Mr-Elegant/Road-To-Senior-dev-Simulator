# PostgreSQL Disaster Post-Mortem: Dropped Table Recovery Without Backup Restore

Collection: sql · ID: `sql-tier4-030` · Mode: **guided**

## Business context

At 15:00 UTC, an engineer intending to drop a staging table accidentally executes `DROP TABLE payments;` on the production database. The database is 4 Terabytes. Restoring from yesterday's full backup would take 8 hours and lose 15 hours of business transactions.

## Task

Architect an emergency disaster recovery plan to recover the dropped `payments` table with zero lost data and minimum downtime. Detail Point-In-Time Recovery (PITR) to a temporary clone instance, `pg_dump` extraction of the single table, and selective re-import into production.

## Follow-up questions

- What transaction ID recovery setting can be used instead of `recovery_target_time` if you know the exact XID of the `DROP TABLE` command from the PostgreSQL log?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
