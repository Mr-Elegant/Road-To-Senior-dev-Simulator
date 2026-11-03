# Reference: React + TypeScript: Accordion

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A single openId represents all possible states, preventing multiple panels from opening accidentally. Buttons retain native Enter/Space behavior. Stable IDs connect each heading and region through ARIA, and conditional rendering ensures closed answers are absent as specified. If content can change dynamically, derive open status from the current item set and keep IDs stable.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    items?: {\n        id: string;\n        title: string;\n        body: string;\n    }[];\n}\nimport { useState } from 'react';\nexport default function App({ items = [] }: AppProps = {}): React.JSX.Element {\n    const [openId, setOpenId] = useState<string | null>(null);\n    if (!items.length)\n        return <p data-testid=\"empty\">No help articles</p>;\n    return <section>{items.map(item => {\n            const open = openId === item.id;\n            return <article key={item.id}><h3><button type=\"button\" id={'trigger-' + item.id} aria-controls={'panel-' + item.id} aria-expanded={open} onClick={() => setOpenId(old => old === item.id ? null : item.id)}>{item.title}</button></h3>\n      {open && <div role=\"region\" id={'panel-' + item.id} aria-labelledby={'trigger-' + item.id}>{item.body}</div>}</article>;\n        })}</section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-help-panels. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-help-panels-behavior",
      "category": "correctness",
      "label": "Component behavior and boundaries",
      "weight": 5,
      "description": "Use test evidence to explain state transitions, accessible controls, and boundary behavior.",
      "levels": [
        {
          "score": 0,
          "description": "The component is missing or its main interaction fails."
        },
        {
          "score": 1,
          "description": "The happy path works but boundary cases fail."
        },
        {
          "score": 2,
          "description": "All authored cases pass; additional accessibility or edge-case reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "All authored cases pass and the implementation and limitations are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Extract a small pure helper for derived values; keep input state in the component. Extend with a custom hook only when behavior is reused."
  ],
  "commonMistakes": [
    "Keeping an independent open flag on each row, violating single-open behavior.",
    "Rendering a visually hidden panel that still violates the specified DOM contract."
  ],
  "followUps": [
    {
      "id": "help-follow",
      "question": "When would you keep closed panels mounted?",
      "expectedConcepts": [
        "State retention",
        "Accessibility",
        "Trade-offs"
      ],
      "sampleStrongAnswer": "Mount retention is useful for expensive panels or preserving nested input state. Hide closed content with an appropriate semantic mechanism so its controls are not reachable while collapsed. That would be a deliberate contract change; this exercise explicitly removes closed regions."
    }
  ]
}
```
