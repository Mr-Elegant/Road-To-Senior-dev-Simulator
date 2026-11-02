# Advisory Locks vs FOR UPDATE SKIP LOCKED for Message Queues

Collection: sql · ID: `sql-tier3-018` · Mode: **sql**

## Business context

You are building a background task processor where multiple worker processes concurrently poll an `outbox_events` table to process and publish pending events. Standard `SELECT ... FOR UPDATE` causes workers to block each other and serialize execution.

## Task

Compare `SELECT FOR UPDATE`, `SELECT FOR UPDATE NOWAIT`, and `SELECT FOR UPDATE SKIP LOCKED`. Write a concurrency-safe worker query that claims exactly 5 unprocessed events, locks them so no other worker can touch them, and updates their status to `PROCESSING` in an atomic transaction.

## Follow-up questions

- Why is an index on `(status, id)` essential for `SKIP LOCKED` worker queries on tables with millions of completed rows?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier3-018
npm run practice:watch -- sql/sql-tier3-018
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
