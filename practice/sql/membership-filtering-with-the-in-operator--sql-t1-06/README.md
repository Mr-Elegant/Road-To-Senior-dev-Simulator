# Membership Filtering with the IN Operator

Collection: sql · ID: `sql-t1-06` · Mode: **sql**

## Business context

Warehouse logistics needs to see orders that require immediate physical shipping or delivery attention.

## Task

Write a query to retrieve all orders with status in `('PAID', 'SHIPPED')`, displaying `id`, `status`, and `total_amount`, sorted by `id` ascending.

## Follow-up questions

- What is the danger of using NOT IN with a subquery containing NULL values?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/membership-filtering-with-the-in-operator--sql-t1-06
npm run practice:watch -- sql/membership-filtering-with-the-in-operator--sql-t1-06
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
