# Row-Level Locking with SELECT FOR UPDATE

Collection: sql · ID: `sql-t2-21` · Mode: **guided**

## Business context

Two concurrent requests read an account balance ($100), check that it is >= $80, and both proceed to debit $80 simultaneously, causing the balance to go negative (-$60).

## Task

Explain this Check-Then-Act race condition. How does `SELECT ... FOR UPDATE` prevent it, and what row-level locks does it acquire?

## Follow-up questions

- What does SELECT ... FOR UPDATE SKIP LOCKED do, and why is it used in high-throughput task queues?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
