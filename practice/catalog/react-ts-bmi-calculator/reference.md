# Reference: React + TypeScript: BMI Calculator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate finite positive height and mass, convert height to metres, and compute mass divided by height squared. Keep raw fields editable and clear stale output on invalid submission. State units beside fields and explain that a numerical BMI is a limited screening calculation, not an individualized assessment or diagnosis.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const w = Number(f.Weight), h = Number(f.Height);\n    if (!f.Weight.trim() || !f.Height.trim() || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0)\n        throw new Error('Invalid measurements');\n    return (w / ((h / 100) ** 2)).toFixed(2);\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Weight\": \"\", \"Height\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Weight\", \"Height\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Add unit-preserving conversions so switching units does not silently reinterpret the same raw number.\nTopic reference: https://namastedev.com/practice/bmi-calculator\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-bmi-calculator. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "bmi-calculator-correctness",
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
    "Add unit-preserving conversions so switching units does not silently reinterpret the same raw number."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero height; negative mass; centimetre conversion.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "bmi-calculator-variation",
      "question": "Add unit-preserving conversions so switching units does not silently reinterpret the same raw number.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate finite positive height and mass, convert height to metres, and compute mass divided by height squared. Keep raw fields editable and clear stale output on invalid submission. State units beside fields and explain that a numerical BMI is a limited screening calculation, not an individualized assessment or diagnosis. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
