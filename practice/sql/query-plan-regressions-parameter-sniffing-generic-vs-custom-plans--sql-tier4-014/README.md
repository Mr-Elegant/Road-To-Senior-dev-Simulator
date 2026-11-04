# Query Plan Regressions: Parameter Sniffing & Generic vs Custom Plans

Collection: sql · ID: `sql-tier4-014` · Mode: **guided**

## Business context

A prepared statement `SELECT * FROM orders WHERE status = $1` runs in 0.8ms for the first 4 executions. On the 5th execution, latency explodes to 1,400ms and remains permanently slow for all subsequent queries.

## Task

Explain PostgreSQL prepared statement execution planning. What is the difference between a Custom Plan and a Generic Plan? How does the 5-execution threshold trigger plan caching, why does parameter sniffing cause plan regressions on skewed data, and how do you fix it?

## Follow-up questions

- What parameter allows developers to force PostgreSQL to always use generic plans or always use custom plans?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
