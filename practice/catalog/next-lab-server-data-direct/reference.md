# Reference: Remove the Server Component HTTP round trip to its own API

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A Server Component can call a server data-access function directly. Its own Route Handler adds transport latency, deployment-origin assumptions and a failure mode during build when no application server exists. Keep Route Handlers for external HTTP consumers and reuse the underlying authorized data layer.",
    "codeOrArtifact": "// Corrected review reference: app/products/page.tsx\nimport { listPublicProducts } from '@/lib/products';\nexport default async function Page(){const products=await listPublicProducts();return <ul>{products.map(product=><li key={product.id}>{product.name}</li>)}</ul>;}\n// lib/products is server-only and returns an allowlisted public product DTO.",
    "architectureNotes": "Verification:\n- Build without a localhost server listening.\n- Verify external API consumers still use their Route Handler contract.\n- Inspect the page payload for only the admitted public product fields.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-server-data-direct-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A Server Component can call a server data-access function directly. Its own Route Handler adds transport latency, deployment-origin assumptions and a failure mode during build when no application server exists. Keep Route Handlers for external HTTP consumers and reuse the underlying authorized data layer.",
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
      "id": "next-lab-server-data-direct-testing",
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
      "id": "next-lab-server-data-direct-security",
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
      "id": "next-lab-server-data-direct-tradeoffs",
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
    "When the dependency is genuinely a separate service with an HTTP contract. Bound its timeout, caching, credentials and failure policy; do not confuse that service call with an unnecessary loopback to the same application."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-server-data-direct-extension",
      "question": "When is an HTTP call from a Server Component appropriate?",
      "expectedConcepts": [
        "Data fetching",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "When the dependency is genuinely a separate service with an HTTP contract. Bound its timeout, caching, credentials and failure policy; do not confuse that service call with an unnecessary loopback to the same application."
    }
  ]
}
```
