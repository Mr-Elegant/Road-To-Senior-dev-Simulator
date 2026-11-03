# Frontend: OTP Input Component

Collection: catalog · ID: `frontend-otp-input-component` · Mode: **react**

## Business context

Build and verify the core behavior behind OTP Input Component. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Use one labelled Code input with numeric inputMode and one-time-code autocomplete, with six visual slots[data-slot=0..5]. Strip non-ASCII digits and clamp to six. Empty slots display •. Output [data-testid=complete] yes exactly for six digits. Clear resets. This component formats a code; server verification is excluded.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add an expiry/resend flow that does not let an old code submission overwrite a newer challenge state.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-otp-input-component
npm run practice:watch -- catalog/frontend-otp-input-component
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
