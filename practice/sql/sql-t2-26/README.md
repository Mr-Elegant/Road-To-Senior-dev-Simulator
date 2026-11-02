# Database Deadlocks: Causes and Prevention

Collection: sql · ID: `sql-t2-26` · Mode: **guided**

## Business context

In a peer-to-peer payment app, User A transfers $50 to User B at the exact same millisecond that User B transfers $30 to User A. The application server logs: `ERROR: deadlock detected`.

## Task

What causes a database Deadlock? How does PostgreSQL detect and break deadlocks? What is the golden rule for preventing them in application code?

## Follow-up questions

- How should an application handle a deadlock error when it receives one from the database?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
