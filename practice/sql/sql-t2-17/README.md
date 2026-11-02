# Expression / Functional Indexes in PostgreSQL

Collection: sql · ID: `sql-t2-17` · Mode: **guided**

## Business context

Users are searching for emails case-insensitively: `WHERE LOWER(email) = 'alex@example.com'`. Even though a B-Tree index exists on `email`, PostgreSQL executes a slow Sequential Scan.

## Task

Why does wrapping a column in a function like `LOWER(email)` invalidate a standard B-Tree index? How does an Expression Index solve this problem?

## Follow-up questions

- What requirement must a function satisfy to be used in a PostgreSQL expression index?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
