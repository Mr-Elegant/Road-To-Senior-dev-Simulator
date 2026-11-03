# Frontend: Authentication

Collection: catalog · ID: `frontend-authentication` · Mode: **react**

## Business context

Build and verify the core behavior behind Authentication. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({accept=true}). Model a demo sign-in state using an injected async acceptance flag, not the host app auth. Labelled Email input and Sign in button await Promise resolution, then show Signed in: trimmed email or Sign in failed in [data-testid="session"]. Empty email shows Email required. Signed-in state exposes Sign out and clears session on activation. No tokens, cookies or network.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Keep a public screen usable during background session refresh while preserving account isolation.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-authentication
npm run practice:watch -- catalog/frontend-authentication
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
