# High-Performance Unlogged Tables vs Temp Tables for Ephemeral Staging

Collection: sql · ID: `sql-tier4-019` · Mode: **guided**

## Business context

A nightly ETL pipeline loads 20 million raw records from S3, parses and transforms them, and aggregates summary statistics. Using standard tables takes 25 minutes due to massive WAL disk I/O. Using `CREATE TEMP TABLE` causes connection bloat.

## Task

Compare PostgreSQL `UNLOGGED` tables with Temporary tables (`TEMP TABLE`) and Standard logged tables. How do unlogged tables bypass the Write-Ahead Log (WAL)? What happens to unlogged tables during a server crash or on a streaming read-replica?

## Follow-up questions

- Can an UNLOGGED table be altered to a regular logged table once the bulk load finishes, and what lock does that require?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
