# Connection Storm: Autoscaling Makes Checkout Worse

Collection: catalog · ID: `incident-db-connection-storm` · Mode: **guided**

## Business context

A retail checkout API scales from 8 to 40 pods during a flash sale. PostgreSQL has 400 connection slots, 40 of which are reserved for administration and other services. Each new pod opens a 30-connection pool.

## Task

Checkout p99 is 18 seconds; active client connections hit 400 and 35% of checkout requests fail. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Keep database access available to on-call operators.
- Do not increase max_connections or restart PostgreSQL during the sale.
- Payments must retain their idempotency keys across retries.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Why can CPU stay moderate during a severe database outage?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
