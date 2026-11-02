# PostgreSQL GIN (Generalized Inverted) Indexes on JSONB

Collection: sql · ID: `sql-t2-19` · Mode: **guided**

## Business context

An audit log query `SELECT * FROM audit_logs WHERE properties @> '{"ip_country": "DE"}';` takes 4 seconds on 5 million records.

## Task

Why is a standard B-Tree index incapable of accelerating arbitrary JSONB key/value searches? How does a GIN index work on JSONB columns?

## Follow-up questions

- What is the difference between jsonb_ops and jsonb_path_ops operator classes for GIN indexes?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
