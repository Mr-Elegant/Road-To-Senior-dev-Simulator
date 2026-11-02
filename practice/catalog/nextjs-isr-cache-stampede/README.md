# Product Catalog High-Traffic ISR Cache Stampede / Dog-Piling

Collection: catalog · ID: `nextjs-isr-cache-stampede` · Mode: **guided**

## Business context

A leading apparel retailer uses Incremental Static Regeneration (ISR) with `revalidate: 60`. During a product drop with 200,000 visitors per minute, when the 60-second cache window expires, thousands of concurrent requests miss cache simultaneously and hit the PostgreSQL database, exhausting connection pools and causing a site-wide 504 Gateway Timeout.

## Task

Under high concurrency, when a static page becomes stale, multiple incoming requests trigger parallel background revalidations because there is no single-flight deduplication / distributed lock. Diagnose the cache stampede (dog-piling) and implement a distributed stale-while-revalidate lock / mutex pattern.

## Candidate tasks

- Explain the Cache Stampede (Dog-Piling / Thundering Herd) problem in Next.js ISR.
- Implement single-flight promise memoization or Redis distributed lock with `SET NX PX`.
- Explain the role of Next.js 15 `unstable_cache` / Cache Handler in multi-instance cluster deployments.

## Constraints

- Must maintain high-throughput static caching (sub-20ms P99 for cached reads).
- At most 1 revalidation query should hit the database per cache expiry cycle.
- Stale content must be served to subsequent shoppers while revalidation is in flight.

## Follow-up questions

- What is the XFetch probabilistic early expiration algorithm and how does it prevent stampedes?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
