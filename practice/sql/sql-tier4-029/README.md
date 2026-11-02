# Zero-Downtime NOT NULL Constraint Addition on 100-Million Row Tables

Collection: sql · ID: `sql-tier4-029` · Mode: **guided**

## Business context

You need to enforce `NOT NULL` on `orders(customer_id)`. Running `ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;` on a 100-million row table takes an `ACCESS EXCLUSIVE` lock and scans all 100 million rows to verify no NULLs exist, locking out the entire business for 4 minutes.

## Task

Explain why traditional `SET NOT NULL` causes database downtime on large tables in PostgreSQL. Detail the 2-step zero-downtime technique using `CHECK ... NOT VALID` followed by `VALIDATE CONSTRAINT`. Explain how PostgreSQL 12+ optimizes this pattern.

## Follow-up questions

- Why is converting the check constraint to a native `SET NOT NULL` desirable in PostgreSQL 12+ rather than leaving the check constraint permanently?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
