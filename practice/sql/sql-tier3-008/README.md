# PostgreSQL Transaction Isolation: Write Skew and Serializable Snapshot Isolation (SSI)

Collection: sql · ID: `sql-tier3-008` · Mode: **guided**

## Business context

In a loan management system, two loan officers simultaneously approve disbursements for the same applicant under `REPEATABLE READ`. The business rule states: "Total active disbursed debt for an applicant cannot exceed $100,000." Both officers see $60,000 active debt and both disburse $30,000. Total debt is now $120,000.

## Task

Explain why `REPEATABLE READ` allows this Write Skew anomaly while preventing dirty reads and non-repeatable reads. Explain how PostgreSQL implements Serializable Snapshot Isolation (SSI) using SIREAD locks to detect rw-antidependencies and abort conflicting transactions with code `40001 serialization_failure`.

## Follow-up questions

- If you do not want to use SERIALIZABLE isolation, how can you prevent write skew in READ COMMITTED mode using explicit locking?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
