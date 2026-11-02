# Lead Engineer Interview: 45-Minute Outage Facilitation & Blameless Post-Mortem

Collection: catalog · ID: `interview-lead-incident-postmortem` · Mode: **guided**

## Business context

A junior developer merged a migration that dropped an active database index during peak business hours. The database locked up, web servers exhausted connection pools, and the platform suffered a total 45-minute outage costing $350,000 in lost revenue. Company leadership is furious and demanding someone be held accountable.

## Task

As the Engineering Lead / Staff Architect, step into the leadership role. Facilitate the post-mortem, steer leadership away from punitive blame toward systemic root cause analysis, conduct the 5 Whys investigation, and design automated preventative guardrails (CI/CD linting, zero-downtime migration linters, read-only replica failover) so this class of failure is structurally impossible in the future.

## Candidate tasks

- Question 1: How do you respond to executive leadership demanding to know "which developer made the mistake"?
- Question 2: Walk through the "5 Whys" methodology for this incident.
- Question 3: Distinguish between the Proximate Cause vs Systemic Root Cause.
- Question 4: Present the Action Item Matrix categorized into: Preventative Guardrails, Detection/Observability, and Mitigation.
- Question 5: How do you foster psychological safety in an engineering organization after a major production failure?

## Constraints

- Maintain an uncompromisingly blameless culture focused on systemic safeguards.
- Conduct a thorough 5 Whys root cause analysis.
- Define actionable, prioritized Action Items (Prevent, Detect, Mitigate).

## Follow-up questions

- Why is `lock_timeout` the single most critical configuration parameter when running PostgreSQL migrations in production?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
