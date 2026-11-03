# Reference: React + TypeScript: Cinema Hall

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use stable seat IDs and separate reserved inventory from local selection. Derive totals from selected available seats. A local selected state is only intent; a booking server must enforce availability atomically and expire holds. Render seat status through text/accessible labels as well as color, and provide predictable keyboard navigation for a large grid.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    reserved?: (string)[];\n}\nimport { useState } from 'react';\nexport default function App({ reserved = ['A2'] }: AppProps = {}): React.JSX.Element { const [selected, setSelected] = useState<string[]>([]); return <section><div role=\"group\" aria-label=\"Seats\">{['A1', 'A2', 'A3', 'A4'].map(id => <button key={id} data-seat={id} aria-label={'Seat ' + id} disabled={reserved.includes(id)} aria-pressed={selected.includes(id)} onClick={() => setSelected(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id])}>{id}</button>)}</div><output data-testid=\"total\">{selected.length * 1000}</output></section>; }\n",
    "architectureNotes": "Follow-up: Design timed reservation holds with server authority and explain the race between two clients selecting the same seat.\nTopic reference: https://namastedev.com/practice/cinema-hall\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-cinema-hall. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "cinema-hall-correctness",
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
    "Design timed reservation holds with server authority and explain the race between two clients selecting the same seat."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Reserved seat; toggle selection; pricing category.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "cinema-hall-variation",
      "question": "Design timed reservation holds with server authority and explain the race between two clients selecting the same seat.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use stable seat IDs and separate reserved inventory from local selection. Derive totals from selected available seats. A local selected state is only intent; a booking server must enforce availability atomically and expire holds. Render seat status through text/accessible labels as well as color, and provide predictable keyboard navigation for a large grid. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
