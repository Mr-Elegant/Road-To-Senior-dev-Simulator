# Reference: React + TypeScript: Billing Counter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store quantities and item IDs, derive line totals, and calculate the bill from authoritative unit amounts. Use integer minor currency units where the domain permits, and specify rounding boundaries and discount stacking. Clamp quantities and reject unknown products. Rendering an amount is not permission to charge it; a payment server recomputes the final payable amount.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const q = Number(f.Quantity), u = Number(f.Unit), d = Number(f.Discount);\n    if (Object.values(f).some((s) => !s.trim()) || ![q, u, d].every(Number.isInteger) || q < 0 || q > 100 || u < 0 || d < 0 || d > 100)\n        throw new Error('Invalid bill');\n    const subtotal = q * u, discount = Math.round(subtotal * d / 100);\n    return { subtotal, discount, total: subtotal - discount };\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Quantity\": \"\", \"Unit\": \"\", \"Discount\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Quantity\", \"Unit\", \"Discount\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Add tax-inclusive pricing and define whether rounding occurs per line or for the whole invoice.\nTopic reference: https://namastedev.com/practice/billing-counter\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-billing-counter. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "billing-counter-correctness",
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
    "Add tax-inclusive pricing and define whether rounding occurs per line or for the whole invoice."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero quantity; quantity limit; percentage rounding.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "billing-counter-variation",
      "question": "Add tax-inclusive pricing and define whether rounding occurs per line or for the whole invoice.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store quantities and item IDs, derive line totals, and calculate the bill from authoritative unit amounts. Use integer minor currency units where the domain permits, and specify rounding boundaries and discount stacking. Clamp quantities and reject unknown products. Rendering an amount is not permission to charge it; a payment server recomputes the final payable amount. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
