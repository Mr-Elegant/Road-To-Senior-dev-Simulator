# Frontend: Undo Redo

Collection: catalog · ID: `frontend-undo-redo` · Mode: **react**

## Business context

Build and verify the core behavior behind Undo Redo. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Controlled Text input starts empty. Each edit commits a new history state. Undo and Redo navigate history with disabled boundary buttons. Editing after undo discards future history. Output [data-testid=current] mirrors current text.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Group a drag or typing burst into one undoable transaction rather than hundreds of snapshots.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-undo-redo
npm run practice:watch -- catalog/frontend-undo-redo
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
