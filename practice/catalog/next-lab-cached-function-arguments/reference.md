# Reference: Keep request reads outside a shared use cache scope

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A shared cached scope should not read request cookies directly. Extract and authorize runtime identity outside the cache, then pass admitted representation dimensions as arguments. The reference displays a non-sensitive partition label; a cookie string alone must not authorize access to tenant data, and raw session secrets should not become public cache inputs.",
    "codeOrArtifact": "// Corrected review reference: app/products/page.tsx\nimport { Suspense } from 'react';\nimport { cookies } from 'next/headers';\nimport { cacheLife } from 'next/cache';\nasync function CachedCatalog({tenant}:{tenant:string}){'use cache';cacheLife('minutes');return <p>Public catalog partition: {tenant}</p>;}\nasync function TenantCatalog(){const tenant=(await cookies()).get('tenant')?.value||'public';return <CachedCatalog tenant={tenant}/>;}\nexport default function Page(){return <Suspense fallback={<p>Loading tenant catalog</p>}><TenantCatalog/></Suspense>;}",
    "architectureNotes": "Verification:\n- Enable Cache Components and build.\n- Request two admitted tenants and verify partitioned results.\n- Attempt a forged tenant cookie and enforce authorization before replacing the label with real data.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-cached-function-arguments-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A shared cached scope should not read request cookies directly. Extract and authorize runtime identity outside the cache, then pass admitted representation dimensions as arguments. The reference displays a non-sensitive partition label; a cookie string alone must not authorize access to tenant data, and raw session secrets should not become public cache inputs.",
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
      "id": "next-lab-cached-function-arguments-testing",
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
      "id": "next-lab-cached-function-arguments-security",
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
      "id": "next-lab-cached-function-arguments-tradeoffs",
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
    "No. A key partitions representations but does not validate current membership or define entitlement freshness. Apply server authorization before cache access and choose a revocation-compatible lifetime/invalidation strategy."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-cached-function-arguments-extension",
      "question": "Does adding the tenant argument solve revocation?",
      "expectedConcepts": [
        "Cache Components (16)",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. A key partitions representations but does not validate current membership or define entitlement freshness. Apply server authorization before cache access and choose a revocation-compatible lifetime/invalidation strategy."
    }
  ]
}
```
