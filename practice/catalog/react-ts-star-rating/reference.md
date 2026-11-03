# Reference: React + TypeScript: Star Rating

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store the committed rating and transient preview independently. Render a radiogroup or an equivalent fully implemented interaction pattern, not decorative clickable icons alone. Pointer exit restores the committed view. Arrow keys should move through valid options and accessible labels must identify values. Decide whether zero/unrated is allowed.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    initial?: number;\n    readOnly?: boolean;\n}\nimport { useState } from 'react';\nexport default function App({ initial = 0, readOnly = false }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(initial); return <section><div role=\"radiogroup\" aria-label=\"Rating\">{[1, 2, 3, 4, 5].map(n => <button key={n} data-rating={n} role=\"radio\" aria-label={n + ' stars'} aria-checked={value === n} onClick={() => { if (!readOnly)\n    setValue(n); }} onKeyDown={e => { if (!readOnly && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {\n    e.preventDefault();\n    setValue(v => Math.max(1, Math.min(5, v + (e.key === 'ArrowRight' ? 1 : -1))));\n} }}>★</button>)}</div><output data-testid=\"rating\">{value}</output></section>; }\n",
    "architectureNotes": "Follow-up: Support fractional display without pretending half-star selection follows automatically from integer radios.\nTopic reference: https://namastedev.com/practice/star-rating\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-star-rating. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "star-rating-correctness",
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
    "Support fractional display without pretending half-star selection follows automatically from integer radios."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Unrated; hover without commit; pointer leave.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "star-rating-variation",
      "question": "Support fractional display without pretending half-star selection follows automatically from integer radios.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store the committed rating and transient preview independently. Render a radiogroup or an equivalent fully implemented interaction pattern, not decorative clickable icons alone. Pointer exit restores the committed view. Arrow keys should move through valid options and accessible labels must identify values. Decide whether zero/unrated is allowed. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
