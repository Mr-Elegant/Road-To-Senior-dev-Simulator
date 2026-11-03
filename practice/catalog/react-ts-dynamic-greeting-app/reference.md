# Reference: React + TypeScript: Dynamic Greeting App

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the name editable, trim it for display, and use a fallback for blank names. Pass or inject the current time so tests are deterministic. If the greeting must change over time, own a timer with cleanup; reading the clock once does not create a live clock. Specify the timezone instead of assuming every user shares the server clock.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    hour?: number;\n}\nimport { useState } from 'react';\nexport default function App({ hour = 9 }: AppProps = {}): React.JSX.Element { const [name, setName] = useState(''); const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'; return <section><label>Name<input aria-label=\"Name\" value={name} onChange={e => setName(e.target.value)}/></label><p data-testid=\"greeting\">{'Good ' + period + ', ' + (name.trim() || 'friend') + '!'}</p></section>; }\n",
    "architectureNotes": "Follow-up: Show a user-selected timezone and handle the case where the device time changes.\nTopic reference: https://namastedev.com/practice/dynamic-greeting-app\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-dynamic-greeting-app. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "dynamic-greeting-app-correctness",
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
    "Show a user-selected timezone and handle the case where the device time changes."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Blank name; whitespace; morning boundary.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "dynamic-greeting-app-variation",
      "question": "Show a user-selected timezone and handle the case where the device time changes.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the name editable, trim it for display, and use a fallback for blank names. Pass or inject the current time so tests are deterministic. If the greeting must change over time, own a timer with cleanup; reading the clock once does not create a live clock. Specify the timezone instead of assuming every user shares the server clock. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
