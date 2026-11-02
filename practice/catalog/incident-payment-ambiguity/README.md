# Payment Timeout: Did the Customer Already Pay?

Collection: catalog · ID: `incident-payment-ambiguity` · Mode: **guided**

## Business context

A payment provider accepts a capture but the response times out at the gateway. The checkout service retries with a new idempotency key, and delayed webhooks arrive after customers have retried checkout.

## Task

Customers report two card debits for one order while checkout displays "payment failed". Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- A network timeout is not proof that a payment failed.
- Do not blindly refund or repeat all captures.
- Retain provider operation IDs and an audit trail for reconciliation.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Does provider idempotency guarantee exactly-once business processing forever?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
