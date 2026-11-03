# Frontend: Voting Eligibility

Collection: catalog · ID: `frontend-voting-eligibility` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Voting Eligibility. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({age,minimum}). Return age >= minimum for nonnegative integer age and minimum. Reject invalid values with Invalid age. This is a configurable threshold model, not a jurisdiction-specific legal rule.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Accept a birth date and calculate completed calendar years before applying the supplied threshold.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-voting-eligibility
npm run practice:watch -- catalog/frontend-voting-eligibility
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
