# The Transactional Outbox Pattern in Relational Databases

Collection: sql · ID: `sql-t2-14` · Mode: **guided**

## Business context

An order checkout service must save an order in PostgreSQL and publish an event to Apache Kafka. If Kafka is temporarily down, the database write succeeds but the message is lost.

## Task

What is the Dual-Write Problem? How does the Transactional Outbox Pattern use relational database ACID transactions to guarantee reliable event delivery?

## Follow-up questions

- What is the trade-off of polling the outbox table vs using PostgreSQL logical decoding (Debezium)?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
