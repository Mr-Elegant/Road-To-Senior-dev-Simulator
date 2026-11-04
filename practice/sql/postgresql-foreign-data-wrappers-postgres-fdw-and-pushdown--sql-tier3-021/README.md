# PostgreSQL Foreign Data Wrappers (postgres_fdw) and Pushdown

Collection: sql · ID: `sql-tier3-021` · Mode: **guided**

## Business context

Your architecture team separates high-volume analytics into an isolated PostgreSQL cluster while user authentication lives in the core database. You need the analytics database to join `events` with `users` from the core database seamlessly.

## Task

Explain how PostgreSQL Foreign Data Wrappers (`postgres_fdw`) implement the SQL/MED standard. Detail the setup steps (`CREATE SERVER`, `CREATE USER MAPPING`, `IMPORT FOREIGN SCHEMA`). What is query pushdown (WHERE clauses, aggregates, joins), and how does network latency impact FDW performance?

## Follow-up questions

- What setting controls how many rows `postgres_fdw` fetches in a single network round trip, and why is the default often suboptimal?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
