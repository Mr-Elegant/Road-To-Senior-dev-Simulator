# Frontend: Grid Lights II

Collection: catalog · ID: `frontend-grid-lights-ii` · Mode: **react**

## Business context

Build and verify the core behavior behind Grid Lights II. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Four buttons[data-cell=0..3] form a light grid. Pressed state matches active membership; output[data-testid=count] is active count. Activations add only inactive cells; activating the fourth enters replay and disables all cells. Step[data-action=step] removes the most recently activated remaining cell; after all are removed return to ready. Output[data-testid=phase] is ready/replay. This is the deterministic replay clock core.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support pause/resume and reverse replay using a single reducer-defined state machine.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-grid-lights-ii
npm run practice:watch -- catalog/frontend-grid-lights-ii
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
