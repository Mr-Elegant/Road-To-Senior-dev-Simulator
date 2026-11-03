# Reference: React + TypeScript: Tooltip

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the trigger accessible without requiring the tooltip. Use an element with role=tooltip and associate it through aria-describedby. Open on hover or focus, close on Escape and the appropriate pointer/focus exit, and clean up delay timers. A tooltip should not contain interactive controls; use a popover or dialog when users must interact with its content.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [open, setOpen] = useState(false); return <section><button aria-describedby={open ? 'help-tip' : undefined} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={e => { if (e.key === 'Escape')\n    setOpen(false); }}>Help</button>{open && <div id=\"help-tip\" role=\"tooltip\">Extra help</div>}</section>; }\n",
    "architectureNotes": "Follow-up: Position the help near viewport edges without clipping or creating an interactive hover trap.\nTopic reference: https://namastedev.com/practice/tooltip\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-tooltip. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "tooltip-correctness",
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
    "Position the help near viewport edges without clipping or creating an interactive hover trap."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Hover; focus; Escape.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tooltip-variation",
      "question": "Position the help near viewport edges without clipping or creating an interactive hover trap.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the trigger accessible without requiring the tooltip. Use an element with role=tooltip and associate it through aria-describedby. Open on hover or focus, close on Escape and the appropriate pointer/focus exit, and clean up delay timers. A tooltip should not contain interactive controls; use a popover or dialog when users must interact with its content. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
