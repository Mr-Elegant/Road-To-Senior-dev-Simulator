# PostgreSQL LISTEN and NOTIFY: Pub/Sub Architecture and Queue Hazards

Collection: sql · ID: `sql-tier3-013` · Mode: **guided**

## Business context

An engineering team implements an event-driven microservice using PostgreSQL `LISTEN` and `NOTIFY` triggers on the `orders` table to notify a webhook service. During Black Friday, the database logs warnings about the notification queue filling up.

## Task

Explain how `LISTEN` and `NOTIFY` work internally in PostgreSQL. Where is the notification queue stored, what are the payload size limitations, and what occurs when the queue overflows? When should you use LISTEN/NOTIFY vs an external message broker like Kafka or RabbitMQ?

## Follow-up questions

- How can an application combine PostgreSQL tables with LISTEN/NOTIFY to achieve durable, at-least-once message processing without losing notifications?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
