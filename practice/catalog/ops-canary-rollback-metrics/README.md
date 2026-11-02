# Canary Deployment 5xx Spike & Automated Rollback Analysis

Collection: catalog · ID: `ops-canary-rollback-metrics` · Mode: **guided**

## Business context

A continuous deployment pipeline promotes a new version of the GraphQL Gateway to a 10% canary weight in production. Within 3 minutes of traffic shift, alerts trigger indicating that checkout mutations are failing.

## Task

Analyze canary metrics (P95 latency, 5xx error rate, GraphQL mutation errors). Determine whether the error budget has been breached, make the automated rollback decision, and formulate the post-rollback triage workflow to pinpoint the failing mutation.

## Candidate tasks

- Define automated canary analysis thresholds (error rate, latency degradation, error budget burn rate).
- Implement `evaluateCanaryHealth` decision engine.
- Explain how service meshes (e.g. Istio, Argo Rollouts, AWS App Mesh) adjust traffic weights from 10% to 0%.

## Constraints

- Rollback decision must be made within 60 seconds of error budget violation.
- Canary traffic must immediately be routed back to baseline (stable) pods.
- Do not disrupt active user sessions on the stable baseline.

## Follow-up questions

- What is Multi-Window Multi-Burn-Rate alerting in Google SRE Site Reliability Engineering?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
