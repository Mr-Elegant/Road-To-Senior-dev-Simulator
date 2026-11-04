# Reference: Use after for bounded telemetry rather than durable fulfillment

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "after schedules supported post-response work within platform limits; it is not a durable job queue with transactional acknowledgement and retry. Persist the order’s pending state and outbox atomically before accepting responsibility. Never announce payment success before its authoritative outcome is known.",
    "codeOrArtifact": "// Corrected review reference: app/api/orders/route.ts\nimport { after } from 'next/server';\nimport { createPendingOrderAndOutbox } from '@/lib/orders';\nimport { recordMetric } from '@/lib/metrics';\nexport async function POST(request:Request){const order=await createPendingOrderAndOutbox(request);after(()=>recordMetric('order.accepted'));return Response.json({id:order.id,status:'pending'},{status:202});}",
    "architectureNotes": "Verification:\n- Crash the request process after transaction commit and before worker delivery.\n- Replay the worker operation and verify receiver-enforced idempotency.\n- Verify telemetry failure cannot incorrectly mark an order paid or lose its durable event.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-after-not-a-queue-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "after schedules supported post-response work within platform limits; it is not a durable job queue with transactional acknowledgement and retry. Persist the order’s pending state and outbox atomically before accepting responsibility. Never announce payment success before its authoritative outcome is known.",
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
      "id": "next-lab-after-not-a-queue-testing",
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
      "id": "next-lab-after-not-a-queue-security",
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
      "id": "next-lab-after-not-a-queue-tradeoffs",
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
    "Check the specific minor version: it became stable during the 15 line. The curriculum assumes a patched maintenance release, not every historical 15.0 behavior. Platform duration and lifecycle limits still apply."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-after-not-a-queue-extension",
      "question": "Was after always a stable API in 15?",
      "expectedConcepts": [
        "Testing and operations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Check the specific minor version: it became stable during the 15 line. The curriculum assumes a patched maintenance release, not every historical 15.0 behavior. Platform duration and lifecycle limits still apply."
    }
  ]
}
```
