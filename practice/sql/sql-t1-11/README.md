# Basic INNER JOIN Across Two Relational Tables

Collection: sql · ID: `sql-t1-11` · Mode: **sql**

## Business context

The shipping department needs to print packing manifests with customer names and order details.

## Task

Write a query joining `orders` and `customers` to return `orders.id` as `order_id`, `customers.name` as `customer_name`, `orders.order_date`, and `orders.total_amount`, sorted by `orders.id` ascending.

## Follow-up questions

- What happens in an INNER JOIN if an order has a customer_id that does not exist in the customers table?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t1-11
npm run practice:watch -- sql/sql-t1-11
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
