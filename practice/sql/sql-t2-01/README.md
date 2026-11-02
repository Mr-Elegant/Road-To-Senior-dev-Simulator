# Filtering Above-Average Values with Scalar Subqueries

Collection: sql · ID: `sql-t2-01` · Mode: **sql**

## Business context

Merchandising analysts want to identify high-value products priced above the overall average catalog price.

## Task

Write a query on `products` to find all products whose `price` is strictly greater than the average price of all active products (`is_active = true`). Return `id`, `name`, `category`, and `price`, ordered by `price` descending.

## Follow-up questions

- How does a scalar subquery differ from a correlated subquery in terms of execution?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t2-01
npm run practice:watch -- sql/sql-t2-01
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
