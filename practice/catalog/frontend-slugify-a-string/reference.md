# Reference: Frontend: Slugify a String

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose Unicode preservation or transliteration deliberately. Normalize text, trim, fold case, replace allowed separator runs with a hyphen, and remove outer separators. Do not assume a slug is unique or use it as the sole stable database identity. Keep the raw title and generated preview separate when users may customize a slug.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { return f.Title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); });\nexport default function App() {\n  const [fields, setFields] = useState({\"Title\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Title\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add reserved-word checks and server-side uniqueness without changing existing public URLs silently.\nTopic reference: https://namastedev.com/practice/slugify-a-string\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "slugify-a-string-correctness",
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
    "Add reserved-word checks and server-side uniqueness without changing existing public URLs silently."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Punctuation-only title; accents; repeated separators.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "slugify-a-string-variation",
      "question": "Add reserved-word checks and server-side uniqueness without changing existing public URLs silently.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose Unicode preservation or transliteration deliberately. Normalize text, trim, fold case, replace allowed separator runs with a hyphen, and remove outer separators. Do not assume a slug is unique or use it as the sole stable database identity. Keep the raw title and generated preview separate when users may customize a slug. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
