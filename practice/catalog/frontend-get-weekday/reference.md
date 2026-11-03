# Reference: Frontend: Get Weekday

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Treat YYYY-MM-DD as calendar fields rather than blindly parsing a timestamp. Validate that the reconstructed year/month/day matches the requested fields. Either compute consistently in UTC and format in UTC or intentionally use local calendar construction. Do not mix a UTC midnight parse with local weekday formatting.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(f.Date))\n        throw new Error('Invalid date'); const date = new Date(f.Date + 'T00:00:00Z'); if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== f.Date)\n        throw new Error('Invalid date'); return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()]; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Date\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Date\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add locale-specific weekday labels while preserving the same calendar date.\nTopic reference: https://namastedev.com/practice/get-weekday\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "get-weekday-correctness",
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
    "Add locale-specific weekday labels while preserving the same calendar date."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Month boundary; leap day; invalid date.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "get-weekday-variation",
      "question": "Add locale-specific weekday labels while preserving the same calendar date.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Treat YYYY-MM-DD as calendar fields rather than blindly parsing a timestamp. Validate that the reconstructed year/month/day matches the requested fields. Either compute consistently in UTC and format in UTC or intentionally use local calendar construction. Do not mix a UTC midnight parse with local weekday formatting. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
