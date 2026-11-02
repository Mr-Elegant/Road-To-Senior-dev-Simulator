# Optimistic Locking with Version Columns

Collection: sql · ID: `sql-t2-22` · Mode: **guided**

## Business context

An enterprise CRM system has users editing customer profile pages in browser tabs for minutes at a time. Holding a database lock for minutes with SELECT FOR UPDATE would exhaust connections and freeze the database.

## Task

What is Optimistic Concurrency Control (OCC)? How does a version number or updated_at column implement optimistic locking in application SQL?

## Follow-up questions

- Compare Optimistic Locking and Pessimistic Locking in terms of suitability for high-conflict vs low-conflict workloads.

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
