# Reference: React + TypeScript: Contact Form

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep raw fields in state and validate on a documented boundary such as blur or submit. Derive field errors from the current values, connect them with aria-describedby, and move focus to the first invalid field on submit. Prevent duplicate requests while pending. Keep client validation distinct from server validation and preserve typed input after a server failure.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const name = f.Name.trim(), email = f.Email.trim().toLowerCase(), message = f.Message.trim();\n    if (!name || !/^\\S+@\\S+\\.\\S+$/.test(email) || message.length < 10)\n        throw new Error('Invalid contact details');\n    return { name, email, message };\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Name\": \"\", \"Email\": \"\", \"Message\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Name\", \"Email\", \"Message\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Add server field errors without erasing newer edits made while a request was in flight.\nTopic reference: https://namastedev.com/practice/contact-form\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-contact-form. The TypeScript copy uses a separate scenario ID and attempt history."
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
