# PostgreSQL Extensions: pg_stat_statements and Performance Profiling

Collection: sql · ID: `sql-tier3-023` · Mode: **guided**

## Business context

Your database CPU is pegged at 95%. Hundreds of different query patterns run concurrently from microservices. You need to identify which queries are consuming the most cumulative time and I/O across the entire server.

## Task

Explain how `pg_stat_statements` tracks SQL execution metrics in PostgreSQL. How does it normalize SQL text? Write a query against `pg_stat_statements` to find the top 5 most resource-intensive queries by total execution time, buffer cache miss ratio, and average call latency.

## Follow-up questions

- How does `pg_stat_statements_reset()` interact with production monitoring, and when should it be executed?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
