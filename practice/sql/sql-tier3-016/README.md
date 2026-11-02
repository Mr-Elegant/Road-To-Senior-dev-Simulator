# PostgreSQL Join Strategies: Nested Loop, Hash Join, and Merge Join

Collection: sql · ID: `sql-tier3-016` · Mode: **guided**

## Business context

While reviewing query plans across your application, you observe that joining `customers` (50,000 rows) and `orders` (2,000,000 rows) sometimes uses a Nested Loop, sometimes a Hash Join, and occasionally a Merge Join.

## Task

Analyze the three fundamental join algorithms in the PostgreSQL query engine: Nested Loop (with and without index), Hash Join, and Merge Join. Detail the memory prerequisites (`work_mem`), sort requirements, time complexity, and the specific cost trade-offs that drive the optimizer’s choice.

## Follow-up questions

- Why would the query planner choose a Nested Loop over a Hash Join even when joining a 1-million row table, and how can stale statistics cause a disastrous plan regression here?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
