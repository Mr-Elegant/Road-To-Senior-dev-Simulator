# PostgreSQL NULLS FIRST / NULLS LAST Index Semantics

Collection: sql · ID: `sql-tier3-028` · Mode: **guided**

## Business context

A pagination endpoint sorts orders by `shipped_at DESC NULLS LAST` to display the most recently shipped orders first and pending unshipped orders at the end. Despite having an index on `(shipped_at DESC)`, the query takes 1.2 seconds and shows `Sort Method: external merge Disk` in the plan.

## Task

Explain how PostgreSQL indexes store NULL values by default in B-Trees. What is the difference between `NULLS FIRST` and `NULLS LAST`? Why did the index on `(shipped_at DESC)` fail to eliminate the explicit sort, and what exact index definition matches `ORDER BY shipped_at DESC NULLS LAST`?

## Follow-up questions

- Can PostgreSQL scan an `ASC NULLS LAST` index backwards (backward index scan) to satisfy an `ORDER BY col DESC NULLS LAST` query?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
