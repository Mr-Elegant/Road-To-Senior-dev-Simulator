# Reference: React + TypeScript: Drag And Drop II

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent selection by IDs independently of DOM positions. Build the source and destination arrays from a single snapshot and commit them atomically, removing selected IDs only once. Preserve the selected group’s original order and define same-container drop semantics. Expose an accessible move action for users who cannot perform a pointer drag.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    initialLeft?: (string)[];\n    initialRight?: string[];\n}\nimport { useState } from 'react';\nexport default function App({ initialLeft = ['A', 'B', 'C'], initialRight = [] }: AppProps = {}): React.JSX.Element { const [left, setLeft] = useState(initialLeft), [right, setRight] = useState(initialRight), [checked, setChecked] = useState<string[]>([]); function toggle(id: string) { setChecked(old => old.includes(id) ? old.filter(v => v !== id) : [...old, id]); } function move(toRight: boolean) { const source = toRight ? left : right, chosen = source.filter(id => checked.includes(id)), remaining = source.filter(id => !checked.includes(id)); if (toRight) {\n    setLeft(remaining);\n    setRight(old => [...old, ...chosen]);\n}\nelse {\n    setRight(remaining);\n    setLeft(old => [...old, ...chosen]);\n} setChecked([]); } return <section>{([['left', left], ['right', right]] as const).map(([name, items]) => <ul key={name} data-testid={name}>{items.map(id => <li key={id}><label><input type=\"checkbox\" data-check={id} checked={checked.includes(id)} onChange={() => toggle(id)}/>{id}</label></li>)}</ul>)}<button data-action=\"right\" onClick={() => move(true)}>Move right</button><button data-action=\"left\" onClick={() => move(false)}>Move left</button><output data-testid=\"left-order\">{left.join(',')}</output><output data-testid=\"right-order\">{right.join(',')}</output></section>; }\n",
    "architectureNotes": "Follow-up: Add reversible batch moves and a live announcement describing how many items moved.\nTopic reference: https://namastedev.com/practice/drag-and-drop-ii\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-drag-and-drop-ii. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "drag-and-drop-ii-correctness",
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
    "Add reversible batch moves and a live announcement describing how many items moved."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Multiple selection; empty target; same-container drop.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "drag-and-drop-ii-variation",
      "question": "Add reversible batch moves and a live announcement describing how many items moved.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent selection by IDs independently of DOM positions. Build the source and destination arrays from a single snapshot and commit them atomically, removing selected IDs only once. Preserve the selected group’s original order and define same-container drop semantics. Expose an accessible move action for users who cannot perform a pointer drag. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
