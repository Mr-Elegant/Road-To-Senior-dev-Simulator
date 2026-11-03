# Frontend: Sliding Window Maximum

Collection: catalog · ID: `frontend-sliding-window-maximum` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Sliding Window Maximum. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({values,k}). Return maximum values for each window of positive integer size k <= values.length, using a monotonic index deque. Invalid k throws Invalid window.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Return maximum positions with a documented oldest-versus-newest tie policy for equal values.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-sliding-window-maximum
npm run practice:watch -- catalog/frontend-sliding-window-maximum
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
