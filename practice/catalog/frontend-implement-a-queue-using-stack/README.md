# Frontend: Implement a Queue using Stack

Collection: catalog · ID: `frontend-implement-a-queue-using-stack` · Mode: **frontend-js**

## Business context

Build and verify the core behavior behind Implement a Queue using Stack. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Implement solution(commands). Use two stacks for FIFO enqueue{value}, dequeue, peek, size. enqueue returns size; empty dequeue/peek return null. Transfer input to output only when output is empty.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Define solution(input) in plain JavaScript. Return the documented JSON-compatible value or throw the documented validation error. Each case receives a fresh input.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Explain amortized analysis using a potential function and contrast it with worst-case per-operation latency.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-implement-a-queue-using-stack
npm run practice:watch -- catalog/frontend-implement-a-queue-using-stack
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
