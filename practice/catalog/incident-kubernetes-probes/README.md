# Restart Cascade: A Database Blip Kills Every Pod

Collection: catalog · ID: `incident-kubernetes-probes` · Mode: **guided**

## Business context

A Kubernetes API deployment uses the same /health endpoint for readiness and liveness. The endpoint queries PostgreSQL. A short database slowdown marks every pod unhealthy and starts synchronized restarts.

## Task

The API fleet restarts repeatedly during a database slowdown, although process health and CPU were normal before the restarts. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Keep application deadlock detection; do not permanently disable all health checks.
- Protect the database from reconnect storms.
- Validate a canary before rolling out the new probe policy.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Should every dependency failure make a pod unready?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
