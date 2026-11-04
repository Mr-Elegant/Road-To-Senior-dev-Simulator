# Materialized Views with REFRESH CONCURRENTLY

Collection: sql · ID: `sql-tier3-014` · Mode: **guided**

## Business context

An executive analytics dashboard aggregates customer lifetime spend and average order values across 10 million orders. The query takes 14 seconds. Running a normal `REFRESH MATERIALIZED VIEW` locks out all dashboard reads for 45 seconds.

## Task

Explain how `MATERIALIZED VIEW` works in PostgreSQL. What is the difference between standard `REFRESH` and `REFRESH MATERIALIZED VIEW CONCURRENTLY`? What prerequisite must be met to allow concurrent refresh, and what are the performance trade-offs?

## Follow-up questions

- Can a materialized view with `REFRESH MATERIALIZED VIEW CONCURRENTLY` be updated incrementally (only calculating rows changed since last refresh)?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
