# Reference: Frontend: Leap year

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate the raw input before coercion, then use the ordered divisibility rule: divisible by 400, or divisible by 4 but not by 100. A century is the important counterexample to the naive divide-by-four shortcut. State the supported year range and calendar; do not silently apply contemporary Gregorian rules to historical calendars.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { if (!/^\\d+$/.test(f.Year) || Number(f.Year) < 1 || Number(f.Year) > 9999)\n        throw new Error('Invalid year'); const n = Number(f.Year); return n % 400 === 0 || n % 4 === 0 && n % 100 !== 0; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Year\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Year\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add a calendar selection and explain why a historical date may require jurisdiction-specific rules.\nTopic reference: https://namastedev.com/practice/leap-year\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "leap-year-correctness",
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
    "Add a calendar selection and explain why a historical date may require jurisdiction-specific rules."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 2000; 1900; ordinary leap year.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "leap-year-variation",
      "question": "Add a calendar selection and explain why a historical date may require jurisdiction-specific rules.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate the raw input before coercion, then use the ordered divisibility rule: divisible by 400, or divisible by 4 but not by 100. A century is the important counterexample to the naive divide-by-four shortcut. State the supported year range and calendar; do not silently apply contemporary Gregorian rules to historical calendars. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
