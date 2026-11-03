# Frontend: Todo List

Collection: catalog · ID: `frontend-todo-list` · Mode: **react**

## Business context

Build and verify the core behavior behind Todo List. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A New task input name=draft and Add button data-action=add create trimmed nonblank tasks with sequential string IDs starting 1. Render li data-id and data-done, title span[data-title], Complete[data-toggle=ID], Delete[data-delete=ID]. Complete toggles done, Delete removes, output[data-testid=total] counts all tasks. Keep state immutable and IDs stable.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add filtered views while retaining selection and edit state by task ID.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-todo-list
npm run practice:watch -- catalog/frontend-todo-list
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
