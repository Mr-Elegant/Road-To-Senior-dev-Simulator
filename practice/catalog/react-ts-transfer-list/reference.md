# Reference: React + TypeScript: Transfer List

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use stable IDs and two membership collections, plus a set of checked IDs. A transfer moves only eligible checked records, preserves order, and clears or reconciles checks according to the contract. Derive select-all and indeterminate states from actual eligible membership. Disable moves that would do nothing.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    initialLeft?: (string)[];\n    initialRight?: string[];\n}\nimport { useState } from 'react';\nexport default function App({ initialLeft = ['A', 'B', 'C'], initialRight = [] }: AppProps = {}): React.JSX.Element { const [left, setLeft] = useState(initialLeft), [right, setRight] = useState(initialRight), [checked, setChecked] = useState<string[]>([]); function toggle(id: string) { setChecked(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id]); } function move(toRight: boolean) { const source = toRight ? left : right, chosen = source.filter(id => checked.includes(id)), remaining = source.filter(id => !checked.includes(id)); if (toRight) {\n    setLeft(remaining);\n    setRight(old => [...old, ...chosen]);\n}\nelse {\n    setRight(remaining);\n    setLeft(old => [...old, ...chosen]);\n} setChecked([]); } return <section>{([['left', left], ['right', right]] as const).map(([name, items]) => <ul key={name} data-testid={name}>{items.map(id => <li key={id}><label><input type=\"checkbox\" data-check={id} checked={checked.includes(id)} onChange={() => toggle(id)}/>{id}</label></li>)}</ul>)}<button data-action=\"right\" onClick={() => move(true)}>Move right</button><button data-action=\"left\" onClick={() => move(false)}>Move left</button><output data-testid=\"left-order\">{left.join(',')}</output><output data-testid=\"right-order\">{right.join(',')}</output></section>; }\n",
    "architectureNotes": "Follow-up: Add per-list search while defining whether Select all affects visible or all eligible records.\nTopic reference: https://namastedev.com/practice/transfer-list\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-transfer-list. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "transfer-list-correctness",
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
    "Add per-list search while defining whether Select all affects visible or all eligible records."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No selection; move all; partial selection.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "transfer-list-variation",
      "question": "Add per-list search while defining whether Select all affects visible or all eligible records.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use stable IDs and two membership collections, plus a set of checked IDs. A transfer moves only eligible checked records, preserves order, and clears or reconciles checks according to the contract. Derive select-all and indeterminate states from actual eligible membership. Disable moves that would do nothing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
