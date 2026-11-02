# Correlated Subquery with EXISTS

Collection: sql · ID: `sql-t2-02` · Mode: **sql**

## Business context

The support operations team wants a list of customers who have at least one refunded order.

## Task

Write a query using `EXISTS` to find all customers from `customers` who have at least one order with a corresponding record in the `refunds` table. Return `customers.id`, `customers.name`, and `customers.city`, sorted by `id` ascending.

## Follow-up questions

- Why is SELECT 1 inside an EXISTS subquery standard practice instead of SELECT * or column names?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t2-02
npm run practice:watch -- sql/sql-t2-02
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
