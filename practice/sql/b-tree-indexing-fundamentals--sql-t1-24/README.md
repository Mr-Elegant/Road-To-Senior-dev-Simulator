# B-Tree Indexing Fundamentals

Collection: sql · ID: `sql-t1-24` · Mode: **guided**

## Business context

A query `SELECT * FROM users WHERE email = 'test@example.com';` is taking 800ms on a table with 2 million users.

## Task

Explain what a sequential scan (table scan) is, how a B-Tree index accelerates search from O(N) to O(log N), and the write overhead of indexes.

## Follow-up questions

- Why does creating an index on a boolean column (e.g. is_active) often provide little to no benefit?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
