# Partial Indexes in PostgreSQL

Collection: sql · ID: `sql-t2-16` · Mode: **guided**

## Business context

A job queue table has 10 million completed jobs and 500 pending jobs. Workers frequently run: `SELECT * FROM jobs WHERE status = 'PENDING' ORDER BY priority DESC;`

## Task

What is a Partial Index in PostgreSQL? Write the DDL to index only pending jobs. Why is this superior to a full table index?

## Follow-up questions

- Will PostgreSQL use this partial index if a query executes: SELECT * FROM jobs WHERE status = 'COMPLETED'?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
