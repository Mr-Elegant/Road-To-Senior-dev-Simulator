# Reference: Frontend: Lucky Number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Define the range, validate any user seed inputs, and generate the result in the action handler. Keep display state deterministic between actions and inject randomness for tests. Present it as a game rather than a predictive claim. Reset result and feedback together so a previous round does not appear to describe a new input.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const value = f.Name.trim().toLowerCase(); if (!value)\n        throw new Error('Name required'); return Array.from(value).reduce((sum, c) => sum + c.codePointAt(0), 0) % 9 + 1; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Name\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Name\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Offer a seeded reproducible mode and explain its predictability compared with random sampling.\nTopic reference: https://namastedev.com/practice/lucky-number\nThis app contract and reference were independently authored."
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
