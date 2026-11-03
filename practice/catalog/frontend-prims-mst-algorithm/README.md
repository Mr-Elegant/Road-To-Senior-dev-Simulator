# Frontend: Prim's MST Algorithm

Collection: catalog · ID: `frontend-prims-mst-algorithm` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Prim's MST Algorithm. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({count,edges}) for a weighted undirected connected graph, vertices 0..count-1 and edges [a,b,weight]. Return total MST weight using dense Prim selection; count=0 returns 0. Disconnected graphs throw Disconnected. Negative and parallel edges are supported.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Return a minimum spanning forest for disconnected input and explain why directed graphs need a different problem formulation.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-prims-mst-algorithm
npm run practice:watch -- catalog/frontend-prims-mst-algorithm
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
