# Reference: Frontend: BMI Calculator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate finite positive height and mass, convert height to metres, and compute mass divided by height squared. Keep raw fields editable and clear stale output on invalid submission. State units beside fields and explain that a numerical BMI is a limited screening calculation, not an individualized assessment or diagnosis.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const w = Number(f.Weight), h = Number(f.Height); if (!f.Weight.trim() || !f.Height.trim() || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0)\n        throw new Error('Invalid measurements'); return (w / ((h / 100) ** 2)).toFixed(2); });\nexport default function App() {\n  const [fields, setFields] = useState({\"Weight\":\"\",\"Height\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Weight\",\"Height\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add unit-preserving conversions so switching units does not silently reinterpret the same raw number.\nTopic reference: https://namastedev.com/practice/bmi-calculator\nThis app contract and reference were independently authored."
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
