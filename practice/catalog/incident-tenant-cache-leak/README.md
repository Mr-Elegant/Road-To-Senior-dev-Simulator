# Tenant Isolation: A CDN Serves Another Customer’s Invoice

Collection: catalog · ID: `incident-tenant-cache-leak` · Mode: **guided**

## Business context

A SaaS invoice API authenticates at the origin, but a CDN rollout caches /api/invoices/42 by path alone. Different tenants use the same local invoice IDs, so cache hits can bypass origin authorization.

## Task

A customer reports an invoice bearing another company’s name. The response has X-Cache: Hit and Age: 83. Work through three timed developments, justify your actions, and write an evidence-based incident response. The simulation starts paused; advancing time can expire unanswered decisions.

## Candidate tasks

- Contain customer impact while preserving evidence and data integrity.
- Respond to each new development and explain the selected action.
- Cite telemetry supporting the root cause; distinguish observation from inference.
- Define a permanent correction, regression coverage, recovery gates, and stakeholder update.

## Constraints

- Treat the report as a potential confidentiality incident and preserve access evidence.
- Do not trust a client-supplied tenant header as authorization.
- Use synthetic tenant fixtures for verification; do not expose more customer records while testing.
- All telemetry is synthetic. Actions only affect this practice simulation.

## Follow-up questions

- Is adding Vary: Cookie sufficient to fix this incident?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
