# Customer Support CRM Search Out-of-Order Response Overwrite

Collection: catalog · ID: `react-race-condition-autocomplete` · Mode: **guided**

## Business context

In a high-volume customer support ticketing portal, agents type customer email addresses into a live autocomplete bar. Often, typing "alexander" shows search results for "alex" because the earlier network request for "alex" took 600ms while the later request for "alexander" took 150ms.

## Task

Because network latency varies unpredictably, asynchronous responses return out-of-order. The component currently sets state whenever any promise resolves. Implement request cancellation using `AbortController` and ignore stale in-flight results.

## Candidate tasks

- Identify how variable network latency produces stale state overwrites.
- Implement `AbortController` in the `useEffect` cleanup function.
- Catch `err.name === "AbortError"` gracefully so aborted requests do not set error state.

## Constraints

- When user types, earlier in-flight requests must be aborted or their results discarded.
- Debounce input to prevent API flood (e.g. 250ms).
- Properly handle AbortError without triggering uncaught exception logs.

## Follow-up questions

- How does TanStack Query handle query cancellation under the hood?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
