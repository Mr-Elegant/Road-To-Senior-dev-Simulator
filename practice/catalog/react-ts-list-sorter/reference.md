# Reference: React + TypeScript: List Sorter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store only sort configuration and derive a copied sorted array. Compare strings with a declared locale/collation rule and numbers numerically. Define null/missing-value ordering and add a stable tie-breaker such as ID. Sort indicators and accessible labels should describe the active configuration rather than inferred array order.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    if (!f.Numbers.trim())\n        return [];\n    const parts = f.Numbers.split(',');\n    if (parts.some((s) => !s.trim() || !Number.isFinite(Number(s))))\n        throw new Error('Invalid numbers');\n    return parts.map(Number).sort((a, b) => a - b);\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Numbers\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Numbers\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Move sorting to a paginated server and keep its ordering and tie-breakers consistent with cursor pagination.\nTopic reference: https://namastedev.com/practice/list-sorter\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-list-sorter. The TypeScript copy uses a separate scenario ID and attempt history."
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
