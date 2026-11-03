# Reference: React + TypeScript: Asterisk Field Validation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use required attributes and visible labels; an asterisk alone does not explain a requirement. Include a form-level legend that defines the symbol and associate field errors with their controls. Validate normalized values so whitespace does not satisfy a required text field. Keep the server as the final authority and preserve user input on failure.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    const name = f.Name.trim(), email = f.Email.trim(), note = f.Note.trim();\n    if (!name || !/^\\S+@\\S+\\.\\S+$/.test(email))\n        throw new Error('Required fields invalid');\n    return { name, email, note };\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Name\": \"\", \"Email\": \"\", \"Note\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Name\", \"Email\", \"Note\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Support conditional requirements without leaving hidden fields invalid or unreachable.\nTopic reference: https://namastedev.com/practice/asterisk-field-validation\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-asterisk-field-validation. The TypeScript copy uses a separate scenario ID and attempt history."
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
