# Migration Lock: A Small DDL Change Stops Orders

Collection: catalog · ID: `incident-migration-lock` · Mode: **guided**

## Business context

An orders table has 80 million rows. A deployment runs ALTER TABLE while a reporting transaction holds an older snapshot and a conflicting table lock. New order traffic begins queuing behind the waiting DDL.

## Task

Order creation p99 reaches 30 seconds immediately after a schema migration starts; database CPU remains low. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Preserve committed orders and capture blocking evidence before intervention.
- Do not kill all sessions or rewrite the large table during peak traffic.
- Application rollback must remain compatible with the expanded schema.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Why can a waiting ALTER TABLE cause impact before it acquires its lock?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
