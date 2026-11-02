# Production Incident: Node.js Container OOMKilled Memory Leak

Collection: catalog · ID: `ops-production-memory-leak-debug` · Mode: **guided**

## Business context

The core API service in the production Kubernetes cluster is crashing every 4 hours with exit code 137 (OOMKilled). Customer checkout requests are intermittently dropped during pod restarts, and P99 latency degrades significantly before each crash.

## Task

Investigate the production incident using the provided Prometheus memory metrics, application logs, and recent commit diffs. Formulate the root-cause hypothesis, identify immediate mitigation, implement a permanent fix, define regression tests, and configure monitoring alerts to prevent future occurrences.

## Candidate tasks

- Step 1: State the root-cause hypothesis supported by specific evidence from logs, metrics, and git diff.
- Step 2: Propose immediate mitigation to stop the crash loop immediately.
- Step 3: Provide permanent code fix (bounded LRU cache or stream buffer with max size and TTL).
- Step 4: Write regression test verifying memory usage does not scale linearly with request count.
- Step 5: Define Prometheus alerting rule (`container_memory_working_set_bytes > 85% for 5m`).

## Constraints

- Immediate mitigation must stabilize production within 10 minutes without data loss.
- Must identify exact memory retention pattern in application code.
- Permanent fix must keep RSS memory flat under 250MB.

## Follow-up questions

- What is the difference between `container_memory_rss` and `container_memory_working_set_bytes` in Kubernetes?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
