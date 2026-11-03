# Frontend: Emoji Replacer

Collection: catalog · ID: `frontend-emoji-replacer` · Mode: **react**

## Business context

Build and verify the core behavior behind Emoji Replacer. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. A controlled Message textarea derives [data-testid="preview"], replacing exact :smile:, :heart:, and :fire: tokens with 😀, ❤️, 🔥. Preserve unmatched text and render it as text, never HTML.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Implement an editable rich-text version and explain caret mapping across replacements.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-emoji-replacer
npm run practice:watch -- catalog/frontend-emoji-replacer
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
