# Frontend: Multiselect dropdown

Collection: catalog · ID: `frontend-multiselect-dropdown` · Mode: **react**

## Business context

Build and verify the core behavior behind Multiselect dropdown. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({options=[Apple,Banana,Cherry]}). Controlled Search options combobox filters case-insensitively and opens a listbox #choices. Buttons role=option display matches; empty matches show No options. Click toggles selection, retains hidden choices and keeps popup open. Display selected labels comma-joined in insertion order. Output is [data-testid=selected]. Escape closes without clearing selection; ArrowDown advances highlight and Enter selects it.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support remote option loading without discarding selected IDs that are absent from a particular response.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-multiselect-dropdown
npm run practice:watch -- catalog/frontend-multiselect-dropdown
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
