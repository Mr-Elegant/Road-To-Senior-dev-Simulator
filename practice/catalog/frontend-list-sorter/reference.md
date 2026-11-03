# Reference: Frontend: List Sorter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store only sort configuration and derive a copied sorted array. Compare strings with a declared locale/collation rule and numbers numerically. Define null/missing-value ordering and add a stable tie-breaker such as ID. Sort indicators and accessible labels should describe the active configuration rather than inferred array order.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { if (!f.Numbers.trim())\n        return []; const parts = f.Numbers.split(','); if (parts.some((s) => !s.trim() || !Number.isFinite(Number(s))))\n        throw new Error('Invalid numbers'); return parts.map(Number).sort((a, b) => a - b); });\nexport default function App() {\n  const [fields, setFields] = useState({\"Numbers\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Numbers\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Move sorting to a paginated server and keep its ordering and tie-breakers consistent with cursor pagination.\nTopic reference: https://namastedev.com/practice/list-sorter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "list-sorter-correctness",
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
    "Move sorting to a paginated server and keep its ordering and tie-breakers consistent with cursor pagination."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Equal keys; numeric-looking strings; null values.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "list-sorter-variation",
      "question": "Move sorting to a paginated server and keep its ordering and tie-breakers consistent with cursor pagination.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store only sort configuration and derive a copied sorted array. Compare strings with a declared locale/collation rule and numbers numerically. Define null/missing-value ordering and add a stable tie-breaker such as ID. Sort indicators and accessible labels should describe the active configuration rather than inferred array order. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
