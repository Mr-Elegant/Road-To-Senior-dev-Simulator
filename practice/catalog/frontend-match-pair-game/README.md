# Frontend: Match Pair Game

Collection: catalog · ID: `frontend-match-pair-game` · Mode: **react**

## Business context

Build and verify the core behavior behind Match Pair Game. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Four cards[data-card=0..3] have pairs A,B,A,B. Hidden text ?, reveal on click. Ignore already revealed/matched cards. Match locks both, incrementing [data-testid=matched] by two. A mismatch locks further flips until Resolve[data-action=resolve] hides the pair. This button injects timeout completion deterministically. Restart resets all.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add a reduced-motion mode and an accessible announcement strategy that preserves the puzzle’s rules.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-match-pair-game
npm run practice:watch -- catalog/frontend-match-pair-game
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
