# Calculating Running Totals with Cumulative Window Aggregation

Collection: sql · ID: `sql-t2-05` · Mode: **sql**

## Business context

Finance needs to track cumulative daily revenue progression for delivered orders throughout February and March 2024.

## Task

Write a query on `orders` for status `'DELIVERED'` returning `id`, `order_date`, `total_amount`, and `running_total` (the cumulative sum of `total_amount` ordered by `order_date` ascending).

## Follow-up questions

- What happens if two orders have the exact same order_date in SUM(...) OVER (ORDER BY order_date)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/calculating-running-totals-with-cumulative-window-aggregation--sql-t2-05
npm run practice:watch -- sql/calculating-running-totals-with-cumulative-window-aggregation--sql-t2-05
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
