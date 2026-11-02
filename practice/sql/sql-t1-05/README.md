# Range Filtering with BETWEEN and Date Comparison

Collection: sql · ID: `sql-t1-05` · Mode: **sql**

## Business context

Finance auditors require all orders placed during the entire month of February 2024.

## Task

Write a query to retrieve the `id`, `customer_id`, `order_date`, and `total_amount` for all orders placed between `2024-02-01 00:00:00` and `2024-02-29 23:59:59`, ordered by `order_date` ascending.

## Follow-up questions

- Why is using BETWEEN with datetime values considered an anti-pattern in production queries?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t1-05
npm run practice:watch -- sql/sql-t1-05
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
