# Production Incident: Cascading Lock Pileup Caused by Missing Foreign Key Index

Collection: sql · ID: `sql-tier4-011` · Mode: **guided**

## Business context

During a customer account deletion workflow, a batch script deletes 1,000 inactive accounts from `customers`. Within 10 seconds, the entire payment API freezes. Investigation shows that deleting a row from `customers` triggers a table-wide `ShareLock` or sequential scan on `orders`.

## Task

Explain how PostgreSQL enforces foreign key constraints during DELETE/UPDATE of parent rows. Why does a foreign key column without an index on the child table cause table-level lock contention and cascading API outages? Write the query to detect all unindexed foreign keys across the database.

## Follow-up questions

- Does an `INSERT` into the child table (`orders`) require an index on `orders(customer_id)` to verify the foreign key?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
