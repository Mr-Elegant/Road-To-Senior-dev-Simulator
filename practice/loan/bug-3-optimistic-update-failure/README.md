# Roll back the correct optimistic approval

Collection: loan · ID: `bug-3-optimistic-update-failure` · Mode: **loan**

## Business context

An officer approves a loan. The UI turns green immediately. The backend rejects the request due to an expired session or credit policy rule, but the UI remains "APPROVED", deceiving the officer.

## Task

Implement reduceApproval(state, action). State is {items:[{id,status}],pending:{[id]:{requestId,before}}}. start on an existing unlocked id backs up its status and applies action.status. Ignore another start while that id is locked. failure restores the backup; success applies action.status if provided, otherwise keeps the optimistic status. Settle only matching id/requestId and remove that pending entry. Keep other loans and pending operations intact. Ignore missing IDs and unknown events. Inputs are frozen.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-3-optimistic-update-failure
npm run practice:watch -- loan/bug-3-optimistic-update-failure
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
