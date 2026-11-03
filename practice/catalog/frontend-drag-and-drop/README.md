# Frontend: Drag and Drop

Collection: catalog · ID: `frontend-drag-and-drop` · Mode: **react**

## Business context

Build and verify the core behavior behind Drag and Drop. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[A,B,C]}). Render ordered li[data-id=LABEL], draggable with drag/drop reordering, and Move down buttons[data-down=LABEL]. Dropping one row on another inserts at the target original index. Move down swaps with the next row and clamps at the end. Output comma-joined order in [data-testid=order]. Labels are unique. Preserve immutable identity.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Announce drag start, destination, and completion through a restrained live region.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-drag-and-drop
npm run practice:watch -- catalog/frontend-drag-and-drop
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
