# Zero-Downtime Deduplication of 50 Million Records Under Live Write Load

Collection: sql · ID: `sql-tier4-016` · Mode: **sql**

## Business context

Due to an idempotent webhook failure, duplicate payment records were inserted into `payments` for the same `order_id` and `transaction_ref`. You must delete all duplicate rows, keeping only the earliest record (`MIN(id)`), while thousands of concurrent orders continue inserting into the table.

## Task

Write a chunked batch deduplication script using keyset ranges that identifies duplicate rows in `payments` by `(order_id, transaction_ref)` and deletes duplicates in small transactions (e.g. 5,000 IDs per iteration) to prevent locking the table or generating unmanageable WAL volume.

## Follow-up questions

- What risk exists if a duplicate pair spans across two different ID chunk boundaries (e.g. row 1 is ID 4,999 and row 2 is ID 5,001)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/zero-downtime-deduplication-of-50-million-records-under-live-write-load--sql-tier4-016
npm run practice:watch -- sql/zero-downtime-deduplication-of-50-million-records-under-live-write-load--sql-tier4-016
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
