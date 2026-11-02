# Production Incident: Cloud Provider IAM & Stripe Key Leak in CI Logs

Collection: catalog · ID: `ops-secrets-leak-incident` · Mode: **guided**

## Business context

A public GitHub Actions CI/CD workflow log for an open-source client SDK printed the entire environment configuration, exposing production AWS Access Keys (`AKIA...`) and live Stripe API Secret Keys (`sk_live_...`).

## Task

Triage this active security emergency. Identify the immediate containment actions (revocation, key rotation, active session invalidation), audit access logs for unauthorized access/exfiltration, fix the pipeline to prevent secret echo, and author a blameless post-mortem with preventative guardrails (git-secrets, AWS KMS, IAM least privilege).

## Candidate tasks

- Step 1: Immediate Revocation - List exact steps to revoke leaked IAM credentials and Stripe secret key.
- Step 2: Threat Assessment - Identify what AWS CloudTrail APIs were called (e.g. ec2:RunInstances for cryptomining) and terminate unauthorized resources.
- Step 3: Invalidate Active Sessions - Force-revoke temporary STS tokens and rotate Stripe webhook signing secret.
- Step 4: Pipeline Remediation - Remove `printenv`, enable secret masking, and switch to OIDC (OpenID Connect) for short-lived credentials instead of static IAM keys.
- Step 5: Write Root Cause Analysis & Prevention Plan.

## Constraints

- Treat the leaked credentials as compromised immediately.
- Must rotate keys without causing prolonged production downtime.
- Audit CloudTrail and Stripe Dashboard audit logs for unauthorized anomalous activity.

## Follow-up questions

- How does GitHub Actions OpenID Connect (OIDC) authenticate to AWS without any stored passwords or keys?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
