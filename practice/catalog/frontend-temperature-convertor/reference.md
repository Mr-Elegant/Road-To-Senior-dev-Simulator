# Reference: Frontend: Temperature Convertor

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store the most recently edited scale and raw value; derive the other scale through pure conversion. Two effects that write each other’s fields can cause loops and rounding drift. Preserve an incomplete draft instead of forcing every keystroke into a number. Specify formatting precision and never treat blank input as zero accidentally.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const n = Number(f.Celsius); if (!f.Celsius.trim() || !Number.isFinite(n))\n        throw new Error('Invalid temperature'); return (n * 9 / 5 + 32).toFixed(2); });\nexport default function App() {\n  const [fields, setFields] = useState({\"Celsius\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Celsius\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add Kelvin with an explicit physical lower-bound policy and separate display rounding from stored precision.\nTopic reference: https://namastedev.com/practice/temperature-convertor\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "temperature-convertor-correctness",
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
    "Add Kelvin with an explicit physical lower-bound policy and separate display rounding from stored precision."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Freezing point; negative values; blank field.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "temperature-convertor-variation",
      "question": "Add Kelvin with an explicit physical lower-bound policy and separate display rounding from stored precision.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store the most recently edited scale and raw value; derive the other scale through pure conversion. Two effects that write each other’s fields can cause loops and rounding drift. Preserve an incomplete draft instead of forcing every keystroke into a number. Specify formatting precision and never treat blank input as zero accidentally. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
