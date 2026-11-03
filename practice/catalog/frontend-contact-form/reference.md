# Reference: Frontend: Contact Form

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep raw fields in state and validate on a documented boundary such as blur or submit. Derive field errors from the current values, connect them with aria-describedby, and move focus to the first invalid field on submit. Prevent duplicate requests while pending. Keep client validation distinct from server validation and preserve typed input after a server failure.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const name = f.Name.trim(), email = f.Email.trim().toLowerCase(), message = f.Message.trim(); if (!name || !/^\\S+@\\S+\\.\\S+$/.test(email) || message.length < 10)\n        throw new Error('Invalid contact details'); return { name, email, message }; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Name\":\"\",\"Email\":\"\",\"Message\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Name\",\"Email\",\"Message\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add server field errors without erasing newer edits made while a request was in flight.\nTopic reference: https://namastedev.com/practice/contact-form\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "contact-form-correctness",
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
    "Add server field errors without erasing newer edits made while a request was in flight."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Required fields; malformed email; whitespace-only message.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "contact-form-variation",
      "question": "Add server field errors without erasing newer edits made while a request was in flight.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep raw fields in state and validate on a documented boundary such as blur or submit. Derive field errors from the current values, connect them with aria-describedby, and move focus to the first invalid field on submit. Prevent duplicate requests while pending. Keep client validation distinct from server validation and preserve typed input after a server failure. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
