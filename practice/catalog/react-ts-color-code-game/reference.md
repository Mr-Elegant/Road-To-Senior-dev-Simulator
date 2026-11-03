# Reference: React + TypeScript: Color Code Game

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Generate target/options once per round and keep the answer fixed while the user interacts. Ensure distractors are distinct if uniqueness is part of the contract. Store selected answer and round status; do not infer correctness from DOM color serialization, which browsers may normalize. Provide non-color labels and deterministic random fixtures for testing.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    colors?: (string)[];\n    answer?: string;\n}\nimport { useState } from 'react';\nexport default function App({ colors = ['red', 'blue', 'green'], answer = 'blue' }: AppProps = {}): React.JSX.Element { const [feedback, setFeedback] = useState(''); return <section>{colors.map(color => <button key={color} data-color={color} onClick={() => { if (feedback !== 'Correct')\n    setFeedback(color === answer ? 'Correct' : 'Incorrect'); }}>{color}</button>)}<button data-action=\"reset\" onClick={() => setFeedback('')}>Reset</button><p data-testid=\"feedback\">{feedback}</p></section>; }\n",
    "architectureNotes": "Follow-up: Offer an accessible non-color challenge mode and define how hints affect scoring.\nTopic reference: https://namastedev.com/practice/color-code-game\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-color-code-game. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "color-code-game-correctness",
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
    "Offer an accessible non-color challenge mode and define how hints affect scoring."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Correct/incorrect choice; duplicate distractor prevention; restart.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "color-code-game-variation",
      "question": "Offer an accessible non-color challenge mode and define how hints affect scoring.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Generate target/options once per round and keep the answer fixed while the user interacts. Ensure distractors are distinct if uniqueness is part of the contract. Store selected answer and round status; do not infer correctness from DOM color serialization, which browsers may normalize. Provide non-color labels and deterministic random fixtures for testing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
