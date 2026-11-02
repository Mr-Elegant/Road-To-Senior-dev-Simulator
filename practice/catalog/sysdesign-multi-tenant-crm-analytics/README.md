# Real-Time Multi-Tenant CRM Analytics & Aggregation Engine

Collection: catalog · ID: `sysdesign-multi-tenant-crm-analytics` · Mode: **guided**

## Business context

A B2B SaaS platform provides live customer pipeline analytics to 10,000 corporate tenants (from small startups with 1,000 events to Fortune 500 enterprises with 50,000,000 events). Running analytical queries (e.g. "Conversion rate by lead source over last 90 days") directly on the operational PostgreSQL OLTP database is freezing transactional tables and causing multi-tenant noisy-neighbor outages.

## Task

Architect a segregated OLAP analytics pipeline that ingests real-time events, isolates tenant data, powers interactive sub-second dashboard queries, and guarantees that a massive enterprise tenant running complex queries does not degrade performance for other tenants.

## Candidate tasks

- Design the Lambda / Kappa architecture data flow from PostgreSQL OLTP -> Kafka -> Stream Processor / Columnar OLAP (ClickHouse) -> Analytics API.
- Design the ClickHouse table schema with sorting key `(tenant_id, event_date, event_type)` for tenant isolation and index pruning.
- Explain how columnar storage compression and vectorized execution achieve 100x speedup over row-oriented databases.
- Implement tenant rate limiting and query concurrency quotas at the Analytics Gateway.

## Constraints

- Sub-second query response time (P95 < 500ms) for arbitrary time-range aggregations.
- Data freshness / lag: events visible in analytics dashboard within 10 seconds of occurrence.
- Tenant noisy-neighbor isolation: strict resource limits per tenant tier.

## Follow-up questions

- Why does ClickHouse require batched inserts instead of single-row inserts?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
