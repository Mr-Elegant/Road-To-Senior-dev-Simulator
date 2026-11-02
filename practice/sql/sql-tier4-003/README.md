# Production Incident: Replication Lag Spike & Disk Exhaustion on Primary

Collection: sql · ID: `sql-tier4-003` · Mode: **guided**

## Business context

At 02:00 AM, the primary database disk usage surges from 40% to 98% in two hours. Monitoring shows physical streaming replication lag to the read-replica increased from 0 bytes to 250 GB. The team suspects an unconsumed replication slot or long-running replica query.

## Task

Investigate the root cause of WAL retention accumulation on PostgreSQL primaries. Analyze how physical replication slots (`pg_replication_slots`), `wal_keep_size`, and long-running queries on standby (`hot_standby_feedback`) cause disk exhaustion on the primary. Provide immediate mitigation and permanent architectural safeguards.

## Follow-up questions

- What is a "recovery conflict" on a read replica, and how does `max_standby_streaming_delay` handle it?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
