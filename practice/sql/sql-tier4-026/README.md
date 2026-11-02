# Production Incident: Replica WAL Replay Lag Induced by Long Standby Queries

Collection: sql · ID: `sql-tier4-026` · Mode: **guided**

## Business context

A data science team connects to the production read-replica and runs a heavy analytics query that scans historical data for 45 minutes. Minutes later, the replica lag increases by 35 GB, and other operational read queries on the replica return stale data.

## Task

Explain how queries on a physical streaming read-replica can pause WAL replay. Analyze the interaction between `hot_standby_feedback`, `max_standby_streaming_delay`, and `max_standby_archive_delay`. How do you protect replicas from analytical query disruption?

## Follow-up questions

- What query can an SRE run on the replica to check how much time is remaining before a conflicting statement is terminated by `max_standby_streaming_delay`?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
