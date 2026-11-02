# Distributed Cron & Delayed Job Scheduler (At-Least-Once Delivery)

Collection: catalog · ID: `sysdesign-distributed-job-scheduler` · Mode: **guided**

## Business context

A subscription and billing platform executes millions of scheduled tasks: daily recurring billing crons, delayed subscription trial expiry emails (execute 14 days after signup), and abandoned cart nudges (execute in 2 hours). The current single-server cron daemon is a single point of failure and misses jobs during restarts.

## Task

Design a horizontally scalable, fault-tolerant distributed cron and delayed task scheduling service. The system must guarantee at-least-once task execution, support dynamic schedules (run at exact timestamp T), scale worker nodes horizontally, support graceful retries with dead-letter queues, and prevent duplicate concurrent task execution.

## Candidate tasks

- Design the architecture: Scheduler Fleet, Time-Wheel / Redis Sorted Set / DynamoDB Time-Partitioned Storage, Dispatch Queue (SQS / Kafka / RabbitMQ), Worker Fleet.
- Explain how Redis Sorted Set (`ZADD scheduled_time taskId`, `ZRANGEBYSCORE 0 now`) or Hashed Time-Wheels dispatch due tasks.
- Explain how distributed locking or partitioned ranges prevent multiple scheduler nodes from dispatching the same due task.
- Detail the worker execution lease and heartbeating mechanism.

## Constraints

- Scale: 10,000,000 scheduled tasks stored, 10,000 tasks dispatched per second.
- Precision: Jobs must trigger within +/- 1 second of their scheduled target timestamp.
- High Availability: Zero dropped jobs if any scheduler node crashes.

## Follow-up questions

- What is a Hashed Timing Wheel and why is it more CPU-efficient than polling a sorted list for timers?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
