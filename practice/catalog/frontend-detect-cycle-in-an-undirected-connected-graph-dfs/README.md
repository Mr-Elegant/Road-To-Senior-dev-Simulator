# Frontend: Detect Cycle in an Undirected Connected Graph (DFS)

Collection: catalog · ID: `frontend-detect-cycle-in-an-undirected-connected-graph-dfs` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Detect Cycle in an Undirected Connected Graph (DFS). This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({count,edges}). Return whether an undirected graph has a cycle; include disconnected components, self-loops, and parallel edges. Track incoming edge identity rather than only parent vertex.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Produce the actual cycle path and explain how edge identity changes multigraph detection.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-detect-cycle-in-an-undirected-connected-graph-dfs
npm run practice:watch -- catalog/frontend-detect-cycle-in-an-undirected-connected-graph-dfs
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
