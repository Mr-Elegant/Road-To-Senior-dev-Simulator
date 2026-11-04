# High-Throughput TimescaleDB / Hypertable Architecture vs Native Partitioning

Collection: sql · ID: `sql-tier4-015` · Mode: **guided**

## Business context

Your analytics ingestion pipeline processes 250,000 metrics per second into PostgreSQL. Native declarative partitioning by day creates 365 tables per year, but query planning overhead degrades, and compression is non-existent. The team evaluates TimescaleDB hypertables.

## Task

Compare PostgreSQL native declarative partitioning with TimescaleDB hypertables for high-throughput time-series data. Evaluate automatic chunk creation, native columnar compression (hybrid row/column storage), continuous aggregates, and data retention policies.

## Follow-up questions

- Can compressed TimescaleDB chunks be updated or deleted using standard SQL `UPDATE` / `DELETE` statements?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
