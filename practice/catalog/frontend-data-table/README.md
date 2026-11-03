# Frontend: Data Table

Collection: catalog · ID: `frontend-data-table` · Mode: **react**

## Business context

Build and verify the core behavior behind Data Table. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({rows=[{id:a,name:Ada,score:2},{id:b,name:Lin,score:1},{id:c,name:Zoe,score:3}]}). Search name case-insensitively, page size two, initial ascending score then ID. Sort[data-action=sort] toggles descending/ascending score; reset page on search/sort. Next/Previous clamp. Checkboxes[data-select=ID] retain selection across pages/filters; output[data-testid=selected] is count. Use semantic table and aria-sort on score header.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support server-side select-all as a query plus exclusions rather than downloading every row ID.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-data-table
npm run practice:watch -- catalog/frontend-data-table
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
