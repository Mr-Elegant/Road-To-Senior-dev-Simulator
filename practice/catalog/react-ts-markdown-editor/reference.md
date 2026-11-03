# Reference: React + TypeScript: Markdown Editor

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep raw Markdown as the editing source and debounce expensive parsing only when measurements justify it. Use a supported parser and a separate sanitization policy for HTML, dangerous URL schemes, and optional raw HTML. Never pass unsanitized user HTML into the page. Preserve editor selection and expose a text-only reading path where useful.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [value, setValue] = useState(''); return <section><label>Markdown<textarea aria-label=\"Markdown\" value={value} onChange={e => setValue(e.target.value)}/></label><div data-testid=\"preview\">{value.split('\\n').map((line, i) => line.startsWith('##') ? <h2 key={i}>{line.slice(2).replace(/^ /, '')}</h2> : line.startsWith('#') ? <h1 key={i}>{line.slice(1).replace(/^ /, '')}</h1> : <p key={i}>{line}</p>)}</div></section>; }\n",
    "architectureNotes": "Follow-up: Add asynchronous preview computation with revision checks so stale parses cannot overwrite newer text.\nTopic reference: https://namastedev.com/practice/markdown-editor\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-markdown-editor. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "markdown-editor-correctness",
      "category": "correctness",
      "label": "Observable behavior and reasoning",
      "weight": 5,
      "description": "Use the executable cases as behavioral evidence; explain invariant, validation, complexity, and limits.",
      "levels": [
        {
          "score": 0,
          "description": "The main behavior does not work."
        },
        {
          "score": 1,
          "description": "Only a happy path works."
        },
        {
          "score": 2,
          "description": "Authored cases pass but the reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "Authored cases pass and the invariant, boundaries, and trade-offs are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Add asynchronous preview computation with revision checks so stale parses cannot overwrite newer text."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Raw HTML; script-like links; code fences.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "markdown-editor-variation",
      "question": "Add asynchronous preview computation with revision checks so stale parses cannot overwrite newer text.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep raw Markdown as the editing source and debounce expensive parsing only when measurements justify it. Use a supported parser and a separate sanitization policy for HTML, dangerous URL schemes, and optional raw HTML. Never pass unsanitized user HTML into the page. Preserve editor selection and expose a text-only reading path where useful. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
