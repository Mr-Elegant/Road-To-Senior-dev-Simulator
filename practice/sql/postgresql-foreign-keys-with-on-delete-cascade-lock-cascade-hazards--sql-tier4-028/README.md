# PostgreSQL Foreign Keys with ON DELETE CASCADE: Lock Cascade Hazards

Collection: sql · ID: `sql-tier4-028` · Mode: **guided**

## Business context

A social commerce app uses `ON DELETE CASCADE` across 6 levels of relational hierarchy (`users` -> `posts` -> `comments` -> `reactions` -> `audit_events`). A user deletes their account, and the resulting cascading delete locks 250,000 rows across 8 tables, causing a database-wide deadlock storm.

## Task

Analyze the locking behavior and transaction risks of deep `ON DELETE CASCADE` chains in PostgreSQL. Why do cascading deletes cause long-running lock retention and deadlocks? What architectural alternatives (soft deletes, asynchronous background deletion workers) eliminate cascade locking hazards?

## Follow-up questions

- Why does a foreign key defined with `ON DELETE SET NULL` carry similar locking risks to `ON DELETE CASCADE`?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
