# Soft Deletes vs. Hard Deletes: Architecture and Query Traps

Collection: sql · ID: `sql-t2-29` · Mode: **guided**

## Business context

An engineering team implements soft deletes by adding `is_deleted BOOLEAN DEFAULT false` to every table.

## Task

What are the advantages of soft deletes? What query traps, index bloat, and UNIQUE constraint complications do soft deletes introduce?

## Follow-up questions

- What is a cleaner alternative to soft delete columns for tables that must maintain strict relational constraints?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
