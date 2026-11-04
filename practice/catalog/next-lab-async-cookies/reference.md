# Reference: Read request cookies on the server

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "next/headers is a server request API, not a client storage library. Whitelist the represented preference instead of copying an arbitrary cookie into classes or HTML. Reading a cookie is separate from permission to mutate it; set cookies in supported mutation contexts before streaming commits headers.",
    "codeOrArtifact": "// Corrected review reference: app/preferences/page.tsx\nimport { cookies } from 'next/headers';\nexport default async function Page(){\n  const theme=(await cookies()).get('theme')?.value==='dark'?'dark':'light';\n  return <p>Preferred theme: {theme}</p>;\n}",
    "architectureNotes": "Verification:\n- Set light, dark and unknown theme cookies and inspect rendered text.\n- Confirm the client bundle contains no next/headers import.\n- Repeat with Cache Components explicitly enabled and add the required runtime boundary.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-async-cookies-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "next/headers is a server request API, not a client storage library. Whitelist the represented preference instead of copying an arbitrary cookie into classes or HTML. Reading a cookie is separate from permission to mutate it; set cookies in supported mutation contexts before streaming commits headers.",
      "weight": 5,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-async-cookies-testing",
      "category": "testing",
      "label": "Evidence and counterexamples",
      "description": "Show the authored boundary cases and distinguish policy-model evidence from real Next.js runtime evidence.",
      "weight": 4,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-async-cookies-security",
      "category": "security",
      "label": "Isolation and trust boundaries",
      "description": "Explain caller validation, data exposure, authorization and the limits relevant to this task.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-async-cookies-tradeoffs",
      "category": "tradeoffs",
      "label": "Versions and operational trade-offs",
      "description": "Explain the 15/16 behavior, configuration assumptions, rollout and the interview variation.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    }
  ],
  "alternatives": [
    "A display preference is not an identity proof. Authentication cookies need integrity, secure attributes, expiry and server-side verification; never trust a role string merely because it arrived in a cookie."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-async-cookies-extension",
      "question": "Should this cookie establish authentication?",
      "expectedConcepts": [
        "Server and client boundaries",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "A display preference is not an identity proof. Authentication cookies need integrity, secure attributes, expiry and server-side verification; never trust a role string merely because it arrived in a cookie."
    }
  ]
}
```
