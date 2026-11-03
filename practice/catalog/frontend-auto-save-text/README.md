# Frontend: Auto Save Text

Collection: catalog · ID: `frontend-auto-save-text` · Mode: **react**

## Business context

Build and verify the core behavior behind Auto Save Text. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A controlled Draft textarea debounces acknowledgement by 40 ms after the latest change. Initial status is Ready. Edits show Unsaved immediately; after idle display Saved and echo acknowledged text in [data-testid="saved"]. Clean up the timer on changes/unmount. This uses an in-memory acknowledgement, not durable/cloud storage.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Retry failed saves and reconcile an external edit without silently overwriting either draft.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-auto-save-text
npm run practice:watch -- catalog/frontend-auto-save-text
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
