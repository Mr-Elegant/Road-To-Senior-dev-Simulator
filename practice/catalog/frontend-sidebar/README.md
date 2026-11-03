# Frontend: Sidebar

Collection: catalog · ID: `frontend-sidebar` · Mode: **react**

## Business context

Build and verify the core behavior behind Sidebar. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A Toggle sidebar button toggles a nav aria-label=Workspace. It starts expanded. Links Dashboard and Reports must always keep accessible names; collapsed nav is absent from the DOM. aria-expanded and aria-controls must match. Escape on the toggle collapses it.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Persist only the layout preference and distinguish desktop collapse from mobile open state.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-sidebar
npm run practice:watch -- catalog/frontend-sidebar
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
