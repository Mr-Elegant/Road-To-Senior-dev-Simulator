# Reference: React + TypeScript: Pin Items

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store pinned IDs separately from the underlying records. Derive the pinned and unpinned partitions, then concatenate them according to a documented ordering policy. Pinning should not mutate source data or replace stable keys. If search hides a pinned record, keep its pin intent unless the product explicitly removes it.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    items?: (string)[];\n}\nimport { useState } from 'react';\nexport default function App({ items = ['A', 'B', 'C'] }: AppProps = {}): React.JSX.Element { const [pinned, setPinned] = useState<string[]>([]); const order = [...items.filter(id => pinned.includes(id)), ...items.filter(id => !pinned.includes(id))]; return <section><ul>{order.map(id => <li key={id} data-row={id}>{id}<button data-pin={id} aria-pressed={pinned.includes(id)} onClick={() => setPinned(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id])}>Pin {id}</button></li>)}</ul><output data-testid=\"order\">{order.join(',')}</output></section>; }\n",
    "architectureNotes": "Follow-up: Synchronize pin preferences across devices with versioned updates instead of index-based writes.\nTopic reference: https://namastedev.com/practice/pin-items\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-pin-items. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "pin-items-correctness",
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
    "Synchronize pin preferences across devices with versioned updates instead of index-based writes."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Pin/unpin; repeated pin; filtered pinned item.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "pin-items-variation",
      "question": "Synchronize pin preferences across devices with versioned updates instead of index-based writes.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store pinned IDs separately from the underlying records. Derive the pinned and unpinned partitions, then concatenate them according to a documented ordering policy. Pinning should not mutate source data or replace stable keys. If search hides a pinned record, keep its pin intent unless the product explicitly removes it. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
