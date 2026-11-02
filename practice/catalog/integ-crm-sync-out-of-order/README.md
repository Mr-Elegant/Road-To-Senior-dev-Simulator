# Bi-Directional CRM Sync Out-of-Order Customer Data Rollback

Collection: catalog · ID: `integ-crm-sync-out-of-order` · Mode: **guided**

## Business context

An enterprise SaaS platform syncs customer data bi-directionally with HubSpot and Salesforce. Sales reps noticed that customer email addresses and subscription tiers were mysteriously reverting to old values.

## Task

Because webhooks travel over asynchronous public internet networks, network delays can cause Event #2 (User upgraded to Enterprise at 10:05) to arrive BEFORE Event #1 (User updated profile email at 10:01). The sync handler blind-updates the database whenever an event arrives, causing the older Event #1 to overwrite newer data from Event #2. Implement monotonic versioning or Lamport timestamps to reject out-of-order writes.

## Candidate tasks

- Explain why network delivery order cannot be assumed in distributed webhooks.
- Implement conditional SQL updates: `UPDATE customers SET ... WHERE id = $1 AND updated_at < $2`.
- Explain how Distributed Tracing and event versioning prevent split-brain updates.

## Constraints

- Must guarantee stale older events can never overwrite newer state.
- Must handle events arriving out-of-order or duplicate deliveries.
- Update database only if `event.version > record.version` or `event.timestamp > record.updated_at`.

## Follow-up questions

- Why can Kafka guarantee event ordering within a partition, but not across multiple partitions?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
