# PostgreSQL Advisory Locks for Queue Worker Deadlock Prevention

Collection: sql · ID: `sql-tier4-025` · Mode: **sql**

## Business context

A multi-node payment capture service processes refunds. When a refund arrives, it must lock the customer record to update their ledger balance. Two concurrent refund requests for the same customer deadlock against each other because each transaction locks `payments` first, then attempts to lock `customers`.

## Task

Implement a distributed mutual-exclusion lock using PostgreSQL 64-bit transaction advisory locks (`pg_advisory_xact_lock`) against the customer ID before acquiring row locks. Explain why this completely eliminates deadlocks, and write the query acquiring the lock and executing the ledger deduction.

## Follow-up questions

- What is the performance advantage of using `pg_advisory_xact_lock(customer_id)` over `SELECT id FROM customers WHERE id = 42 FOR UPDATE`?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier4-025
npm run practice:watch -- sql/sql-tier4-025
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
