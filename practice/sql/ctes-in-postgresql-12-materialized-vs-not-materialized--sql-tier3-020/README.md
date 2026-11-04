# CTEs in PostgreSQL 12+: MATERIALIZED vs NOT MATERIALIZED

Collection: sql · ID: `sql-tier3-020` · Mode: **guided**

## Business context

After upgrading a database from PostgreSQL 11 to PostgreSQL 14, an analytical query that used a Common Table Expression ran 50 times faster. However, another query containing a CTE suddenly experienced a severe plan regression.

## Task

Explain the fundamental change PostgreSQL 12 introduced regarding Common Table Expression (CTE) optimization. What is CTE inlining? How do the `AS MATERIALIZED` and `AS NOT MATERIALIZED` clauses allow developers to explicitly control query planner behavior and optimization fences?

## Follow-up questions

- When is forcing `AS MATERIALIZED` beneficial in modern PostgreSQL 14+?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
