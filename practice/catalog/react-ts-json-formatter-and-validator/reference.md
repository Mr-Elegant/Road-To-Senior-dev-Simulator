# Reference: React + TypeScript: JSON Formatter and Validator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Parse using JSON.parse inside try/catch and derive formatted output only after successful parsing. Show a useful error region and clear stale formatted output when the input becomes invalid. Bound input size for a UI utility and do not run large blocking work on every keystroke. JSON is a data format, not arbitrary JavaScript object syntax.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    try {\n        return JSON.parse(f.JSON);\n    }\n    catch {\n        throw new Error('Invalid JSON');\n    }\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"JSON\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"JSON\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Move large-document parsing to a Worker and discard stale parse results by revision.\nTopic reference: https://namastedev.com/practice/json-formatter-and-validator\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-json-formatter-and-validator. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "json-formatter-and-validator-correctness",
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
    "Move large-document parsing to a Worker and discard stale parse results by revision."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty input; trailing comma; primitive JSON.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "json-formatter-and-validator-variation",
      "question": "Move large-document parsing to a Worker and discard stale parse results by revision.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Parse using JSON.parse inside try/catch and derive formatted output only after successful parsing. Show a useful error region and clear stale formatted output when the input becomes invalid. Bound input size for a UI utility and do not run large blocking work on every keystroke. JSON is a data format, not arbitrary JavaScript object syntax. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
