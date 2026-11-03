# Reference: Frontend: Array to Zigzag String Converter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "First define what zigzag means: here even-indexed words remain unchanged and odd-indexed words reverse by Unicode code points; join with one space. Use map for a pure transformation and Array.from for code-point reversal. This contract intentionally differs from a matrix zigzag traversal. A UI should parse input and render the derived output without a second synchronized state variable.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { return f.Text.trim() ? f.Text.trim().split(/\\s+/).map((s, i) => i % 2 ? Array.from(s).reverse().join('') : s).join(' ') : ''; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Text\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Text\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Extend reversal to user-perceived graphemes and state the required segmentation support.\nTopic reference: https://namastedev.com/practice/array-to-zigzag-string-converter\nThis app contract and reference were independently authored."
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
