# Reference: Frontend: Even or odd

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Reject blank and non-integer values before applying remainder. An integer is even when its remainder modulo two is zero, including negative even integers. Do not use truthiness to validate zero. If the contract must support values beyond Number safe-integer precision, parse and validate a BigInt input rather than classifying an already-rounded Number.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const n = Number(f.Number); if (!f.Number.trim() || !Number.isSafeInteger(n))\n        throw new Error('Invalid integer'); return n % 2 === 0 ? 'even' : 'odd'; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Number\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Number\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add a BigInt mode and keep its parsing error messages separate from ordinary numeric input.\nTopic reference: https://namastedev.com/practice/even-or-odd\nThis app contract and reference were independently authored."
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
