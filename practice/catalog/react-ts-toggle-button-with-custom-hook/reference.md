# Reference: React + TypeScript: Toggle button with custom hook

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Return the current boolean and stable operations for toggle, set true, and set false. Use a lazy initial value and a functional updater for inversion, so multiple queued toggles compose correctly. Reuse the hook only for identical behavior; it should not own unrelated rendering, network access, or global theme policy.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nfunction useToggle(initial = false) { const [value, setValue] = useState(initial); return [value, () => setValue(v => !v), () => setValue(true), () => setValue(false)] as const; }\nexport default function App(): React.JSX.Element { const [value, toggle, on, off] = useToggle(); return <section><output data-testid=\"state\">{value ? 'on' : 'off'}</output><button onClick={toggle}>Toggle</button><button onClick={on}>On</button><button onClick={off}>Off</button></section>; }\n",
    "architectureNotes": "Follow-up: Allow a controlled parent mode and define who owns state rather than mixing two authorities.\nTopic reference: https://namastedev.com/practice/toggle-button-with-custom-hook\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-toggle-button-with-custom-hook. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "toggle-button-with-custom-hook-correctness",
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
    "Allow a controlled parent mode and define who owns state rather than mixing two authorities."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Default false; explicit true; two queued toggles.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "toggle-button-with-custom-hook-variation",
      "question": "Allow a controlled parent mode and define who owns state rather than mixing two authorities.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Return the current boolean and stable operations for toggle, set true, and set false. Use a lazy initial value and a functional updater for inversion, so multiple queued toggles compose correctly. Reuse the hook only for identical behavior; it should not own unrelated rendering, network access, or global theme policy. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
