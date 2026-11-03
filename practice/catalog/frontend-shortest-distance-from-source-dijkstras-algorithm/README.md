# Frontend: Shortest Distance from Source (Dijkstra's Algorithm)

Collection: catalog · ID: `frontend-shortest-distance-from-source-dijkstras-algorithm` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Shortest Distance from Source (Dijkstra's Algorithm). This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({count,edges,source}) for directed nonnegative weights. Return distances, null for unreachable. Use dense Dijkstra minimum-unvisited selection. Any negative edge throws Negative edge.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add path reconstruction and compare with Bellman–Ford when negative weights are permitted.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-shortest-distance-from-source-dijkstras-algorithm
npm run practice:watch -- catalog/frontend-shortest-distance-from-source-dijkstras-algorithm
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
