# Understanding PostgreSQL MVCC: Tuple Headers and xmin / xmax

Collection: sql · ID: `sql-t2-23` · Mode: **guided**

## Business context

A software engineer asks how PostgreSQL allows readers to read data without locking out concurrent writers.

## Task

What is Multi-Version Concurrency Control (MVCC) in PostgreSQL? Explain how every row tuple uses hidden system columns `xmin` and `xmax` to determine visibility.

## Follow-up questions

- What happens to dead row versions (tuples where xmax is committed and expired) over time?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
