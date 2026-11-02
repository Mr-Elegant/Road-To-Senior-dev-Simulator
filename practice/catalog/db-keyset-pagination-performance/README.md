# CRM Million-Row Activity Log OFFSET Pagination Degradation

Collection: catalog · ID: `db-keyset-pagination-performance` · Mode: **guided**

## Business context

An enterprise CRM displays a historical audit trail containing 45,000,000 customer interaction events. When auditors navigate to page 5,000 (`OFFSET 100000 LIMIT 20`), the query takes 18 seconds, frequently hitting query timeouts and pegging DB IOPS at 100%.

## Task

The API uses traditional `OFFSET / LIMIT` pagination. For `OFFSET 100000`, PostgreSQL must scan the index, fetch 100,020 rows from disk, count past the first 100,000 rows, discard them all, and return only the final 20 rows. Migrate the query to Keyset (Cursor-Based) Pagination using `(created_at, id) < ($cursor_created_at, $cursor_id)`.

## Candidate tasks

- Explain the algorithmic complexity of `OFFSET N LIMIT M` (O(N + M)) vs Keyset pagination (O(log N + M)).
- Refactor the SQL query to use cursor keyset: `WHERE tenant_id = $1 AND (created_at, id) < ($cursorTime, $cursorId) ORDER BY created_at DESC, id DESC LIMIT $pageSize`.
- Construct a composite index supporting this query: `(tenant_id, created_at DESC, id DESC)`.

## Constraints

- Query execution time on deep pages (e.g. 500,000th item) must execute under 5ms.
- Must handle ties in `created_at` timestamps gracefully by including primary key `id` as tie-breaker.
- Eliminate full table / index scanning of discarded offset rows.

## Follow-up questions

- When is OFFSET pagination still acceptable or preferred over Keyset pagination?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
