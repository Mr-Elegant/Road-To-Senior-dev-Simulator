# React UI: Team Tag Editor

Collection: catalog · ID: `react-ui-tag-editor` · Mode: **react**

## Business context

A support team labels saved views with a small set of tags and needs predictable keyboard behavior without accidental duplicates.

## Task

Export App({ limit = 3 }). Render an input labelled New tag and a list [data-testid="tags"]. Enter adds the trimmed nonempty draft and clears the input on success. Compare existing tags case-insensitively; a duplicate leaves the draft unchanged and sets [data-testid="feedback"] to Tag already exists. At the limit show Tag limit reached and retain the draft. Duplicate checking takes precedence over the limit. Blank Enter does nothing. Each tag has a native button named Remove followed by the original tag text. Backspace on an empty input removes the last tag. Clear feedback after a successful add or removal. Preserve original capitalization and insertion order.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- limit is an integer from 1 to 5; tests only supply valid configuration.
- Use immutable list updates, a labelled input, and native remove buttons. Do not submit a form on Enter.

## Follow-up questions

- How should this behave while a user is composing text with an IME?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-tag-editor
npm run practice:watch -- catalog/react-ui-tag-editor
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
