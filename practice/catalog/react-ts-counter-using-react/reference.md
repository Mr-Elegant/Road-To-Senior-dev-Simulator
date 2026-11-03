# Reference: React + TypeScript: Counter Using React

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent the count in one state value and use functional updaters when the next value depends on the previous one. Clamp transitions at the documented bounds and disable controls whose action is unavailable. Reset to the initial configured count rather than an accidental hard-coded value. Prefer derived disabled states over additional booleans.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    initial?: number;\n}\nimport { useState } from 'react';\nexport default function App({ initial = 0 }: AppProps = {}): React.JSX.Element { const [n, setN] = useState(initial); return <section><output data-testid=\"count\">{n}</output><button onClick={() => setN(v => Math.min(5, v + 1))} disabled={n === 5}>Increment</button><button onClick={() => setN(v => Math.max(0, v - 1))} disabled={n === 0}>Decrement</button><button onClick={() => setN(initial)}>Reset</button></section>; }\n",
    "architectureNotes": "Follow-up: Support a changed step size without allowing updates to escape the valid range.\nTopic reference: https://namastedev.com/practice/counter-using-react\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-counter-using-react. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "counter-using-react-correctness",
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
    "Support a changed step size without allowing updates to escape the valid range."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Lower/upper limits; reset; rapid activation.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "counter-using-react-variation",
      "question": "Support a changed step size without allowing updates to escape the valid range.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent the count in one state value and use functional updaters when the next value depends on the previous one. Clamp transitions at the documented bounds and disable controls whose action is unavailable. Reset to the initial configured count rather than an accidental hard-coded value. Prefer derived disabled states over additional booleans. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
