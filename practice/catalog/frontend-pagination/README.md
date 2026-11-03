# Frontend: Pagination

Collection: catalog · ID: `frontend-pagination` · Mode: **react**

## Business context

Build and verify the core behavior behind Pagination. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[Alpha,Beta,Gamma,Delta,Epsilon],pageSize=2}). Search input filters case-insensitive substrings and resets to first page. Sort button toggles ascending/descending ASCII order and resets page. Next/Previous clamp. Render li names and [data-testid=page] current/total, 0/0 when empty. Apply filter, sort, then slice.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Compare offset and keyset pagination under concurrent inserts using a stable unique tie-breaker.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-pagination
npm run practice:watch -- catalog/frontend-pagination
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
