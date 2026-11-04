# Multi-Tenant Database Architectures: Trade-Off Analysis at Scale

Collection: sql · ID: `sql-tier4-010` · Mode: **guided**

## Business context

Your B2B SaaS startup is scaling from 100 to 10,000 enterprise customers, including Fortune 500 banks with strict data isolation and custom schema requirements. The VP of Engineering asks you to recommend the database architecture.

## Task

Conduct an exhaustive architectural trade-off analysis of the three multi-tenant PostgreSQL patterns: (1) Shared Database, Shared Schema with Row-Level Security; (2) Shared Database, Separate Schema per Tenant; and (3) Separate Database per Tenant. Evaluate each across system catalog limits, connection pool limits, migration complexity, and backup isolation.

## Follow-up questions

- Why does PgBouncer struggle when an application uses the Separate Database per Tenant model with 5,000 databases?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
