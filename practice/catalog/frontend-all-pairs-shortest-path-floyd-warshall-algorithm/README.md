# Frontend: All Pairs Shortest Path (Floyd-Warshall Algorithm)

Collection: catalog · ID: `frontend-all-pairs-shortest-path-floyd-warshall-algorithm` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind All Pairs Shortest Path (Floyd-Warshall Algorithm). This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({count,edges}) for directed weighted edges [from,to,weight]. Return all-pairs distance matrix, null for unreachable. Diagonals start at zero; keep smallest parallel edge. Any negative cycle throws Negative cycle.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Maintain a next-hop matrix for path reconstruction and mark pairs whose result is unbounded by a reachable negative cycle.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-all-pairs-shortest-path-floyd-warshall-algorithm
npm run practice:watch -- catalog/frontend-all-pairs-shortest-path-floyd-warshall-algorithm
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
