# Frontend: Array.prototype.reduce

Collection: catalog · ID: `frontend-arrayprototypereduce` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Array.prototype.reduce. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({values,operation,initial?}). Reduce values by add or multiply. Without initial, use the first item; empty without initial throws Empty reduction. initial is present only when Object.hasOwn says so.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Compare a focused array-only implementation with the complete specification requirements for generic receivers.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-arrayprototypereduce
npm run practice:watch -- catalog/frontend-arrayprototypereduce
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
