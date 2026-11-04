# Reference: Authenticate draft-mode activation and constrain its destination

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Draft mode changes the rendering/data-view context and must be granted only after verifying the CMS preview request. The integration returns a server-owned admitted internal destination, not an arbitrary redirect parameter. Keep draft content and its cache policy separate from public published representations.",
    "codeOrArtifact": "// Corrected review reference: app/api/draft/route.ts\nimport { draftMode } from 'next/headers';\nimport { redirect } from 'next/navigation';\nimport { verifyPreviewRequest } from '@/lib/cms-preview';\nexport async function GET(request:Request){const preview=await verifyPreviewRequest(request);if(!preview)return new Response('Unauthorized',{status:401});(await draftMode()).enable();redirect(preview.canonicalInternalPath);}",
    "architectureNotes": "Verification:\n- Reject invalid and expired preview credentials.\n- Try an external return destination and a missing draft.\n- Verify draft cookies, public isolation and explicit disable/exit behavior.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-draft-mode-entry-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Draft mode changes the rendering/data-view context and must be granted only after verifying the CMS preview request. The integration returns a server-owned admitted internal destination, not an arbitrary redirect parameter. Keep draft content and its cache policy separate from public published representations.",
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
      "id": "next-lab-draft-mode-entry-testing",
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
      "id": "next-lab-draft-mode-entry-security",
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
      "id": "next-lab-draft-mode-entry-tradeoffs",
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
    "Define expiry, replay and actor authorization appropriate to the CMS workflow. Do not assume a long-lived secret query parameter safely represents the current user’s permission to every draft."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-draft-mode-entry-extension",
      "question": "What if the preview link is forwarded?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Define expiry, replay and actor authorization appropriate to the CMS workflow. Do not assume a long-lived secret query parameter safely represents the current user’s permission to every draft."
    }
  ]
}
```
