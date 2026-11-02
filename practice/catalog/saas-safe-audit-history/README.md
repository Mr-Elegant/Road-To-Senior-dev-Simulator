# SaaS: Record Useful Audit History Without Leaking Secrets

Collection: catalog · ID: `saas-safe-audit-history` · Mode: **javascript**

## Business context

An administration SaaS logs entire organization objects after edits. The log now contains integration API keys, and a client-supplied tenant field can misattribute another organization's activity.

## Task

Implement solution({ context, before, after }) returning { entry }. context is null or trusted server-side { tenantId, actorId }. before and after are null or resource snapshots with id, tenantId, name, status, plan and possibly additional secret fields. Only name, status, and plan are auditable. Both values for each auditable field must be strings. Return entry null for invalid context, missing resources, different IDs, tenant mismatch, invalid auditable fields, or no auditable changes. IDs and trusted context values must be nonempty strings. This function formats an already-authorized edit; it does not authorize the mutation.

## Candidate tasks

- Replace full-object logging with an allowlisted change record and trusted context checks.
- Describe transactional audit durability, restricted access, retention, and tests against accidental secret capture.

## Constraints

- A valid entry is exactly { tenantId, actorId, resourceId, action: "organization.updated", changes }. changes contains only changed allowlisted fields in name, status, plan order as { field, before, after }.
- Exclude every non-allowlisted field, including nested credentials and newly introduced secret names. Do not modify input snapshots or accept actor identity from resource data.

## Follow-up questions

- How would you audit API key rotation without logging the key?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/saas-safe-audit-history
npm run practice:watch -- catalog/saas-safe-audit-history
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
