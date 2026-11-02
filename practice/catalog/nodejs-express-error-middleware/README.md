# Express Asynchronous Error Swallowing & Hanging Socket Leak

Collection: catalog · ID: `nodejs-express-error-middleware` · Mode: **guided**

## Business context

In an Express.js REST API handling merchant inventory updates, when an unexpected database constraint error occurs inside an async route handler, the client request hangs indefinitely until hitting a 60-second gateway timeout. Over time, open socket handles accumulate, exhausting file descriptors.

## Task

Express 4 does not automatically catch rejected promises returned from `async (req, res, next)` route handlers. When an unhandled error throws inside an async function without an explicit `next(err)` or wrapper, Express never sends an HTTP response, leaving the client socket hanging open.

## Candidate tasks

- Explain why Express 4 fails to catch rejected promises in async middleware.
- Implement an `asyncHandler` higher-order function that wraps async routes with `.catch(next)`.
- Discuss how Express 5 natively handles rejected promises.

## Constraints

- Must guarantee every rejected promise in route handlers is caught and passed to global error middleware.
- Must return consistent RFC 7807 Problem Details JSON format `{ status: 500, title, detail }`.
- Prevent socket handle and file descriptor exhaustion.

## Follow-up questions

- Why must Express error-handling middleware have exactly 4 arguments `(err, req, res, next)`?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
