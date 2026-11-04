# Reference: Keep Pages Router SSR props serializable and public

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Pages Router getServerSideProps runs on the server, but its returned props are delivered to the browser. Use a JSON-serializable explicit DTO and authorize private reads before projecting them. This differs from the richer RSC serialization contract; do not apply one router’s assumptions blindly to the other.",
    "codeOrArtifact": "// Corrected review reference: pages/account.tsx\nimport type { GetServerSideProps,InferGetServerSidePropsType } from 'next';\nexport const getServerSideProps=(async()=>({props:{generatedAt:new Date().toISOString()}})) satisfies GetServerSideProps<{generatedAt:string}>;\nexport default function Page({generatedAt}:InferGetServerSidePropsType<typeof getServerSideProps>){return <p>Generated: {generatedAt}</p>;}",
    "architectureNotes": "Verification:\n- Build and request the Pages route on both supported majors.\n- Inspect the document and data-navigation payload for only generatedAt.\n- Add a real private read and test current actor ownership before returning its DTO.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-pages-ssr-dto-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Pages Router getServerSideProps runs on the server, but its returned props are delivered to the browser. Use a JSON-serializable explicit DTO and authorize private reads before projecting them. This differs from the richer RSC serialization contract; do not apply one router’s assumptions blindly to the other.",
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
      "id": "next-lab-pages-ssr-dto-testing",
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
      "id": "next-lab-pages-ssr-dto-security",
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
      "id": "next-lab-pages-ssr-dto-tradeoffs",
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
    "No. The App Router uses its server rendering/data APIs instead. Migrate the route ownership and data-access boundary deliberately; copying a Pages export into app is not a compatible hybrid."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-pages-ssr-dto-extension",
      "question": "Can getServerSideProps live in app/page.tsx?",
      "expectedConcepts": [
        "Pages Router and migration",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. The App Router uses its server rendering/data APIs instead. Migrate the route ownership and data-access boundary deliberately; copying a Pages export into app is not a compatible hybrid."
    }
  ]
}
```
