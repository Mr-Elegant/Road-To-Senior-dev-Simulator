# Reference: React + TypeScript: Lucky Number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Define the range, validate any user seed inputs, and generate the result in the action handler. Keep display state deterministic between actions and inject randomness for tests. Present it as a game rather than a predictive claim. Reset result and feedback together so a previous round does not appear to describe a new input.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const value = f.Name.trim().toLowerCase();\n    if (!value)\n        throw new Error('Name required');\n    return Array.from(value).reduce((sum, c) => sum + (c.codePointAt(0) ?? 0), 0) % 9 + 1;\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Name\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Name\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Offer a seeded reproducible mode and explain its predictability compared with random sampling.\nTopic reference: https://namastedev.com/practice/lucky-number\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-lucky-number. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "lucky-number-correctness",
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
    "Offer a seeded reproducible mode and explain its predictability compared with random sampling."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Range endpoints; rerender; repeated reroll.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "lucky-number-variation",
      "question": "Offer a seeded reproducible mode and explain its predictability compared with random sampling.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Define the range, validate any user seed inputs, and generate the result in the action handler. Keep display state deterministic between actions and inject randomness for tests. Present it as a game rather than a predictive claim. Reset result and feedback together so a previous round does not appear to describe a new input. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
