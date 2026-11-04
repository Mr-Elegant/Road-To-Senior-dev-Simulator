# Composite and Foreign Key Indexing Basics

Collection: sql · ID: `sql-t1-30` · Mode: **guided**

## Business context

A query filters on both tenant organization and event creation date: `WHERE organization_id = 101 AND created_at >= '2024-03-01'`.

## Task

What is a Composite Index (Multi-Column Index)? In what order should columns be placed in a composite index for this query?

## Follow-up questions

- Can the index ON events (organization_id, created_at) be used by a query filtering ONLY on created_at?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
