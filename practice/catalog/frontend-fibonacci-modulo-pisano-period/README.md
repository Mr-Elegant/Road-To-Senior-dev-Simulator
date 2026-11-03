# Frontend: Fibonacci Modulo (Pisano Period)

Collection: catalog · ID: `frontend-fibonacci-modulo-pisano-period` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Fibonacci Modulo (Pisano Period). This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution({n,modulus}), with nonnegative decimal-string n and positive integer modulus <= 1000000. Return F_n modulo modulus as a number. Use modular fast doubling so a huge index does not require period discovery. Invalid inputs throw Invalid input.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Use fast doubling as the general method and explain when explicit period discovery is useful or wasteful.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-fibonacci-modulo-pisano-period
npm run practice:watch -- catalog/frontend-fibonacci-modulo-pisano-period
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
