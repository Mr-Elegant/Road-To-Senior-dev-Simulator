# Frontend: Deep Clone Object

Collection: catalog · ID: `frontend-deep-clone-object` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Deep Clone Object. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({value,cycle?}). Deep-clone a JSON object/array graph. If cycle is true, a root self-reference and shared aliases are added before cloning. Return {equal,distinct,nestedDistinct,cyclePreserved,aliasPreserved}. equal compares the original JSON value, excluding injected links. Do not mutate the supplied value.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Preserve property descriptors and explain why copying getters can trigger side effects if implemented by reading values.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-deep-clone-object
npm run practice:watch -- catalog/frontend-deep-clone-object
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
