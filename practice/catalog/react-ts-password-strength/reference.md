# Reference: React + TypeScript: Password Strength

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The password is the single source of truth. Four booleans produce a numeric score during rendering, so deletion cannot leave a stale strength value. A labelled password input conceals the text and a status region announces feedback. A real password policy also considers breached-password screening and server validation; this exercise does not estimate entropy.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element {\n    const [password, setPassword] = useState('');\n    const score = [password.length >= 10, /[a-z]/.test(password) && /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length;\n    const feedback = !password ? 'Start typing' : score < 2 ? 'Weak' : score < 4 ? 'Fair' : 'Strong';\n    return <section><label>Password <input type=\"password\" value={password} onChange={e => setPassword(e.target.value)}/></label>\n    <p data-testid=\"feedback\" role=\"status\">{feedback}</p><output data-testid=\"passed-rules\">{score}</output></section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-password-feedback. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-password-feedback-behavior",
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
    "Saving derived score independently and forgetting to update it on deletion.",
    "Logging or persisting a password while debugging."
  ],
  "followUps": [
    {
      "id": "pw-follow",
      "question": "Would this replace server-side password validation?",
      "expectedConcepts": [
        "Untrusted client",
        "Server policy",
        "Breached credentials"
      ],
      "sampleStrongAnswer": "No. Client feedback helps usability but is bypassable. The server enforces the policy and handles credentials securely; avoid treating a checklist score as proof that a password is safe."
    }
  ]
}
```
