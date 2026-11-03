# Frontend: Event Management

Collection: catalog · ID: `frontend-event-management` · Mode: **react**

## Business context

Build and verify the core behavior behind Event Management. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Inputs Title, Start, End name=title/start/end add daily events using integer hours 0..24 with start<end. Add[data-action=add] rejects invalid fields with Invalid event, or overlap with Overlap. Intervals are half-open; adjacent events allowed. Render li[data-event=ID], Delete[data-delete=ID], sequential IDs. This bounded daily interval model omits timezones/recurrence.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add recurrence with a timezone-aware rule model and define how exceptions and rescheduling are represented.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-event-management
npm run practice:watch -- catalog/frontend-event-management
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
