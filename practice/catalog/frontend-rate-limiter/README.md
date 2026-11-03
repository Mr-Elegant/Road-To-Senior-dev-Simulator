# Frontend: Rate Limiter

Collection: catalog · ID: `frontend-rate-limiter` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Rate Limiter. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({capacity,refillPerSecond,events}). Start full at time 0. Each event {time,cost} uses nondecreasing milliseconds and nonnegative cost. Refill continuously, cap at capacity, consume only when affordable; return accepted booleans. This is one deterministic token bucket, not shared-server coordination.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Design an atomic shared-store update for multiple servers and state how fail-open versus fail-closed affects the product.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-rate-limiter
npm run practice:watch -- catalog/frontend-rate-limiter
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
