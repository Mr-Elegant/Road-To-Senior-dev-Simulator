# Async Promise Concurrency Pool (Worker Throttler)

Collection: coding · ID: `js-promise-concurrency-pool` · Mode: **javascript**

## Task

Build a Promise concurrency limiter `pLimit(concurrency)`.
It returns a wrapper function `limit(asyncTask)` that guarantees at most `concurrency` asynchronous tasks run in parallel.
Subsequent tasks are queued in FIFO order and executed as prior tasks resolve or reject.

## Constraints

- Strictly enforce maximum parallel executions (never exceed concurrency limit).
- Tasks that reject must propagate the error to the caller without stalling the remaining queue.
- Queue entries must be processed in strict FIFO sequence.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- coding/js-promise-concurrency-pool
npm run practice:watch -- coding/js-promise-concurrency-pool
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
