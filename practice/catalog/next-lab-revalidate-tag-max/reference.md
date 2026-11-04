# Reference: Choose stale-while-revalidate rather than accidental immediate expiry

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Invalidate after the authoritative write commits and choose the consistency contract deliberately. max marks tagged content stale so a later visit can serve stale content while refreshing. It is not a promise that the author immediately sees the just-written representation or that the entire site is eagerly regenerated.",
    "codeOrArtifact": "// Corrected review reference: app/actions.ts\n'use server';\nimport { revalidateTag } from 'next/cache';\nimport { authorizePublisher,commitPost } from '@/lib/posts';\nexport async function publish(){await authorizePublisher();await commitPost();revalidateTag('public-posts','max');}",
    "architectureNotes": "Verification:\n- Authenticate a publisher and commit an observable versioned record.\n- Verify a later visitor can trigger background refresh under the selected profile.\n- Prove failed writes do not invalidate or announce a published result.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-revalidate-tag-max-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Invalidate after the authoritative write commits and choose the consistency contract deliberately. max marks tagged content stale so a later visit can serve stale content while refreshing. It is not a promise that the author immediately sees the just-written representation or that the entire site is eagerly regenerated.",
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
      "id": "next-lab-revalidate-tag-max-testing",
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
      "id": "next-lab-revalidate-tag-max-security",
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
      "id": "next-lab-revalidate-tag-max-tradeoffs",
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
    "In a 16 Server Action, consider updateTag for read-your-own-writes and test the next read. In other contexts use the appropriate documented revalidation profile and a product-specific consistency strategy."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-revalidate-tag-max-extension",
      "question": "What if the actor must immediately see the new post?",
      "expectedConcepts": [
        "Caching and revalidation",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "In a 16 Server Action, consider updateTag for read-your-own-writes and test the next read. In other contexts use the appropriate documented revalidation profile and a product-specific consistency strategy."
    }
  ]
}
```
