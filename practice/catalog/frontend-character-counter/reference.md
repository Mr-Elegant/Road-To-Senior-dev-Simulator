# Reference: Frontend: Character Counter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose UTF-16 units, code points, or grapheme clusters explicitly because they produce different answers for emoji and combining marks. For a user-facing text budget, grapheme segmentation is often the desired model when supported. Derive count and remaining budget, and decide whether excess input is rejected or merely reported. Keep announcements restrained during typing.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const n = Array.from(f.Text).length; return { count: n, remaining: Math.max(0, 10 - n) }; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Text\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Text\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Support separate user-visible grapheme counts and server byte limits without conflating the two.\nTopic reference: https://namastedev.com/practice/character-counter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "character-counter-correctness",
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
    "Support separate user-visible grapheme counts and server byte limits without conflating the two."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty text; pasted long text; emoji.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "character-counter-variation",
      "question": "Support separate user-visible grapheme counts and server byte limits without conflating the two.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose UTF-16 units, code points, or grapheme clusters explicitly because they produce different answers for emoji and combining marks. For a user-facing text budget, grapheme segmentation is often the desired model when supported. Derive count and remaining budget, and decide whether excess input is rejected or merely reported. Keep announcements restrained during typing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
