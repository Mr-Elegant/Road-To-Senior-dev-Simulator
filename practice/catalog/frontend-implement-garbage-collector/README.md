# Frontend: Implement Garbage Collector

Collection: catalog · ID: `frontend-implement-garbage-collector` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Implement Garbage Collector. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({objects,roots}). Objects are {id,refs}; IDs are unique strings. Mark reachable objects from roots and return sorted {survivors,collected}. Unknown roots throw Unknown root; references to unallocated IDs throw Dangling reference. Unreachable cycles must be collected. This is a heap graph simulation.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add an incremental marking model and state the write-barrier invariant needed when the graph changes during marking.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-implement-garbage-collector
npm run practice:watch -- catalog/frontend-implement-garbage-collector
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
