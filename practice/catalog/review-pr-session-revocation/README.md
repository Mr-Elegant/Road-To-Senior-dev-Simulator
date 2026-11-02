# Code Review PR #589: Distributed Redis Session Invalidation

Collection: catalog · ID: `review-pr-session-revocation` · Mode: **guided**

## Business context

PR #589 replaces in-memory JWT blacklisting with a shared Redis cluster session store to allow immediate user logout and password-reset session revocation. However, subtle race conditions and missing key TTLs expose the cluster to memory exhaustion and security bypasses.

## Task

Review PR #589. Detect vulnerabilities including missing TTL expiration (causing unbounded Redis RAM growth), token reuse race conditions, and improper pattern scanning with `KEYS *` (which blocks the single-threaded Redis engine in production).

## Candidate tasks

- Flag Line 8: Missing TTL on `redis.set`. Require `EX` parameter matching token expiration to prevent Redis OOM.
- Flag Line 16: `redis.keys()` blocks the Redis single thread. Replace with Redis Set indexing (`SADD user:sessions:{userId} token`) or `SCAN`.
- Explain how indexing user sessions in a Set makes revocation O(1) instead of an expensive pattern search.

## Constraints

- Identify performance impact of `KEYS session:*` on production Redis clusters.
- Identify race condition where revoked tokens can be re-issued.
- Verify session key TTL alignment with JWT expiry timestamp.

## Follow-up questions

- How does the "Token Version / Epoch" pattern invalidate all active user sessions with a single O(1) integer update?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
