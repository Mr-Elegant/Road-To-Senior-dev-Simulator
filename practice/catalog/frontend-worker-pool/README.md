# Frontend: Worker Pool

Collection: catalog · ID: `frontend-worker-pool` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Worker Pool. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({workers,jobs,events}), the dispatcher core of a worker pool. Jobs are unique IDs queued initially; worker IDs are 0..workers-1. Initially assign in queue order to idle workers ascending. done{worker} records its active job; crash{worker} retries that active job at queue front, then replaces the worker. Ignore events for idle workers. Return {assignments,completed,active,queued}; assignments are [worker,job]. This tests the protocol reducer, not actual CPU parallelism.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add backpressure, per-task deadlines, and worker replacement without leaking unsettled promises.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-worker-pool
npm run practice:watch -- catalog/frontend-worker-pool
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
