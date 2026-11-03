# Reference: React + TypeScript: Get Weekday

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Treat YYYY-MM-DD as calendar fields rather than blindly parsing a timestamp. Validate that the reconstructed year/month/day matches the requested fields. Either compute consistently in UTC and format in UTC or intentionally use local calendar construction. Do not mix a UTC midnight parse with local weekday formatting.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(f.Date))\n        throw new Error('Invalid date');\n    const date = new Date(f.Date + 'T00:00:00Z');\n    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== f.Date)\n        throw new Error('Invalid date');\n    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()];\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Date\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Date\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Add locale-specific weekday labels while preserving the same calendar date.\nTopic reference: https://namastedev.com/practice/get-weekday\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-get-weekday. The TypeScript copy uses a separate scenario ID and attempt history."
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
