# Point-In-Time Recovery (PITR) Disaster Recovery Architecture

Collection: sql · ID: `sql-tier4-006` · Mode: **guided**

## Business context

At 14:32:10 UTC, a junior developer running an ad-hoc cleanup script accidentally executed `DELETE FROM repayments;` without a WHERE clause in production. Nightly pg_dump backups were taken at 00:00 UTC (14 hours ago).

## Task

Design a Point-In-Time Recovery (PITR) procedure to restore the database to 14:32:05 UTC (5 seconds prior to the incident), recovering all 14 hours of transactions without data loss. Explain physical base backups (`pg_basebackup`), continuous WAL archiving (`archive_command` / WAL-G), and `recovery_target_time`.

## Follow-up questions

- What is a PostgreSQL "Timeline" (`recovery_target_timeline`), and why does promoting a database create a new timeline ID?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
