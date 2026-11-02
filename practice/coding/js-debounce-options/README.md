# Advanced Debounce with Leading & Trailing Options

Collection: coding · ID: `js-debounce-options` · Mode: **javascript**

## Task

Implement an enterprise-grade `debounce(func, wait, options)` utility.
The function delays invoking `func` until after `wait` milliseconds have elapsed since the last time it was invoked.

Options:
- `leading` (boolean, default false): Specify invoking on the leading edge of the timeout.
- `trailing` (boolean, default true): Specify invoking on the trailing edge of the timeout.

Must support:
- `debounced.cancel()`: Cancels pending invocation.
- `debounced.flush()`: Immediately executes pending invocation and returns result.

## Constraints

- Must maintain lexical `this` and arguments.
- Must not trigger trailing call if only 1 leading call occurred within the wait window.
- Timer must be cleaned up on cancel() without memory leaks.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- coding/js-debounce-options
npm run practice:watch -- coding/js-debounce-options
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
