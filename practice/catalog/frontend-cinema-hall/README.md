# Frontend: Cinema Hall

Collection: catalog · ID: `frontend-cinema-hall` · Mode: **react**

## Business context

Build and verify the core behavior behind Cinema Hall. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({reserved=[A2]}). Seats A1..A4 are buttons[data-seat=ID]; reserved seats are disabled. Other clicks toggle aria-pressed selection. Output [data-testid=total] is integer cents at 1000 per selected seat. Local selection does not reserve real inventory.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Design timed reservation holds with server authority and explain the race between two clients selecting the same seat.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-cinema-hall
npm run practice:watch -- catalog/frontend-cinema-hall
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
