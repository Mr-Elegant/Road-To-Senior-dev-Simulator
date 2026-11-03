# Reference: React + TypeScript: Color Explorer

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store the draft independently from the last valid color. Accept a documented form, such as #RRGGBB, and derive a normalized valid value for CSS. Render validation feedback without replacing the user’s incomplete typing. Do not interpolate arbitrary input into a style string. Choose a readable foreground using computed contrast instead of guessing from a color name.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const value = f.Color.trim();\n    if (!/^#[0-9a-fA-F]{6}$/.test(value))\n        throw new Error('Invalid color');\n    return value.toUpperCase();\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Color\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Color\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Support RGB input with an explicit conversion and show contrast against candidate text colors.\nTopic reference: https://namastedev.com/practice/color-explorer\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-color-explorer. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "color-explorer-correctness",
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
    "Support RGB input with an explicit conversion and show contrast against candidate text colors."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Partial input; short/long invalid form; uppercase hex.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "color-explorer-variation",
      "question": "Support RGB input with an explicit conversion and show contrast against candidate text colors.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store the draft independently from the last valid color. Accept a documented form, such as #RRGGBB, and derive a normalized valid value for CSS. Render validation feedback without replacing the user’s incomplete typing. Do not interpolate arbitrary input into a style string. Choose a readable foreground using computed contrast instead of guessing from a color name. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
