# SQL Upsert Patterns: INSERT ... ON CONFLICT DO UPDATE

Collection: sql · ID: `sql-t2-28` · Mode: **guided**

## Business context

A telemetry service aggregates daily page views per user. If the record for today does not exist, insert it with count = 1; if it already exists, increment the existing count by 1.

## Task

Write the PostgreSQL `INSERT ... ON CONFLICT` statement to achieve this atomic upsert. Why is this superior to executing `SELECT` followed by `INSERT` or `UPDATE` in application code?

## Follow-up questions

- What is required on the target columns (user_id, view_date) for ON CONFLICT to work?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
