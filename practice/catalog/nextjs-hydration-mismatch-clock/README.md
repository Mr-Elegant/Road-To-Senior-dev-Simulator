# Multi-Timezone Scheduling Hydration Mismatch & Layout Shift

Collection: catalog · ID: `nextjs-hydration-mismatch-clock` · Mode: **guided**

## Business context

A telemedicine appointment booking application allows patients in London, New York, and Tokyo to schedule appointments. Users complain that slot times flicker upon page load, and the browser console is filled with "Text content did not match. Server: ... Client: ..." warnings, breaking client-side interactivity.

## Task

The appointment slot component formats dates using `new Date().toLocaleTimeString()`. On the Node.js server (running in UTC timezone), it renders "14:00 UTC". On the client browser in New York (EST), it renders "09:00 AM". The mismatch triggers React hydration failure, causing React to discard server HTML and re-render the tree from scratch, causing layout shift.

## Candidate tasks

- Explain what causes React hydration mismatch error #418 / #425.
- Refactor the component to avoid rendering client-dependent timestamps during SSR (e.g. two-pass rendering with `useEffect` or passing explicit timezone prop).
- Explain when `suppressHydrationWarning` is appropriate versus anti-pattern.

## Constraints

- Must eliminate hydration mismatch errors completely.
- Must display time accurately in the user's local timezone or explicit appointment timezone.
- Do not disable SSR completely or turn entire page into client-rendered spinner.

## Follow-up questions

- Why does `if (typeof window !== "undefined")` in render still cause hydration errors in Next.js?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
