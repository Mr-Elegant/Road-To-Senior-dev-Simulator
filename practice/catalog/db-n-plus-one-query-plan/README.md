# E-Commerce Order History Endpoint N+1 Query & Composite Index Optimization

Collection: catalog · ID: `db-n-plus-one-query-plan` · Mode: **guided**

## Business context

An e-commerce order history dashboard page (`/api/account/orders`) takes 14 seconds to load for loyal customers with 150 orders. Database CPU utilization reaches 98% during peak browsing hours.

## Task

The ORM repository performs 1 query to fetch the user's orders, and then inside a loop executes separate SQL queries to fetch line items, shipping addresses, and tracking status for each individual order (N+1 query problem). Additionally, `EXPLAIN ANALYZE` shows a Sequential Scan on the 20-million row `orders` table because queries filter by `user_id` and sort by `created_at DESC` without a composite index.

## Candidate tasks

- Explain the N+1 query problem and how it impacts database connection pool latency.
- Refactor queries into either a single JOIN query with JSON aggregation (`json_agg`) or a 2-query batch fetch using `WHERE order_id = ANY($1)`.
- Provide the exact PostgreSQL DDL for the composite index: `CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC)`.

## Constraints

- Eliminate N+1 queries using `JOIN`, `DataLoader`, or batch `IN (...)` fetching.
- Design composite index to enable Index Only Scan or fast B-Tree index scan.
- Endpoint response time must drop under 80ms.

## Follow-up questions

- What is the "Equality, Sort, Range" (ESR) rule when designing composite indexes?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
