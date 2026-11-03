# Reference: Frontend: Word Counter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a whitespace-delimited exercise, trim, split on runs of whitespace, and return zero for blank text. Explain that this is not universal linguistic segmentation. For multilingual text, a locale-aware segmenter can identify word-like units more accurately. Derive counts from input and avoid running a costly parser multiple times per render.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { return f.Text.trim() ? f.Text.trim().split(/\\s+/).length : 0; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Text\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Text\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Display both a simple whitespace count and a locale-aware count with their definitions.\nTopic reference: https://namastedev.com/practice/word-counter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "word-counter-correctness",
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
    "Display both a simple whitespace count and a locale-aware count with their definitions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Blank; repeated whitespace; newlines.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "word-counter-variation",
      "question": "Display both a simple whitespace count and a locale-aware count with their definitions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a whitespace-delimited exercise, trim, split on runs of whitespace, and return zero for blank text. Explain that this is not universal linguistic segmentation. For multilingual text, a locale-aware segmenter can identify word-like units more accurately. Derive counts from input and avoid running a costly parser multiple times per render. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
