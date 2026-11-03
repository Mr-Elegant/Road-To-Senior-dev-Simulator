# Frontend: Find the Single Element in a Sorted Array

Collection: catalog · ID: `frontend-find-the-single-element-in-a-sorted-array` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Find the Single Element in a Sorted Array. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution(values). A sorted odd-length nonempty array contains one singleton and pairs of every other value. Return the singleton in logarithmic time.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Explain why the parity invariant fails if counts are not exactly two or the array is not sorted.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-find-the-single-element-in-a-sorted-array
npm run practice:watch -- catalog/frontend-find-the-single-element-in-a-sorted-array
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
