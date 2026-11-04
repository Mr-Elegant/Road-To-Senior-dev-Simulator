# Aggregating Totals with COUNT, SUM, and AVG

Collection: sql · ID: `sql-t1-08` · Mode: **sql**

## Business context

The CFO needs macro metrics on delivered orders: total order count, total gross revenue, and the average order value.

## Task

Write a query on the `orders` table to calculate `total_orders` (count of rows), `gross_revenue` (sum of total_amount), and `avg_order_value` (average of total_amount rounded to 2 decimals) for orders with status `DELIVERED`.

## Follow-up questions

- What is the difference between COUNT(*) and COUNT(column_name)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/aggregating-totals-with-count-sum-and-avg--sql-t1-08
npm run practice:watch -- sql/aggregating-totals-with-count-sum-and-avg--sql-t1-08
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
