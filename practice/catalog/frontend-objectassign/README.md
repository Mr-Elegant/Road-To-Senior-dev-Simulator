# Frontend: Object.assign()

Collection: catalog · ID: `frontend-objectassign` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Object.assign(). This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({target,sources}) for JSON records. Return a shallow own-enumerable key merge with later sources overwriting earlier ones. Skip null sources. Treat __proto__ as an ordinary data key; do not invoke prototype setters.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Compare assignment semantics with descriptor copying and immutable object spread without claiming they are identical.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-objectassign
npm run practice:watch -- catalog/frontend-objectassign
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
