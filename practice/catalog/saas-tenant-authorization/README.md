# SaaS: Close a Cross-Tenant Invoice Access Bug

Collection: catalog · ID: `saas-tenant-authorization` · Mode: **javascript**

## Business context

A finance SaaS authenticates users but fetches invoices by ID alone. A customer can change the invoice ID in a URL and read another organization's billing data.

## Task

Implement solution({ session, requestedTenantId, invoice, action }) returning { allowed: boolean }. session is null or trusted server context with userId and memberships [{ tenantId, role, active }]. invoice is null or { id, tenantId }. action is read, edit, or delete. Require a nonempty string session.userId, an active membership for the requested tenant, and a matching invoice tenant. Owners may read/edit/delete, editors read/edit, viewers read only. Unknown roles/actions and missing resources must deny access. requestedTenantId is untrusted routing input.

## Candidate tasks

- Replace the authentication-only check with tenant and permission checks.
- Describe where server-side query scoping, cache keys, and background jobs must carry tenant identity.

## Constraints

- Membership active must equal true; truthy strings must not grant access. Memberships have at most one entry per tenant.
- Do not return invoice data, change inputs, infer membership from the invoice, or let a role from one tenant authorize another tenant.

## Follow-up questions

- How could a correct database query still leak an invoice?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/saas-tenant-authorization
npm run practice:watch -- catalog/saas-tenant-authorization
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
