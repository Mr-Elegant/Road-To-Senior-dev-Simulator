# Frontend: Frequently Asked Questions

Collection: catalog · ID: `frontend-frequently-asked-questions` · Mode: **react**

## Business context

Build and verify the core behavior behind Frequently Asked Questions. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[]}). Controlled Search input filters title or body case-insensitively. Each visible item {id,title,body} has a button toggling its answer region #answer-ID. Multiple may stay expanded; filtering must retain expansion IDs. Empty results show No matching answers.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Group results by category while avoiding duplicate IDs in accessibility relationships.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-frequently-asked-questions
npm run practice:watch -- catalog/frontend-frequently-asked-questions
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
