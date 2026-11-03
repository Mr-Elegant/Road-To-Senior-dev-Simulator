# Frontend: File Explorer

Collection: catalog · ID: `frontend-file-explorer` · Mode: **react**

## Business context

Build and verify the core behavior behind File Explorer. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({nodes=[{id:root,title:Root,children:[{id:a,title:A}]}]}). Render a nested disclosure list. Node li[data-node=ID] contains button[data-open=ID] for folders (children array) or [data-select=ID] for files. Folders start collapsed; clicks select and toggle them. [data-testid=selected] displays selected ID or None. Use stable IDs and aria-expanded on folder buttons. New file input and Add file[data-action=add] append to first root folder with sequential IDs new1,new2. Trim names, reject blanks with Name required and duplicate sibling titles with Name exists. Delete[data-delete=ID] removes a subtree and clears selection.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add optimistic server operations with version conflicts and reversible mutations.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-file-explorer
npm run practice:watch -- catalog/frontend-file-explorer
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
