# Checkpoint Tuning & WAL Generation Spikes: Eliminating I/O Spikes

Collection: sql · ID: `sql-tier4-005` · Mode: **guided**

## Business context

Every 5 minutes, database write latency spikes from 1.5ms to 850ms for 30 seconds. System telemetry shows 100% disk write bandwidth saturation coinciding with PostgreSQL log messages: `LOG: checkpoints are occurring too frequently (30 seconds apart)` and `checkpoint starting: time`.

## Task

Explain the PostgreSQL Checkpoint mechanism. What triggers a checkpoint (`checkpoint_timeout` vs `max_wal_size`)? How does checkpoint spreading (`checkpoint_completion_target`) smooth out disk I/O, and what are full-page writes (`full_page_writes`) after a checkpoint?

## Follow-up questions

- What is the trade-off of increasing `checkpoint_timeout` to 30 minutes and `max_wal_size` to 64GB?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
