# Frontend: Design Autocomplete

Collection: catalog · ID: `frontend-design-autocomplete` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Design Autocomplete. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({entries,prefix,limit}). Entries have unique lowercase ASCII word and numeric score. Build a prefix index, query case-insensitively, rank matches by descending score then ascending word, return at most nonnegative limit words. Empty prefix matches all. This bounded prefix/ranking core excludes remote personalization.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Compare trie top-k caches with a search index when ranking depends on user context and rapidly changing popularity.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-design-autocomplete
npm run practice:watch -- catalog/frontend-design-autocomplete
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
