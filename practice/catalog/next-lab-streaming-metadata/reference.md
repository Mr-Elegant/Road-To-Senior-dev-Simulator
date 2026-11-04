# Reference: Diagnose slow metadata without forcing every page fully dynamic

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Remove artificial or redundant work and share an admitted data function. Metadata delivery and blocking can depend on bot classification and framework version; the same direct browser navigation is not a complete crawler test. A persistent cache, request memoization and streaming behavior are separate decisions.",
    "codeOrArtifact": "// Corrected review reference: app/products/[id]/page.tsx\nimport { getPublicProduct } from '@/lib/public-product';\nexport async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const product=await getPublicProduct(id);return {title:product.title,description:product.summary};}\nexport default async function Page({params}:{params:Promise<{id:string}>}){const product=await getPublicProduct((await params).id);return <h1>{product.title}</h1>;}",
    "architectureNotes": "Verification:\n- Compare a browser and representative documented HTML-limited bot user agents.\n- Inspect title/description presence and timing on the actual production server.\n- Count shared product reads and test origin failure.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-streaming-metadata-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Remove artificial or redundant work and share an admitted data function. Metadata delivery and blocking can depend on bot classification and framework version; the same direct browser navigation is not a complete crawler test. A persistent cache, request memoization and streaming behavior are separate decisions.",
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
      "id": "next-lab-streaming-metadata-testing",
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
      "id": "next-lab-streaming-metadata-security",
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
      "id": "next-lab-streaming-metadata-tradeoffs",
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
    "It can change metadata behavior for many crawlers and should not be a reflex latency fix. Verify the crawler requirement and official matching behavior, then change the narrowest necessary policy."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-streaming-metadata-extension",
      "question": "Would a broad htmlLimitedBots override help?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "It can change metadata behavior for many crawlers and should not be a reflex latency fix. Verify the crawler requirement and official matching behavior, then change the narrowest necessary policy."
    }
  ]
}
```
