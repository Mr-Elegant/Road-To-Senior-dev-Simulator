# Filtering Grouped Aggregates with HAVING

Collection: sql · ID: `sql-t1-10` · Mode: **sql**

## Business context

Marketing wants to identify VIP customers who have placed 2 or more orders.

## Task

Write a query on the `orders` table grouping by `customer_id`, returning `customer_id` and `order_count` for all customers who have placed 2 or more orders, sorted by `order_count` descending.

## Follow-up questions

- Explain the exact query execution order between WHERE, GROUP BY, and HAVING.

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/filtering-grouped-aggregates-with-having--sql-t1-10
npm run practice:watch -- sql/filtering-grouped-aggregates-with-having--sql-t1-10
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
