# Production Incident: Statement Timeout vs Lock Timeout Cascading Outage

Collection: sql · ID: `sql-tier4-021` · Mode: **guided**

## Business context

To prevent slow queries from hanging the database, an engineer set `statement_timeout = '5s'` globally. Later, a background migration ran `ALTER TABLE orders ADD COLUMN flags INT;`. The DDL failed after 5 seconds, but during those 5 seconds, the entire payment API experienced an outage.

## Task

Explain how PostgreSQL lock queues work and why a waiting DDL statement holding an `ACCESS EXCLUSIVE` lock request blocks all subsequent read and write queries. Why did `statement_timeout` fail to prevent the outage, and how does `lock_timeout` eliminate cascading lock pileups?

## Follow-up questions

- What is the difference between `lock_timeout`, `statement_timeout`, and `idle_in_transaction_session_timeout`?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
