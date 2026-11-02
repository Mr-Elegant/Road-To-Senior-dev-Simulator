# PostgreSQL Memory Hierarchy: Shared Buffers, OS Page Cache, and Double Buffering

Collection: sql · ID: `sql-tier4-024` · Mode: **guided**

## Business context

A sysadmin allocates 60 GB of a 64 GB RAM server to PostgreSQL `shared_buffers`. Performance immediately degrades by 40%, and disk read latency spikes.

## Task

Explain the relationship between PostgreSQL `shared_buffers` and the Linux OS Kernel Page Cache. What is the "Double Buffering" architecture? Why is setting `shared_buffers` to 25% of RAM (16 GB on 64 GB) recommended, and how does `effective_cache_size` guide the query planner?

## Follow-up questions

- What official PostgreSQL extension allows inspection of the exact contents currently cached inside `shared_buffers` in real-time?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
