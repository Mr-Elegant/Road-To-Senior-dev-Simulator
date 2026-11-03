# Reference: React + TypeScript: URL Validator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Parsing is delegated to the platform URL implementation. A separate protocol and credential policy narrows the accepted parsed values. Both feedback and normalized output are derived from the same input, so a previously valid address cannot remain visible after an invalid edit. No network request is made; server-side URL consumers need their own destination restrictions.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element {\n    const [value, setValue] = useState('');\n    const trimmed = value.trim();\n    let normalized = '';\n    try {\n        const url = new URL(trimmed);\n        if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password)\n            normalized = url.href;\n    }\n    catch { }\n    const feedback = !trimmed ? 'Enter a web address' : normalized ? 'Valid web address' : 'Invalid web address';\n    return <section><label>Website <input value={value} onChange={e => setValue(e.target.value)}/></label>\n    <p data-testid=\"feedback\" role=\"status\">{feedback}</p><output data-testid=\"normalized\">{normalized}</output></section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-web-address. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-web-address-behavior",
      "category": "correctness",
      "label": "Component behavior and boundaries",
      "weight": 5,
      "description": "Use test evidence to explain state transitions, accessible controls, and boundary behavior.",
      "levels": [
        {
          "score": 0,
          "description": "The component is missing or its main interaction fails."
        },
        {
          "score": 1,
          "description": "The happy path works but boundary cases fail."
        },
        {
          "score": 2,
          "description": "All authored cases pass; additional accessibility or edge-case reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "All authored cases pass and the implementation and limitations are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Extract a small pure helper for derived values; keep input state in the component. Extend with a custom hook only when behavior is reused."
  ],
  "commonMistakes": [
    "Accepting any parsed scheme.",
    "Equating a syntactically valid URL with a safe server-side fetch target."
  ],
  "followUps": [
    {
      "id": "url-follow",
      "question": "How would a backend safely fetch a user-supplied URL?",
      "expectedConcepts": [
        "SSRF",
        "Destination validation",
        "Redirects"
      ],
      "sampleStrongAnswer": "Enforce an explicit destination policy on the server, including resolved addresses and redirects, block private or metadata targets where required, and bound connection time, response size, and redirect count. Browser syntax validation provides no SSRF protection."
    }
  ]
}
```
