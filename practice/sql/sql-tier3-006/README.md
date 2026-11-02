# Declarative Partitioning: Range, List, and Hash Strategies

Collection: sql · ID: `sql-tier3-006` · Mode: **guided**

## Business context

The `events` table in SaaS analytics has reached 800 million rows (1.2 TB). Queries filtering by `created_at` are slow, and monthly data archiving requires deleting 70 million rows, which causes massive table bloat and lock contention.

## Task

Design a declarative table partitioning architecture for the `events` table by month using PostgreSQL 13+ declarative range partitioning. Explain partition pruning (run-time vs compile-time), local vs global index constraints, and how dropping a partition provides instant zero-bloat data retention.

## Follow-up questions

- When would you choose Hash Partitioning over Range Partitioning, and what are its trade-offs?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
