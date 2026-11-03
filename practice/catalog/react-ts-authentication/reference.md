# Reference: React + TypeScript: Authentication

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Separate the form from session state. A request can transition anonymous to loading and then authenticated or error; stale responses must not overwrite a newer sign-out or account choice. Client UI state is not authorization. A real protected API validates its session on the server, and secrets or pretend token strings should not be stored as a demonstration of security.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    accept?: boolean;\n}\nimport { useState } from 'react';\nexport default function App({ accept = true }: AppProps = {}): React.JSX.Element { const [email, setEmail] = useState(''), [user, setUser] = useState(''), [message, setMessage] = useState('Signed out'); async function signIn() { if (!email.trim()) {\n    setMessage('Email required');\n    return;\n} setMessage('Signing in'); await Promise.resolve(); if (accept) {\n    setUser(email.trim());\n    setMessage('Signed in: ' + email.trim());\n}\nelse\n    setMessage('Sign in failed'); } return <section><label>Email<input aria-label=\"Email\" value={email} onChange={e => setEmail(e.target.value)}/></label>{user ? <button onClick={() => { setUser(''); setMessage('Signed out'); }}>Sign out</button> : <button onClick={signIn}>Sign in</button>}<p data-testid=\"session\">{message}</p></section>; }\n",
    "architectureNotes": "Follow-up: Keep a public screen usable during background session refresh while preserving account isolation.\nTopic reference: https://namastedev.com/practice/authentication\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-authentication. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "authentication-correctness",
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
    "Keep a public screen usable during background session refresh while preserving account isolation."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Pending login; rejection; sign-out during login.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "authentication-variation",
      "question": "Keep a public screen usable during background session refresh while preserving account isolation.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Separate the form from session state. A request can transition anonymous to loading and then authenticated or error; stale responses must not overwrite a newer sign-out or account choice. Client UI state is not authorization. A real protected API validates its session on the server, and secrets or pretend token strings should not be stored as a demonstration of security. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
