# GIN vs GiST vs BRIN Indexes: Architecture and Selection

Collection: sql · ID: `sql-tier3-003` · Mode: **guided**

## Business context

Your SaaS platform logs 50 million telemetry rows per day into `events` (timestamp, user_id, event_name, metadata JSONB). B-Tree indexes on `(timestamp, metadata)` are ballooning past 120GB and destroying write throughput.

## Task

Compare GIN, GiST, and BRIN index architectures in PostgreSQL. For each index type, identify its internal structure, ideal query patterns, write overhead, and storage characteristics. Which index should you apply to `metadata JSONB` and which to `created_at` in this 50M rows/day table?

## Follow-up questions

- What is the practical difference between `jsonb_ops` and `jsonb_path_ops` when creating a GIN index on a JSONB column?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
