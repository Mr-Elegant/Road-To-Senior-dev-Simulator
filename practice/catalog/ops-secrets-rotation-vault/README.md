# Zero-Downtime Database Secret Rotation with HashiCorp Vault

Collection: catalog · ID: `ops-secrets-rotation-vault` · Mode: **guided**

## Business context

SOC 2 compliance mandates that production PostgreSQL database passwords must rotate automatically every 30 days. Currently, when passwords are changed, all running application pods fail database health checks and crash, requiring a coordinated maintenance window.

## Task

Architect a zero-downtime database credential rotation pipeline using HashiCorp Vault Dynamic Database Secrets. Explain how Vault generates short-lived, unique user credentials per pod/service with dual-user rotation (User A and User B alternating), so that existing database connections remain active while new connections authenticate with rotated credentials.

## Candidate tasks

- Explain the dual-user rotation pattern: alternating active database roles without terminating in-flight queries.
- Implement lease renewal ticker before TTL expires.
- Gracefully drain and migrate connection pool when new credentials are issued.

## Constraints

- Zero connection drops during credential rotation.
- No hardcoded static database passwords in Kubernetes secrets or env vars.
- Vault leases must automatically revoke credentials when TTL expires.

## Follow-up questions

- How does the "Two-User Rotation" pattern work in AWS Secrets Manager?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
