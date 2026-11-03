# Frontend: StickyNotes Component

Collection: catalog · ID: `frontend-stickynotes-component` · Mode: **react**

## Business context

Build and verify the core behavior behind StickyNotes Component. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Add note[data-action=add] creates a note at x=20 with sequential data-note ID and controlled textarea. Move right[data-move=ID] nudges x by 10, clamped at 200; data-x reflects position. Delete[data-delete=ID] removes that note. Preserve text during movement. This exercise tests note editing/position state, not pointer physics or persistence.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add shared-board synchronization with explicit conflict resolution for concurrent text and position edits.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-stickynotes-component
npm run practice:watch -- catalog/frontend-stickynotes-component
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
