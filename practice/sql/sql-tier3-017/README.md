# Zero-Downtime Schema Migrations: Safe Index Creation & Column Additions

Collection: sql · ID: `sql-tier3-017` · Mode: **guided**

## Business context

A developer deploys a migration to add a non-null column with a default value and an index on a 40-million row `orders` table during peak traffic: `ALTER TABLE orders ADD COLUMN tracking_code VARCHAR(64) DEFAULT 'PENDING' NOT NULL; CREATE INDEX idx_orders_tracking ON orders(tracking_code);`. The entire API locks up and crashes.

## Task

Identify the lock types acquired by standard DDL commands. Why did this migration cause API downtime? Write the safe, zero-downtime PostgreSQL procedure to add a column with a default value, enforce NOT NULL, and build the index on a live high-traffic table.

## Follow-up questions

- What does `CREATE INDEX CONCURRENTLY` do if it fails midway (e.g. due to a unique constraint violation or deadlock)? What state is the index left in, and how do you fix it?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
