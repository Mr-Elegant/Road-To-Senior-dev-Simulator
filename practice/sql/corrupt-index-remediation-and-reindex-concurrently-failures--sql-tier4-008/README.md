# Corrupt Index Remediation and REINDEX CONCURRENTLY Failures

Collection: sql · ID: `sql-tier4-008` · Mode: **guided**

## Business context

A primary key lookup on `orders` where `id = 45910` returns 0 rows. However, `SELECT * FROM orders WHERE id = 45910` with `SET enable_indexscan = off;` returns the row! The B-tree index is corrupt. A developer ran `REINDEX INDEX CONCURRENTLY idx_orders_pkey;` which failed midway after a network timeout.

## Task

Explain how B-tree index corruption manifests in PostgreSQL. What state is an index left in when `REINDEX CONCURRENTLY` is interrupted? Detail the safe recovery procedure to rebuild the corrupt primary key index online without locking checkout transactions.

## Follow-up questions

- What official PostgreSQL extension can detect B-tree index logical corruption without waiting for queries to return wrong data?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
