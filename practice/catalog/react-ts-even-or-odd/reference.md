# Reference: React + TypeScript: Even or odd

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Reject blank and non-integer values before applying remainder. An integer is even when its remainder modulo two is zero, including negative even integers. Do not use truthiness to validate zero. If the contract must support values beyond Number safe-integer precision, parse and validate a BigInt input rather than classifying an already-rounded Number.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const n = Number(f.Number);\n    if (!f.Number.trim() || !Number.isSafeInteger(n))\n        throw new Error('Invalid integer');\n    return n % 2 === 0 ? 'even' : 'odd';\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Number\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Number\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Add a BigInt mode and keep its parsing error messages separate from ordinary numeric input.\nTopic reference: https://namastedev.com/practice/even-or-odd\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-even-or-odd. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "even-or-odd-correctness",
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
    "Add a BigInt mode and keep its parsing error messages separate from ordinary numeric input."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero; positive/negative integers; decimals.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "even-or-odd-variation",
      "question": "Add a BigInt mode and keep its parsing error messages separate from ordinary numeric input.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Reject blank and non-integer values before applying remainder. An integer is even when its remainder modulo two is zero, including negative even integers. Do not use truthiness to validate zero. If the contract must support values beyond Number safe-integer precision, parse and validate a BigInt input rather than classifying an already-rounded Number. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
