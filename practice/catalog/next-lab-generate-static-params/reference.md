# Reference: Match generateStaticParams to the dynamic segment

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The returned object keys must match the filesystem’s dynamic segment names. Static param enumeration is a build-time sampling decision; it is not a request-time authorization list or a promise that it is rerun on every revalidation. Dynamic fallback policy depends on the selected rendering model and configuration.",
    "codeOrArtifact": "// Corrected review reference: app/docs/[slug]/page.tsx\nexport function generateStaticParams(){return [{slug:'intro'},{slug:'routing'}];}\nexport default async function Page({params}:{params:Promise<{slug:string}>}){return <h1>{(await params).slug}</h1>;}",
    "architectureNotes": "Verification:\n- Build and inspect generated intro/routing routes.\n- Request a slug outside the list and record the configured behavior.\n- Repeat after changing the source list; distinguish a new build from cache revalidation.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-generate-static-params-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The returned object keys must match the filesystem’s dynamic segment names. Static param enumeration is a build-time sampling decision; it is not a request-time authorization list or a promise that it is rerun on every revalidation. Dynamic fallback policy depends on the selected rendering model and configuration.",
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
      "id": "next-lab-generate-static-params-testing",
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
      "id": "next-lab-generate-static-params-security",
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
      "id": "next-lab-generate-static-params-tradeoffs",
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
    "Prebuild a valuable bounded subset or generate on demand under a supported deployment model. Quantify build time, origin load and first-request latency; do not enumerate unbounded tenant data without a budget."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-generate-static-params-extension",
      "question": "What if the catalog has a million slugs?",
      "expectedConcepts": [
        "App Router foundations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Prebuild a valuable bounded subset or generate on demand under a supported deployment model. Quantify build time, origin load and first-request latency; do not enumerate unbounded tenant data without a budget."
    }
  ]
}
```
