# Partial Indexes and Expression Indexes: Advanced Query Optimization

Collection: sql · ID: `sql-tier3-025` · Mode: **sql**

## Business context

In the `orders` table (5 million rows), 97% of orders are in `DELIVERED` status and are rarely queried by operational tools. The customer support dashboard frequently searches for orders with `status IN ('FAILED', 'PENDING')` by customer email in lower case.

## Task

Explain the architecture and storage efficiency of Partial Indexes and Expression Indexes in PostgreSQL. Write the SQL to create a partial expression index that indexes `lower(customer_email)` ONLY for orders where status is `FAILED` or `PENDING`. Write the exact matching query that utilizes this index.

## Follow-up questions

- If a query runs `WHERE lower(customer_email) = 'alice@example.com'` without specifying `status`, will PostgreSQL use this partial index?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier3-025
npm run practice:watch -- sql/sql-tier3-025
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
