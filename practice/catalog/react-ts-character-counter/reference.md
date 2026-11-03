# Reference: React + TypeScript: Character Counter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose UTF-16 units, code points, or grapheme clusters explicitly because they produce different answers for emoji and combining marks. For a user-facing text budget, grapheme segmentation is often the desired model when supported. Derive count and remaining budget, and decide whether excess input is rejected or merely reported. Keep announcements restrained during typing.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) { const n = Array.from(f.Text).length; return { count: n, remaining: Math.max(0, 10 - n) }; });\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Text\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Text\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Support separate user-visible grapheme counts and server byte limits without conflating the two.\nTopic reference: https://namastedev.com/practice/character-counter\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-character-counter. The TypeScript copy uses a separate scenario ID and attempt history."
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
