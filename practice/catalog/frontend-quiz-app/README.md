# Frontend: Quiz App

Collection: catalog · ID: `frontend-quiz-app` · Mode: **react**

## Business context

Build and verify the core behavior behind Quiz App. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({questions=[{id:q,text:2+2,options:[3,4],correct:1}]}). Show h2 question and option buttons[data-option=INDEX]. Next[data-action=next] is disabled until answered; finish last question into output[data-testid=score] correct/total. Restart[data-action=restart] clears. correct is zero-based; question list is nonempty.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support multiple correct answers with a documented partial-credit policy and reproducible question order.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-quiz-app
npm run practice:watch -- catalog/frontend-quiz-app
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
