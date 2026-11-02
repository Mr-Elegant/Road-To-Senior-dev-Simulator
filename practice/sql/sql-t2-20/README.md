# PostgreSQL Read Committed vs. Repeatable Read Isolation Levels

Collection: sql · ID: `sql-t2-20` · Mode: **guided**

## Business context

An analytical report queries customer balances at 10:00 AM, then executes a second query at 10:01 AM inside the same transaction. The second query returns different numbers because other users made payments in the interim.

## Task

Explain why this Non-Repeatable Read anomaly occurs under PostgreSQL's default `Read Committed` isolation level. How does `Repeatable Read` prevent this using snapshot isolation?

## Follow-up questions

- What happens in Repeatable Read if transaction T1 tries to UPDATE a row that was updated and committed by transaction T2 after T1's snapshot was taken?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
