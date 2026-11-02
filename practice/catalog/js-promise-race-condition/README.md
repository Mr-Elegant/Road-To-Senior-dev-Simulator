# Multi-Tab Wallet Checkout Balance Debit Race Condition

Collection: catalog · ID: `js-promise-race-condition` · Mode: **guided**

## Business context

A digital wallet and subscription checkout interface allows users to redeem promo gift balances. When a user opens multiple browser tabs or clicks "Pay with Balance" concurrently, two requests race against each other, allowing the user to spend a $50 balance twice.

## Task

Design a client-side and API concurrency guard. On the client side, implement an asynchronous mutex / queue runner that prevents parallel in-flight checkout mutations for the same wallet ID, serializes requests, and handles cancellation / idempotency headers.

## Candidate tasks

- Implement `runExclusive(key, task)` using Promise chaining or a queue of resolvers.
- Ensure if `task()` throws an exception, the next queued task still executes and the error is propagated to the caller.
- Delete the lock from `this.locks` when the queue for that key becomes empty.

## Constraints

- Must guarantee only 1 mutation per key runs at any time.
- Pending invocations should queue or reject cleanly with ConcurrentOperationError.
- Must clean up queue state when promises resolve or reject to avoid memory leaks.

## Follow-up questions

- Why is client-side mutex locking insufficient on its own for preventing double spending in payments?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
