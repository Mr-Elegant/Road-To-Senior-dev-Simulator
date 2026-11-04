# Common Table Expressions (CTEs) for Multi-Step Aggregations

Collection: sql · ID: `sql-t2-03` · Mode: **sql**

## Business context

Executive leadership requires a customer spending tiers report: aggregate total spend per customer first, then filter for customers whose lifetime spend exceeds $300.

## Task

Write a query using a `WITH` clause (CTE) named `customer_spending` that aggregates `customer_id` and `total_spent` (sum of `total_amount` for orders with status `'DELIVERED'`). In the main query, join with `customers` to return `customers.name`, `customer_spending.total_spent`, ordered by `total_spent` descending.

## Follow-up questions

- In PostgreSQL 12+, how does the planner handle CTE optimization with the MATERIALIZED vs NOT MATERIALIZED keywords?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/common-table-expressions-ctes-for-multi-step-aggregations--sql-t2-03
npm run practice:watch -- sql/common-table-expressions-ctes-for-multi-step-aggregations--sql-t2-03
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
