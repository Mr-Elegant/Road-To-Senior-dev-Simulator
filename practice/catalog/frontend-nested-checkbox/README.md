# Frontend: Nested Checkbox

Collection: catalog · ID: `frontend-nested-checkbox` · Mode: **react**

## Business context

Build and verify the core behavior behind Nested Checkbox. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({tree={id:root,label:All,children:[{id:a,label:A},{id:b,label:B}]}}). Render a checkbox[data-node=ID] for every tree node. Leaves own selection. A parent toggles all descendant leaves; derive checked/mixed/unchecked in data-state and set actual indeterminate property for mixed state. Empty branches are treated as leaves. [data-testid=selected] is sorted selected leaf IDs comma-joined.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support lazy-loaded children without incorrectly declaring an incompletely known subtree fully selected.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-nested-checkbox
npm run practice:watch -- catalog/frontend-nested-checkbox
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
