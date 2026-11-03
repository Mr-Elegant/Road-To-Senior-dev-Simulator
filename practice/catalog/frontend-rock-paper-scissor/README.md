# Frontend: Rock Paper Scissor

Collection: catalog · ID: `frontend-rock-paper-scissor` · Mode: **react**

## Business context

Build and verify the core behavior behind Rock Paper Scissor. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({opponent="rock"}). Rock, Paper, Scissors buttons[data-choice] resolve a round against the injected opponent. Output [data-testid=result] win/draw/loss and [data-testid=wins] counts wins. Reset clears both. Standard cyclic rules apply.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add best-of-N rounds with a terminal match state and an unambiguous restart action.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-rock-paper-scissor
npm run practice:watch -- catalog/frontend-rock-paper-scissor
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
