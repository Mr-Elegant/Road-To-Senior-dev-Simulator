# Frontend: Implement Promise Race

Collection: catalog · ID: `frontend-implement-promise-race` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Implement Promise Race. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement async solution(entries). Each entry has {value,delay,reject?}; start all lazy timer tasks and return {status:fulfilled|rejected,value} for the first settlement. Delays are distinct nonnegative integers. Empty entries return {status:pending} as an observable model of an unsettled race.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Contrast race with any and explain why winning a race does not cancel losing operations.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-implement-promise-race
npm run practice:watch -- catalog/frontend-implement-promise-race
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
