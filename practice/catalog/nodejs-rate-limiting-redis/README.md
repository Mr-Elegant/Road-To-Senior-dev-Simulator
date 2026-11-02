# Distributed Sliding Window Rate Limiter with Redis Race Conditions

Collection: catalog · ID: `nodejs-rate-limiting-redis` · Mode: **guided**

## Business context

A public developer API allows 100 requests per minute per API key. Under distributed load test across 8 API server instances, clients are able to send 250 requests per minute because of a Read-Modify-Write race condition in the Redis rate limiting logic.

## Task

The current implementation fetches the count from Redis with `GET`, checks if `count < 100` in Node.js, and then issues `INCR`. Concurrently arriving requests all read `count = 99` before any of them increments, permitting burst overages. Implement an atomic sliding-window rate limiter using Redis Lua scripting or atomic multi-exec pipelines.

## Candidate tasks

- Explain the Read-Modify-Write race condition across distributed API servers.
- Implement an atomic rate limiter using Redis Lua script or sorted sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`).
- Explain the difference between Fixed Window Counter, Sliding Log (Sorted Set), and Sliding Window Counter.

## Constraints

- Must guarantee strict enforcement of 100 req/60s across distributed cluster.
- Must be fully atomic: zero window race conditions.
- Return remaining tokens and reset timestamp in standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

## Follow-up questions

- What is the memory trade-off of the Sorted Set Sliding Window algorithm vs the Sliding Window Counter algorithm?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
