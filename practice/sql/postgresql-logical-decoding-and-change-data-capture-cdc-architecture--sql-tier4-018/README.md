# PostgreSQL Logical Decoding and Change Data Capture (CDC) Architecture

Collection: sql · ID: `sql-tier4-018` · Mode: **guided**

## Business context

Your architecture team must stream all real-time changes from `orders`, `payments`, and `customers` to Elasticsearch and Apache Kafka with sub-second latency. A developer proposes using polling queries (`WHERE updated_at > last_poll`).

## Task

Critique the polling query anti-pattern for Change Data Capture (CDC). Detail how PostgreSQL Logical Decoding works using Write-Ahead Logs, logical replication slots, and `pgoutput` / Debezium. Explain `REPLICA IDENTITY` (DEFAULT vs FULL) and how hard DELETE events are captured.

## Follow-up questions

- What disaster occurs if the downstream Debezium connector disconnects for 48 hours while the logical replication slot remains active?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
