# Regional Failover: The Replica Is Ninety Seconds Behind

Collection: catalog · ID: `incident-regional-failover` · Mode: **guided**

## Business context

A regional failure isolates the primary order database. The standby is asynchronous and 90 seconds behind. The business recovery-point objective is 30 seconds, and the old primary may still be accepting writes from internal workers.

## Task

Public order writes fail in region A; the region B standby is reachable but has not replayed the latest acknowledged orders. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Prevent two writable primaries.
- Do not promise zero data loss with asynchronous replication.
- Escalate any recovery-point breach and preserve reconciliation evidence.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Does synchronous replication remove the need for fencing?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
