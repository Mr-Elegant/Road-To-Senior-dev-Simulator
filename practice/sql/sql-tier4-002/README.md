# Zero-Downtime Column Rename and Type Migration in 24/7 Production

Collection: sql · ID: `sql-tier4-002` · Mode: **guided**

## Business context

A core table `orders` (100 million rows, 3,000 writes/sec) has a column `amount INT` storing dollars that must be converted to `amount_cents BIGINT` to support multi-currency fractional cents. A naive `ALTER TABLE orders ALTER COLUMN amount TYPE BIGINT;` will lock the table for 45 minutes.

## Task

Design a comprehensive zero-downtime database migration pattern to migrate `amount` to `amount_cents BIGINT` without locking concurrent writes or disrupting older application versions. Detail the expand-and-contract (dual-write) pattern with views, triggers, batch backfills, and final cleanup.

## Follow-up questions

- Instead of triggers, can generated columns (`GENERATED ALWAYS AS ... STORED`) be used to migrate column types?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
