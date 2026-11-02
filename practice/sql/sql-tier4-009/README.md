# Atomic Distributed Rate Limiting & Token Bucket in Pure PostgreSQL

Collection: sql · ID: `sql-tier4-009` · Mode: **sql**

## Business context

To prevent external API abuse without introducing Redis infrastructure, your architect wants to implement a high-throughput Token Bucket rate limiter directly in PostgreSQL. Each tenant has a bucket with a max burst limit and a continuous refill rate.

## Task

Design a concurrency-safe Token Bucket rate limiter in PostgreSQL using an atomic `INSERT ... ON CONFLICT DO UPDATE` statement. Given a request requiring 1 token, compute elapsed time refills dynamically, deduct the token if available, and return a boolean indicating whether the request was allowed.

## Follow-up questions

- Why should you use `clock_timestamp()` instead of `CURRENT_TIMESTAMP` or `NOW()` in rate-limiting calculations?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier4-009
npm run practice:watch -- sql/sql-tier4-009
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
