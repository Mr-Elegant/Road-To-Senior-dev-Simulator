# Reference: React + TypeScript: User profile

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Accept a profile object rather than mixing fetch logic into a presentational card. Show a useful fallback for a missing avatar or optional bio and use meaningful image alternative text. If fetching is required, keep pending/error/success states explicit and ignore stale account responses. Never infer authorization from a displayed profile ID.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    profile?: {\n        name: string;\n        email?: string;\n        bio?: string;\n        avatar?: string;\n    };\n}\nexport default function App({ profile }: AppProps = {}): React.JSX.Element { if (!profile)\n    return <p>Profile unavailable</p>; return <section><h1>{profile.name}</h1>{profile.avatar ? <img src={profile.avatar} alt={profile.name}/> : <span data-testid=\"avatar-fallback\">{Array.from(profile.name)[0]?.toUpperCase() || '?'}</span>}<p data-testid=\"bio\">{profile.bio || 'No biography'}</p></section>; }\n",
    "architectureNotes": "Follow-up: Separate public profile fields from account-private details using a server-defined response contract.\nTopic reference: https://namastedev.com/practice/user-profile\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-user-profile. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "user-profile-correctness",
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
    "Separate public profile fields from account-private details using a server-defined response contract."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Missing avatar; empty bio; long name.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "user-profile-variation",
      "question": "Separate public profile fields from account-private details using a server-defined response contract.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Accept a profile object rather than mixing fetch logic into a presentational card. Show a useful fallback for a missing avatar or optional bio and use meaningful image alternative text. If fetching is required, keep pending/error/success states explicit and ignore stale account responses. Never infer authorization from a displayed profile ID. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
