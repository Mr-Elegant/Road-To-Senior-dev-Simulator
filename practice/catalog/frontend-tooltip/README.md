# Frontend: Tooltip

Collection: catalog · ID: `frontend-tooltip` · Mode: **react**

## Business context

Build and verify the core behavior behind Tooltip. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A button named Help reveals a role=tooltip with text Extra help on focus or mouse hover. Associate aria-describedby=help-tip only while visible. Escape and blur hide it. Tooltip is supplemental plain text, with no interactive children.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Position the help near viewport edges without clipping or creating an interactive hover trap.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-tooltip
npm run practice:watch -- catalog/frontend-tooltip
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
