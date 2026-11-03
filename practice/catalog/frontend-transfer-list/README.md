# Frontend: Transfer List

Collection: catalog · ID: `frontend-transfer-list` · Mode: **react**

## Business context

Build and verify the core behavior behind Transfer List. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({initialLeft=[A,B,C],initialRight=[]}). Render lists [data-testid=left/right] with checkboxes[data-check=LABEL]. Buttons Move right/Move left transfer checked eligible rows in original list order, clear selection, and retain all unselected rows. Outputs [data-testid=left-order/right-order] are comma-joined. Labels are globally unique.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add per-list search while defining whether Select all affects visible or all eligible records.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-transfer-list
npm run practice:watch -- catalog/frontend-transfer-list
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
