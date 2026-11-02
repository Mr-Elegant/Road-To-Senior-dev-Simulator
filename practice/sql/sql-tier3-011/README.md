# Row-Level Security (RLS) for Multi-Tenant Database Architecture

Collection: sql · ID: `sql-tier3-011` · Mode: **guided**

## Business context

A multi-tenant SaaS application shares a single PostgreSQL database across 1,200 enterprise tenants. An engineer accidentally forgets `WHERE tenant_id = ?` in a new microservice endpoint, exposing Tenant A’s data to Tenant B.

## Task

Design an end-to-end Row-Level Security (RLS) policy in PostgreSQL that guarantees tenant isolation at the database engine level. Explain `ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY`, setting session context via `current_setting()`, and why `SUPERUSER` or `BYPASSRLS` roles can bypass tenant isolation.

## Follow-up questions

- Why can a query with a leakproof user-defined function or side-channel error reveal unauthorized tenant data even under RLS?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
