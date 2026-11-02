# Deep Readonly State Container with Lens-Based Immutability

Collection: catalog · ID: `ts-deep-immutability-state` · Mode: **guided**

## Business context

In a high-frequency trading and portfolio management dashboard, unintended in-place mutations of deeply nested asset objects caused subtle desynchronizations between the UI chart and underlying websocket order feeds.

## Task

Create a recursive utility type `DeepReadonly<T>` that converts all nested objects, arrays, and maps into immutable types at compile time. Then create a safe updater function `updateAtPath(state, path, updater)` that enforces type safety on nested property updates.

## Candidate tasks

- Write recursive `DeepReadonly<T>` utility type covering primitives, functions, arrays, and plain objects.
- Explain how `ReadonlyArray<T>` protects against `.push()` and `.splice()`.
- Explain why TypeScript readonly is a compile-time check and how it pairs with runtime `Object.freeze`.

## Constraints

- Must recursively make all nested properties readonly, including arrays and Maps.
- Must preserve function types without making their signatures unusable.
- Do not use any third-party libraries.

## Follow-up questions

- Does DeepReadonly prevent runtime mutations if someone casts with `as any`?

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
