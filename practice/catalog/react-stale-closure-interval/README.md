# Order-Book Live Ticker Stale Closure Hook Bug

Collection: catalog · ID: `react-stale-closure-interval` · Mode: **guided**

## Business context

A crypto exchange trading terminal renders live price ticks. Traders report that the price counter freezes after the first tick, or flickers wildly between old and new prices. The bug causes incorrect stop-loss orders to trigger.

## Task

The custom hook `useIntervalTicker` sets up a `setInterval` inside `useEffect`, but closes over the initial `price` state from render #1. Every time the interval fires, it computes the new price based on the initial stale value rather than the latest accumulated value.

## Candidate tasks

- Explain how the empty dependency array `[]` locks the `useEffect` closure to initial render variables.
- Fix the bug using functional state updates: `setPrice(prevPrice => prevPrice + delta)`.
- Explain Dan Abramov's `useInterval` ref pattern for dynamic callback updates without timer recreation.

## Constraints

- Must maintain accurate ticker increment based on the latest state.
- Must not re-create the setInterval timer on every single tick (which resets the timer drift and causes interval jitter).
- Must clean up interval on unmount.

## Follow-up questions

- Why does useReducer often prevent stale closure bugs compared to useState?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
