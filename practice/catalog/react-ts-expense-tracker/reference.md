# Reference: React + TypeScript: Expense Tracker

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store immutable expense records with stable IDs and validated amounts. Prefer minor-unit integers for fixed-decimal currencies and derive category totals from the records. Keep edit drafts separate from committed entries. Specify how refunds or negative values behave rather than rejecting them accidentally. Date filtering should use a chosen calendar timezone.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState, useRef } from 'react';\nexport default function App(): React.JSX.Element { const [description, setDescription] = useState(''), [amount, setAmount] = useState(''), [items, setItems] = useState<{\n    id: string;\n    description: string;\n    cents: number;\n}[]>([]), [error, setError] = useState(''), next = useRef(1); function add() { const cents = Number(amount); if (!description.trim() || !amount.trim() || !Number.isInteger(cents) || cents <= 0) {\n    setError('Invalid expense');\n    return;\n} const id = String(next.current++); setItems(old => [...old, { id, description: description.trim(), cents }]); setDescription(''); setAmount(''); setError(''); } return <section><label>Description<input name=\"description\" value={description} onChange={e => setDescription(e.target.value)}/></label><label>Cents<input name=\"cents\" value={amount} onChange={e => setAmount(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add</button><ul>{items.map(item => <li key={item.id} data-expense={item.id}>{item.description}<button data-delete={item.id} onClick={() => setItems(old => old.filter(v => v.id !== item.id))}>Delete</button></li>)}</ul><output data-testid=\"total\">{items.reduce((sum, item) => sum + item.cents, 0)}</output><p role=\"alert\">{error}</p></section>; }\n",
    "architectureNotes": "Follow-up: Add multiple currencies with explicit conversion rates and avoid summing unlike monetary units.\nTopic reference: https://namastedev.com/practice/expense-tracker\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-expense-tracker. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "expense-tracker-correctness",
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
    "Add multiple currencies with explicit conversion rates and avoid summing unlike monetary units."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero/negative policy; editing; deletion.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "expense-tracker-variation",
      "question": "Add multiple currencies with explicit conversion rates and avoid summing unlike monetary units.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store immutable expense records with stable IDs and validated amounts. Prefer minor-unit integers for fixed-decimal currencies and derive category totals from the records. Keep edit drafts separate from committed entries. Specify how refunds or negative values behave rather than rejecting them accidentally. Date filtering should use a chosen calendar timezone. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
