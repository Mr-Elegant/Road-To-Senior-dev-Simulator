# FULL OUTER JOIN for Data Reconciliation

Collection: sql · ID: `sql-t2-08` · Mode: **sql**

## Business context

Finance and inventory auditing teams need to reconcile orders and payments to identify orders without payments and orphan payments without orders.

## Task

Write a query using a `FULL OUTER JOIN` between `orders` and `payments` on `orders.id = payments.order_id`. Return `orders.id` as `order_id`, `payments.id` as `payment_id`, `orders.total_amount`, and `payments.amount` as `payment_amount`, ordered by `order_id` ascending, `payment_id` ascending.

## Follow-up questions

- Under what conditions will an order appear with payment_id = NULL in this query?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t2-08
npm run practice:watch -- sql/sql-t2-08
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
