# Top N Records Per Group Pattern

Collection: sql · ID: `sql-t2-07` · Mode: **sql**

## Business context

The homepage needs to show the top 1 highest-priced product for every category.

## Task

Write a query using a CTE and `ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC)` to retrieve only the #1 most expensive product in each category. Return `category`, `name`, and `price`, ordered by `category` ascending.

## Follow-up questions

- In PostgreSQL 13+, how does the planner optimize queries with QUALIFY in other dialects vs CTEs in PostgreSQL?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/top-n-records-per-group-pattern--sql-t2-07
npm run practice:watch -- sql/top-n-records-per-group-pattern--sql-t2-07
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
