# Accessible ARIA 1.2 Enterprise Multi-Select Combobox

Collection: catalog · ID: `react-accessible-combobox` · Mode: **guided**

## Business context

An enterprise healthcare and governance system requires all interface components to comply with WCAG 2.1 AA and Section 508. The current custom assignee dropdown cannot be operated via keyboard navigation and screen readers read it as an unlabelled text box.

## Task

Build a fully accessible, keyboard-operable Combobox component complying with WAI-ARIA 1.2 Combobox pattern. It must support ArrowDown/ArrowUp navigation, Enter to select, Escape to close, aria-expanded, aria-activedescendant, aria-controls, and live regions.

## Candidate tasks

- Implement `onKeyDown` to handle ArrowDown, ArrowUp, Enter, Escape, and Home/End.
- Bind `aria-activedescendant` on the input pointing to the active option element ID.
- Ensure listbox receives `role="listbox"` and items receive `role="option"`.

## Constraints

- Must support complete keyboard interaction without mouse.
- Must properly maintain focus on input while using aria-activedescendant to track highlighted option.
- Screen readers must announce option count and active selection changes.

## Follow-up questions

- Why is aria-activedescendant preferred over moving physical document.activeElement focus into the dropdown list?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
