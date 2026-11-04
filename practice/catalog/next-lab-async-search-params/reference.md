# Reference: Read and validate server searchParams

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A query parameter can be missing or repeated, and reading it can require request-time rendering. Narrow the scalar input before using string methods. HTML escaping by React protects text rendering; it does not authorize a database query or validate every domain constraint.",
    "codeOrArtifact": "// Corrected review reference: app/search/page.tsx\ntype Query = Record<string,string|string[]|undefined>;\nexport default async function Page({searchParams}: {searchParams:Promise<Query>}) {\n  const query=await searchParams;\n  const term=typeof query.q==='string'?query.q.trim():'';\n  return <h1>{term ? 'Results for '+term : 'Enter a search term'}</h1>;\n}",
    "architectureNotes": "Verification:\n- Request no q, q=books and repeated q values.\n- Build with the promised route-prop type.\n- Verify hostile text renders as text rather than executable HTML.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-async-search-params-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A query parameter can be missing or repeated, and reading it can require request-time rendering. Narrow the scalar input before using string methods. HTML escaping by React protects text rendering; it does not authorize a database query or validate every domain constraint.",
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
      "id": "next-lab-async-search-params-testing",
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
      "id": "next-lab-async-search-params-security",
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
      "id": "next-lab-async-search-params-tradeoffs",
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
    "Separate request-dependent results from the static shell and use a deliberate Suspense boundary when using Cache Components. Cache public results only with keys that include all admitted search/filter dimensions."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-async-search-params-extension",
      "question": "How do you retain a cacheable search shell?",
      "expectedConcepts": [
        "Routing and URL state",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Separate request-dependent results from the static shell and use a deliberate Suspense boundary when using Cache Components. Cache public results only with keys that include all admitted search/filter dimensions."
    }
  ]
}
```
