# Frontend: Guess the number

Collection: catalog · ID: `frontend-guess-the-number` · Mode: **react**

## Business context

Build and verify the core behavior behind Guess the number. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({secret=42}). Controlled Guess input accepts integers 1..100. Guess button reports Too low, Too high, Correct, or Invalid guess in [data-testid="feedback"]. A correct round ignores later guesses until Restart, which clears input/feedback. Secret is injected for deterministic tests.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add a reproducible seed and a history view without leaking the secret into normal UI state displays.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-guess-the-number
npm run practice:watch -- catalog/frontend-guess-the-number
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
