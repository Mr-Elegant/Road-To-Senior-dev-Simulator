# React UI: Account Password Feedback

Collection: catalog · ID: `react-ui-password-feedback` · Mode: **react**

## Business context

A trial account form needs immediate, understandable feedback without sending draft passwords to a service.

## Task

Export App. Render a controlled password input labelled Password. Four independent checks award one point each: at least 10 characters, both ASCII lowercase and uppercase letters, an ASCII digit, and a non-alphanumeric character. In [data-testid="feedback"], show Start typing for empty input, Weak for 1–9 characters with at most one passed check (also for any nonempty score 0–1), Fair for scores 2–3, and Strong for score 4. Show the numeric score in [data-testid="passed-rules"]. Recompute on every edit, including deletion.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- Keep the input type=password and associate a visible label with it.
- Do not store, log, or transmit the password. This meter is instructional feedback, not a password-security guarantee.

## Follow-up questions

- Would this replace server-side password validation?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-password-feedback
npm run practice:watch -- catalog/react-ui-password-feedback
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
