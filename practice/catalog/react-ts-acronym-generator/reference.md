# Reference: React + TypeScript: Acronym Generator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize leading/trailing whitespace, split on runs of whitespace, discard empty segments, and take the first code point of each remaining token. Uppercase the result with an explicit locale policy if needed. The result is derived from the phrase, not synchronized through an effect. State whether hyphenated words count as one token or multiple words.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) { return f.Phrase.trim() ? f.Phrase.trim().split(/\\s+/).map((word) => Array.from(word)[0].toUpperCase()).join('') : ''; });\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Phrase\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Phrase\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Offer a configurable stop-word list while retaining a clear preview of which words contributed initials.\nTopic reference: https://namastedev.com/practice/acronym-generator\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-acronym-generator. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "acronym-generator-correctness",
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
    "Offer a configurable stop-word list while retaining a clear preview of which words contributed initials."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Blank phrase; extra spaces; a single word.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "acronym-generator-variation",
      "question": "Offer a configurable stop-word list while retaining a clear preview of which words contributed initials.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize leading/trailing whitespace, split on runs of whitespace, discard empty segments, and take the first code point of each remaining token. Uppercase the result with an explicit locale policy if needed. The result is derived from the phrase, not synchronized through an effect. State whether hyphenated words count as one token or multiple words. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
