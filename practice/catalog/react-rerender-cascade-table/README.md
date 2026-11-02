# 10,000-Row Logistics Inventory Table Cascading Re-Render Freeze

Collection: catalog · ID: `react-rerender-cascade-table` · Mode: **guided**

## Business context

A freight forwarding dispatch dashboard displays a live table of 10,000 shipments. When the operator types into a search input at the top of the page, keystrokes experience 800ms input lag, rendering the application unusable.

## Task

Every single keystroke updates search query state in the parent page component. Because the table row components are un-memoized and receive newly created inline arrow functions and object literals on every render, all 10,000 row components re-render and re-calculate DOM styles on every character typed.

## Candidate tasks

- Diagnose the two major performance bottlenecks: cascading re-renders and un-virtualized DOM node count.
- Apply `useMemo` for filtered dataset and `useCallback` or stable handler for `onSelect`.
- Explain windowing/virtualization (e.g. `@tanstack/react-virtual` or `react-window`) to only render visible DOM rows.

## Constraints

- Typing in the search input must feel instantaneous (under 16ms input latency).
- Table must display filtered results responsively.
- Must demonstrate proper use of React.memo, useMemo, useCallback, or virtualization.

## Follow-up questions

- What is the exact mechanism of useDeferredValue in React 18+?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
