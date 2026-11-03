# Frontend: Sortable List

Collection: catalog · ID: `frontend-sortable-list` · Mode: **react**

## Business context

Build and verify the core behavior behind Sortable List. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[A,B,C]}). Render ordered li[data-id=LABEL], draggable with drag/drop reordering, and Move down buttons[data-down=LABEL]. Dropping one row on another inserts at the target original index. Move down swaps with the next row and clamps at the end. Output comma-joined order in [data-testid=order]. Labels are unique. Preserve immutable identity.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Virtualize a large list while keeping keyboard announcements and drag hit targets consistent.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-sortable-list
npm run practice:watch -- catalog/frontend-sortable-list
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
