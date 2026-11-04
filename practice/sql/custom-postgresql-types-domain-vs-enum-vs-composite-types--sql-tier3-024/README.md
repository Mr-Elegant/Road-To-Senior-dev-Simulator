# Custom PostgreSQL Types: DOMAIN vs ENUM vs Composite Types

Collection: sql · ID: `sql-tier3-024` · Mode: **guided**

## Business context

Your engineering team is debating how to represent currency amounts and loan statuses. Some suggest `VARCHAR(20) CHECK (status IN (...))`, others propose `CREATE TYPE loan_status AS ENUM (...)`, and a senior engineer suggests `CREATE DOMAIN`.

## Task

Compare PostgreSQL `ENUM`, `DOMAIN`, and `COMPOSITE TYPE`. What are the storage characteristics, type-safety benefits, and operational risks of each? Specifically, what are the migration hazards of altering an existing ENUM type in production?

## Follow-up questions

- Why do many senior database engineers prefer a lookup table with a foreign key (`status_id REFERENCES statuses(id)`) over a PostgreSQL ENUM for rapidly evolving business statuses?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
