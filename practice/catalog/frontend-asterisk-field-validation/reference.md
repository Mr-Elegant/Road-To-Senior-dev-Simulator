# Reference: Frontend: Asterisk Field Validation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use required attributes and visible labels; an asterisk alone does not explain a requirement. Include a form-level legend that defines the symbol and associate field errors with their controls. Validate normalized values so whitespace does not satisfy a required text field. Keep the server as the final authority and preserve user input on failure.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const name = f.Name.trim(), email = f.Email.trim(), note = f.Note.trim(); if (!name || !/^\\S+@\\S+\\.\\S+$/.test(email))\n        throw new Error('Required fields invalid'); return { name, email, note }; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Name\":\"\",\"Email\":\"\",\"Note\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Name\",\"Email\",\"Note\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Support conditional requirements without leaving hidden fields invalid or unreachable.\nTopic reference: https://namastedev.com/practice/asterisk-field-validation\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "asterisk-field-validation-correctness",
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
    "Support conditional requirements without leaving hidden fields invalid or unreachable."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Whitespace-only value; missing required field; optional blank field.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "asterisk-field-validation-variation",
      "question": "Support conditional requirements without leaving hidden fields invalid or unreachable.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use required attributes and visible labels; an asterisk alone does not explain a requirement. Include a form-level legend that defines the symbol and associate field errors with their controls. Validate normalized values so whitespace does not satisfy a required text field. Keep the server as the final authority and preserve user input on failure. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
