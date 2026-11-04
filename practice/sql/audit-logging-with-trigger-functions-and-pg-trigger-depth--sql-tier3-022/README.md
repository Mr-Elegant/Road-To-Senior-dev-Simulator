# Audit Logging with Trigger Functions and pg_trigger_depth

Collection: sql · ID: `sql-tier3-022` · Mode: **guided**

## Business context

For regulatory compliance, an NBFC must maintain an immutable audit trail of every update to interest rates or loan statuses, recording the old values, new values, timestamp, and the database user who executed the change.

## Task

Implement an automated audit trail trigger function in PostgreSQL. Detail the differences between `BEFORE` and `AFTER` triggers, statement-level vs row-level triggers (`FOR EACH ROW`), the role of `OLD` and `NEW` pseudo-records, and how to use `pg_trigger_depth()` to prevent infinite trigger loops.

## Follow-up questions

- What performance overhead do row-level audit triggers introduce on high-throughput batch UPDATE statements, and how can that be mitigated?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
