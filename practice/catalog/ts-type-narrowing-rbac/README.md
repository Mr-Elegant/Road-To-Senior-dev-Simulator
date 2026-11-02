# Enterprise Multi-Tenant RBAC Authorization Type Narrowing

Collection: catalog · ID: `ts-type-narrowing-rbac` · Mode: **guided**

## Business context

An enterprise ERP platform provides access to financial records. Different user roles (SuperAdmin, OrgAdmin, BillingAuditor, Viewer) have strictly segregated access to tenant resources. A security audit discovered that downstream handler code assumed all users have an `organizationId`, causing cross-tenant data leaks when SuperAdmins (who operate globally without an organizationId) called organization-scoped endpoints.

## Task

Design a custom type guard and discriminated context model for user sessions. Implement a type guard `isOrgScopedSession(session)` that narrows a general user session to an `OrgScopedUserSession` guaranteed to contain a non-nullable `tenantId` and valid organization permissions.

## Candidate tasks

- Implement `isOrgScopedSession` type guard correctly checking runtime fields.
- Ensure the return type predicate `session is OrgScopedSession` narrows TypeScript type in if/else blocks.
- Discuss how custom type predicates can be dangerous if the runtime logic does not match the type predicate declaration.

## Constraints

- Type guards must use `session is OrgScopedUserSession` predicate.
- Must enforce tenant isolation at compile time.
- Must reject sessions with undefined or null tenantId.

## Follow-up questions

- What are Branded / Nominal Types in TypeScript and how do they enhance security?

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
