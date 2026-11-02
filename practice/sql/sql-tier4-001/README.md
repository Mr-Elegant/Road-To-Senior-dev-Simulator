# Production Incident: Multi-Transaction Deadlock Graph & Lock Queue Analysis

Collection: sql · ID: `sql-tier4-001` · Mode: **guided**

## Business context

During Black Friday peak traffic, 40 API pods fail with HTTP 500 errors. Database CPU hits 100%, and application logs show repeating `ERROR: 40P01: deadlock detected`. The PostgreSQL log displays a complex lock cycle between three concurrent transactions.

## Task

Analyze the PostgreSQL deadlock detection mechanism (`deadlock_timeout`). Given the telemetry and log snippet below, trace the cycle in the lock graph. Explain why deadlocks occur even when individual queries are fast, and detail architectural strategies to eliminate deadlocks permanently.

## Follow-up questions

- Why does reducing `deadlock_timeout` from 1s to 50ms in a high-concurrency database often hurt performance rather than helping?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
