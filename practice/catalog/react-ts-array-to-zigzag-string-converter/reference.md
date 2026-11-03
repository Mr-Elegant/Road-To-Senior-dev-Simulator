# Reference: React + TypeScript: Array to Zigzag String Converter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "First define what zigzag means: here even-indexed words remain unchanged and odd-indexed words reverse by Unicode code points; join with one space. Use map for a pure transformation and Array.from for code-point reversal. This contract intentionally differs from a matrix zigzag traversal. A UI should parse input and render the derived output without a second synchronized state variable.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) { return f.Text.trim() ? f.Text.trim().split(/\\s+/).map((s, i) => i % 2 ? Array.from(s).reverse().join('') : s).join(' ') : ''; });\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Text\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Text\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Extend reversal to user-perceived graphemes and state the required segmentation support.\nTopic reference: https://namastedev.com/practice/array-to-zigzag-string-converter\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-array-to-zigzag-string-converter. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "array-to-zigzag-string-converter-correctness",
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
    "Extend reversal to user-perceived graphemes and state the required segmentation support."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty list; one word; odd/even list lengths.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "array-to-zigzag-string-converter-variation",
      "question": "Extend reversal to user-perceived graphemes and state the required segmentation support.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "First define what zigzag means: here even-indexed words remain unchanged and odd-indexed words reverse by Unicode code points; join with one space. Use map for a pure transformation and Array.from for code-point reversal. This contract intentionally differs from a matrix zigzag traversal. A UI should parse input and render the derived output without a second synchronized state variable. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
