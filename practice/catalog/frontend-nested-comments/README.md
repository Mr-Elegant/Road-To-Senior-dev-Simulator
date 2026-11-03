# Frontend: Nested Comments

Collection: catalog · ID: `frontend-nested-comments` · Mode: **react**

## Business context

Build and verify the core behavior behind Nested Comments. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Start with comment {id:1,text:Root,parent:null}. Text input + Add[data-action=add] adds trimmed nonblank comment as root or under the last Reply[data-reply=ID] selection. Sequential IDs start 2. Render li[data-comment=ID] nested by parent, text span[data-text=ID]. Delete[data-delete=ID] tombstones text to [deleted], retains descendants, and disables Reply on that node. Blank adds nothing.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-nested-comments
npm run practice:watch -- catalog/frontend-nested-comments
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
