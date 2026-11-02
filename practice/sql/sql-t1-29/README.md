# Row Insertion and Returning Generated IDs with RETURNING

Collection: sql · ID: `sql-t1-29` · Mode: **guided**

## Business context

An Express.js API creates a new customer and immediately needs the newly generated auto-incrementing ID to create an initial order.

## Task

How does the PostgreSQL-specific `RETURNING` clause work with `INSERT`, `UPDATE`, and `DELETE`? Why is it superior to executing a secondary `SELECT LASTVAL()` query?

## Follow-up questions

- Can RETURNING be used with UPDATE and DELETE statements in PostgreSQL?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
