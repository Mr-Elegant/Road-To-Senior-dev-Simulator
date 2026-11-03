# Frontend: Resizable Split Pane

Collection: catalog · ID: `frontend-resizable-split-pane` · Mode: **react**

## Business context

Build and verify the core behavior behind Resizable Split Pane. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A range input labelled Left pane width stores integer percent 20..80, default 50. It controls [data-testid="left"] and right pane widths and [data-testid="ratio"] text N/100-N. Clamp all supplied changes. This native range is the pointer/keyboard resize handle.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Persist the ratio rather than raw pixels and restore it safely on a narrower device.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-resizable-split-pane
npm run practice:watch -- catalog/frontend-resizable-split-pane
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
