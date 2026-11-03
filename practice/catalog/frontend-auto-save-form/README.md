# Frontend: Auto Save Form

Collection: catalog · ID: `frontend-auto-save-form` · Mode: **react**

## Business context

Build and verify the core behavior behind Auto Save Form. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Title and Body controlled inputs name=title/body update an in-memory draft. Acknowledge after 40 ms idle; show Ready initially, Unsaved on edits, Saved after acknowledgement in [data-testid=status]. [data-testid=saved] is latest acknowledged JSON {title,body}. Cancel superseded timers. No durable or cloud persistence is claimed.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Use optimistic concurrency with a document version and an explicit user merge workflow.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-auto-save-form
npm run practice:watch -- catalog/frontend-auto-save-form
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
