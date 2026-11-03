# Frontend: Tab Switcher

Collection: catalog · ID: `frontend-tab-switcher` · Mode: **react**

## Business context

Build and verify the core behavior behind Tab Switcher. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[{id:"one",title:"One",body:"First"},{id:"two",title:"Two",body:"Second"}]}). Render one native button per item with aria-pressed matching selection, and selected body in [data-testid="panel"]. Initially first selected; empty items show No sections. IDs are stable.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Let URL state select a section and define how browser back/forward changes the active key.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-tab-switcher
npm run practice:watch -- catalog/frontend-tab-switcher
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
