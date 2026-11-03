# Frontend: Notification Bell

Collection: catalog · ID: `frontend-notification-bell` · Mode: **react**

## Business context

Build and verify the core behavior behind Notification Bell. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[{id:a,text:Hello,read:false},{id:b,text:Update,read:false}]}). Bell[data-action=bell] toggles panel. Unread count [data-testid=unread] derives from records. Mark read[data-read=ID] is idempotent and disables itself. Opening must not mark messages read.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add server acknowledgements so delayed read updates cannot resurrect old unread states.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-notification-bell
npm run practice:watch -- catalog/frontend-notification-bell
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
