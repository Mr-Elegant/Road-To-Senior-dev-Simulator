# Cache Stampede: The Five-Minute Expiry Cliff

Collection: catalog · ID: `incident-cache-stampede` · Mode: **guided**

## Business context

A product API serves 12000 requests per second. A deployment populated every popular Redis key with the same five-minute TTL. PostgreSQL can sustain only 800 uncached reads per second.

## Task

Cache hit rate falls from 98% to 4% in one second; product requests time out across all regions. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Do not serve stale prices or inventory as authoritative checkout values.
- Redis is shared with sessions; avoid destructive global operations.
- Protect the database before repopulating the cache.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Why is single-flight inside one API process insufficient?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
