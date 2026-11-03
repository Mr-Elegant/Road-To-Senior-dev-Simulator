# Reference: React + TypeScript: Typewriter Message

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track a visible boundary and derive the prefix from a pre-segmented character array. Own one timer and cancel it whenever the message, speed, run state, or component lifetime changes. Do not index by UTF-16 units if the contract promises whole graphemes. Avoid announcing every intermediate letter to screen readers; provide the full message appropriately.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    message?: string;\n}\nimport { useState } from 'react';\nexport default function App({ message = 'Hello' }: AppProps = {}): React.JSX.Element { const [n, setN] = useState(0), [paused, setPaused] = useState(false), chars = Array.from(message); return <section><p data-testid=\"message\">{chars.slice(0, n).join('')}</p><button data-action=\"advance\" onClick={() => { if (!paused)\n    setN(i => Math.min(chars.length, i + 1)); }}>Advance</button><button data-action=\"pause\" onClick={() => setPaused(v => !v)}>Pause</button><button data-action=\"reset\" onClick={() => { setN(0); setPaused(false); }}>Reset</button></section>; }\n",
    "architectureNotes": "Follow-up: Add pause/resume using a monotonic deadline rather than assuming each timer fires on time.\nTopic reference: https://namastedev.com/practice/typewriter-message\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-typewriter-message. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "typewriter-message-correctness",
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
    "Add pause/resume using a monotonic deadline rather than assuming each timer fires on time."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty message; emoji; changed text mid-run.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "typewriter-message-variation",
      "question": "Add pause/resume using a monotonic deadline rather than assuming each timer fires on time.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track a visible boundary and derive the prefix from a pre-segmented character array. Own one timer and cancel it whenever the message, speed, run state, or component lifetime changes. Do not index by UTF-16 units if the contract promises whole graphemes. Avoid announcing every intermediate letter to screen readers; provide the full message appropriately. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
