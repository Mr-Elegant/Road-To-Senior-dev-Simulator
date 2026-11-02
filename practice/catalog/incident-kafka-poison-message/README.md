# Consumer Backlog: One Poison Event Blocks Fulfillment

Collection: catalog · ID: `incident-kafka-poison-message` · Mode: **guided**

## Business context

Fulfillment consumes six Kafka partitions. A new producer emits schema v3 while one consumer still expects v2. Partition 2 repeatedly fails on offset 8841, delaying every later order on that partition.

## Task

The oldest unfulfilled order is 24 minutes old; adding consumer replicas does not move partition 2. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Preserve an auditable disposition for every order event.
- Do not reset offsets to latest or silently discard failed records.
- Kafka offsets and external fulfillment side effects need separate integrity controls.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- When is sending a failed record to a dead-letter queue insufficient?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
