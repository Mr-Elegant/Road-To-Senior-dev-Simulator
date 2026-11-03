# Reference: React + TypeScript: Mortgage Calculator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The form owns raw input strings and validates them only on submission. Explicit blank checks prevent coercion from turning missing values into zero. The no-interest branch avoids a singular amortization expression. Invalid submissions clear stale estimates; valid submissions format the final result to two decimal places. This formula is an educational estimate rather than a full lending calculation.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ principal: '', rate: '', years: '' });\n    const [payment, setPayment] = useState('');\n    const [error, setError] = useState('');\n    function submit(e: React.FormEvent<HTMLFormElement>) {\n        e.preventDefault();\n        const p = Number(fields.principal), annual = Number(fields.rate), y = Number(fields.years);\n        if (Object.values(fields).some(v => !v.trim()) || ![p, annual, y].every(Number.isFinite) || p <= 0 || p > 1000000000 || annual < 0 || annual > 100 || !Number.isInteger(y) || y < 1 || y > 50) {\n            setPayment('');\n            setError('Enter valid loan details');\n            return;\n        }\n        const n = y * 12, r = annual / 1200;\n        setPayment((r === 0 ? p / n : p * r / (1 - Math.pow(1 + r, -n))).toFixed(2));\n        setError('');\n    }\n    return <form onSubmit={submit}>{[['principal', 'Principal'], ['rate', 'Annual rate'], ['years', 'Years']].map(([name, label]) => <label key={name}>{label}<input name={name} value={fields[name]} onChange={e => setFields({ ...fields, [name]: e.target.value })}/></label>)}\n    <button type=\"submit\">Calculate</button><p data-testid=\"error\" role=\"alert\">{error}</p><output data-testid=\"payment\">{payment}</output></form>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-loan-estimator. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-loan-estimator-behavior",
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
    "Using annual percentage directly as the monthly decimal rate.",
    "Leaving the old payment visible after a failed submission."
  ],
  "followUps": [
    {
      "id": "loan-follow",
      "question": "What changes for production lending calculations?",
      "expectedConcepts": [
        "Decimal arithmetic",
        "Contractual rules",
        "Server authority"
      ],
      "sampleStrongAnswer": "Specify contractual compounding, schedule dates, fees, and rounding before selecting an implementation. Use authoritative server calculations and appropriate decimal or integer-money arithmetic, with fixtures agreed with domain experts. A floating-point UI estimate is insufficient for a lending contract."
    }
  ]
}
```
