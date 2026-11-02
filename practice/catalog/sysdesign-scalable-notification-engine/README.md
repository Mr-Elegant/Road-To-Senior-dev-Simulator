# Global Multi-Channel Notification Platform (50M Events/Day)

Collection: catalog · ID: `sysdesign-scalable-notification-engine` · Mode: **guided**

## Business context

A global social and banking super-app needs to send 50,000,000 notifications per day across Email (SendGrid), Mobile Push (APNs / FCM), SMS (Twilio), and In-App WebSockets. Users currently complain about duplicate notifications, critical fraud alerts being delayed behind promotional marketing blasts, and lack of quiet-hour preferences.

## Task

Design an end-to-end multi-channel notification engine that handles high-throughput ingestion, enforces user notification preferences and quiet hours, deduplicates rapid events, prioritizes critical transactional alerts over marketing campaigns, and handles downstream provider rate limits and failures.

## Candidate tasks

- Architect the system components: API Gateway, Ingestion Service, Message Broker (Kafka / RabbitMQ), Notification Worker Pools, Cache/State Store (Redis), Database (Postgres / DynamoDB).
- Define the API contract: `POST /v1/notifications/send` with payload schema.
- Explain the Priority Queue design: why separate queues (High / Normal / Low) are needed instead of a single FIFO queue.
- Detail the Deduplication strategy: using Redis key with TTL `dedup:{userId}:{hash(template,params)}`.
- Address failure recovery, dead-letter queues (DLQ), and retry exponential backoff.

## Constraints

- Throughput: 50M notifications/day (~600 sustained QPS, 5,000 peak QPS).
- P99 Latency: < 2 seconds for High-Priority transactional alerts (OTP, fraud, payments).
- At-least-once delivery with deduplication window (e.g. 15 minutes for repeated identical events).
- Channel rate limiting per user (e.g. max 3 promotional notifications/day).

## Follow-up questions

- How do you handle APNs (Apple Push Notification) invalid device token errors in production?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
