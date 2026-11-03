# Frontend: Tic Tac Toe

Collection: catalog · ID: `frontend-tic-tac-toe` · Mode: **react**

## Business context

Build and verify the core behavior behind Tic Tac Toe. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Nine buttons[data-cell=0..8] alternate X/O. Occupied cells and terminal games ignore clicks. [data-testid=status] is Next: X/O, Winner: X/O, or Draw. Reset[data-action=reset] clears. Detect all rows, columns and diagonals.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add time-travel history and discard future moves when a player branches from an older board.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-tic-tac-toe
npm run practice:watch -- catalog/frontend-tic-tac-toe
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
