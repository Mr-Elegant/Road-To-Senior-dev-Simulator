# Transactions with BEGIN, COMMIT, and ROLLBACK

Collection: sql · ID: `sql-t1-23` · Mode: **guided**

## Business context

An order checkout process must deduct inventory and create an order simultaneously.

## Task

Write the SQL structure for a transaction that updates inventory and inserts an order. What happens if an error occurs halfway through?

## Follow-up questions

- In PostgreSQL, what happens if a command fails inside a transaction block?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
