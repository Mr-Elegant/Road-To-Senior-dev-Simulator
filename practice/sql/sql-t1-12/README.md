# Finding Inactive Records with LEFT JOIN and IS NULL

Collection: sql · ID: `sql-t1-12` · Mode: **sql**

## Business context

Growth marketing wants to run a re-engagement campaign targeting registered customers who have never placed an order.

## Task

Write a query using a `LEFT JOIN` between `customers` and `orders` to find all customers who have zero recorded orders. Return `customers.id`, `customers.name`, and `customers.email`, sorted by `customers.id` ascending.

## Follow-up questions

- How does an anti-join with LEFT JOIN ... IS NULL compare with NOT EXISTS in PostgreSQL?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t1-12
npm run practice:watch -- sql/sql-t1-12
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
