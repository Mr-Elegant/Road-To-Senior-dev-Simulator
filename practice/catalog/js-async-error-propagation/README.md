# Background Reconciliation Pipeline Unhandled Rejection Crash

Collection: catalog · ID: `js-async-error-propagation` · Mode: **guided**

## Business context

A monthly B2B billing service processes 10,000 subscription invoices in the background. In production, an unexpected currency conversion API timeout crashes the entire Node process with unhandledRejection, causing half the billing run to be skipped without notifications.

## Task

The pipeline mixes raw Promise arrays with Promise.all() and forEach loops. When one invoice fails, unhandled rejections terminate the worker. Refactor the pipeline to process invoices using Promise.allSettled(), collect individual failures for retry queues, and ensure no unhandled promise rejections can crash the process.

## Candidate tasks

- Explain why `Array.prototype.forEach` with an async callback fails to await promises.
- Replace the approach with `Promise.allSettled()` or chunked concurrency.
- Return a resilient structure `{ succeeded: number, failed: Array<{ id, reason }> }`.

## Constraints

- A single failing invoice must not abort other invoices in the batch.
- All failures must be categorized and logged with invoice ID and failure reason.
- Must return an aggregate summary: { succeeded: number, failed: Array<{ id, error }> }.

## Follow-up questions

- What is the default Node.js behavior when an unhandledRejection occurs in modern Node (v16+)?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
