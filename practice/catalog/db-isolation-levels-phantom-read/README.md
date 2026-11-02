# Financial Ledger Wallet Balance Anomaly & Isolation Levels

Collection: catalog · ID: `db-isolation-levels-phantom-read` · Mode: **guided**

## Business context

A digital banking ledger enforces that a customer's balance can never drop below zero. Under concurrent withdrawal and transfer requests, users are able to overdraw their accounts into negative balances even though the application code checks `balance >= withdrawalAmount` before debiting.

## Task

Under the default PostgreSQL `READ COMMITTED` isolation level, checking account balance with `SELECT sum(amount)` in one statement does not prevent another concurrent transaction from inserting a debit transaction before the current transaction executes `INSERT INTO transactions ...`. Diagnose the anomaly (Write Skew / Phantom Read) and compare resolution via `SERIALIZABLE` transactions vs pessimistic row locking (`SELECT FOR UPDATE`).

## Candidate tasks

- Explain why `READ COMMITTED` permits write skew / phantom calculations across multiple statements.
- Implement pessimistic locking using a parent `accounts` table row with `SELECT balance FROM accounts WHERE id = $1 FOR UPDATE`.
- Explain how `SERIALIZABLE` isolation solves this with Serializable Snapshot Isolation (SSI) and requires application-level retries on error 40001.

## Constraints

- Account balance must NEVER drop below 0.
- Must analyze trade-offs between `SELECT ... FOR UPDATE` vs `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`.
- Explain how PostgreSQL detects serialization failures (SQLSTATE 40001) and how retry loops must be implemented.

## Follow-up questions

- What is Write Skew and why does Repeatable Read not protect against it in PostgreSQL?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
