# Multi-Table Join: Order Items with Products and Customers

Collection: sql · ID: `sql-t1-13` · Mode: **sql**

## Business context

Customer support needs a consolidated view of line items purchased by customer "Aarav Patel".

## Task

Write a query joining `orders`, `customers`, `order_items`, and `products` to list all products bought by `Aarav Patel`. Return `order_id`, `product_name` (as `name`), `quantity`, and `unit_price`, sorted by `order_id` ascending.

## Follow-up questions

- What is a Cartesian Product (Cross Join) and how does it happen accidentally in multi-table queries?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t1-13
npm run practice:watch -- sql/sql-t1-13
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
