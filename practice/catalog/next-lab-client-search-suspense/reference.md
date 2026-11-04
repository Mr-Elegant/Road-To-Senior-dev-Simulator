# Reference: Contain a client useSearchParams read with Suspense

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A development render can mask the production behavior of a static route with a client search-parameter read. Put the client subtree behind a deliberate Suspense boundary so the surrounding page can retain its rendering strategy. If the requirement is a request-time page, make that choice explicitly instead of accidentally bailing out the entire shell.",
    "codeOrArtifact": "// Corrected review reference: app/search/page.tsx\nimport { Suspense } from 'react';\nimport Search from './search-client';\nexport default function Page(){return <><h1>Search</h1><Suspense fallback={<p>Reading query…</p>}><Search/></Suspense></>;}",
    "architectureNotes": "Verification:\n- Implement the documented client hook and run a production build.\n- Request with and without a query string.\n- Check that the heading remains meaningful during the fallback and no unintended full-page client bailout occurs.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-client-search-suspense-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A development render can mask the production behavior of a static route with a client search-parameter read. Put the client subtree behind a deliberate Suspense boundary so the surrounding page can retain its rendering strategy. If the requirement is a request-time page, make that choice explicitly instead of accidentally bailing out the entire shell.",
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
      "id": "next-lab-client-search-suspense-testing",
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
      "id": "next-lab-client-search-suspense-security",
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
      "id": "next-lab-client-search-suspense-tradeoffs",
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
    "Yes, if server-owned query-dependent rendering is desired. Await the page prop and pass admitted data into the client island, while documenting the request-time rendering and cache implications."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-client-search-suspense-extension",
      "question": "Could the page read searchParams on the server instead?",
      "expectedConcepts": [
        "Routing and URL state",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Yes, if server-owned query-dependent rendering is desired. Await the page prop and pass admitted data into the client island, while documenting the request-time rendering and cache implications."
    }
  ]
}
```
