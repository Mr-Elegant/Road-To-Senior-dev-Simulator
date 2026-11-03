# Reference: React + TypeScript: Age calculator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate date fields and reject future birthdays. Start with the difference in calendar years, then subtract one when the current month/day is before the birthday. Specify a February-29 birthday policy for non-leap years. Milliseconds divided by a fixed year length are not a reliable calendar-age calculation.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nconst compute = (function compute(f: Record<string, string>) {\n    function parse(s: string) {\n        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(s))\n            throw new Error('Invalid date');\n        const d = new Date(s + 'T00:00:00Z');\n        if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s)\n            throw new Error('Invalid date');\n        return s.split('-').map(Number);\n    }\n    const b = parse(f.Birthday), t = parse(f.Today);\n    if (f.Birthday > f.Today)\n        throw new Error('Invalid date');\n    return t[0] - b[0] - (t[1] < b[1] || t[1] === b[1] && t[2] < b[2] ? 1 : 0);\n});\nexport default function App(): React.JSX.Element {\n    const [fields, setFields] = useState<Record<string, string>>({ \"Birthday\": \"\", \"Today\": \"\" });\n    const [result, setResult] = useState('');\n    const [error, setError] = useState('');\n    function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); try {\n        const value = compute(fields);\n        setResult(JSON.stringify(value));\n        setError('');\n    }\n    catch (reason) {\n        setResult('');\n        setError((reason instanceof Error ? reason.message : String(reason)));\n    } }\n    return <form onSubmit={submit}>{[\"Birthday\", \"Today\"].map(name => <label key={name}>{name}{name === 'Text' || name === 'JSON' ? <textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/> : <input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({ ...old, [name]: event.target.value }))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}\n",
    "architectureNotes": "Follow-up: Show years/months/days with an explicit calendar borrowing policy rather than fixed-duration arithmetic.\nTopic reference: https://namastedev.com/practice/age-calculator\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-age-calculator. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "age-calculator-correctness",
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
    "Show years/months/days with an explicit calendar borrowing policy rather than fixed-duration arithmetic."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Birthday today; birthday tomorrow; year boundary.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "age-calculator-variation",
      "question": "Show years/months/days with an explicit calendar borrowing policy rather than fixed-duration arithmetic.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate date fields and reject future birthdays. Start with the difference in calendar years, then subtract one when the current month/day is before the birthday. Specify a February-29 birthday policy for non-leap years. Milliseconds divided by a fixed year length are not a reliable calendar-age calculation. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
