# Reference: Verify a webhook signature over its original bytes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Parsing and reserializing JSON can change the signed byte sequence. Verify the provider’s documented signature over the admitted raw body before processing the event. Signature validity does not supply durable idempotency, ordering or atomicity; those are explicit responsibilities of the commit boundary.",
    "codeOrArtifact": "// Corrected review reference: app/api/webhooks/route.ts\nimport { verifyProviderSignature,commitEventOnce } from '@/lib/webhooks';\nexport async function POST(request:Request){\n const raw=await request.text();const signature=request.headers.get('provider-signature');\n const event=await verifyProviderSignature(raw,signature);\n if(!event)return Response.json({error:'Invalid signature'},{status:401});\n await commitEventOnce(event);return Response.json({ok:true});\n}\n// The provider adapter enforces its timestamp/replay rules; commitEventOnce uses durable uniqueness with the business write.",
    "architectureNotes": "Verification:\n- Use the provider SDK/test vector to verify exact body bytes.\n- Reject changed bytes, invalid signatures and out-of-window timestamps.\n- Deliver the same event concurrently and crash between receipt and business mutation.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-webhook-raw-body-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Parsing and reserializing JSON can change the signed byte sequence. Verify the provider’s documented signature over the admitted raw body before processing the event. Signature validity does not supply durable idempotency, ordering or atomicity; those are explicit responsibilities of the commit boundary.",
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
      "id": "next-lab-webhook-raw-body-testing",
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
      "id": "next-lab-webhook-raw-body-security",
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
      "id": "next-lab-webhook-raw-body-tradeoffs",
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
    "Only if a durable queue/outbox has accepted responsibility. A process-local promise after returning 200 can lose the event on shutdown; a provider may stop retrying after that acknowledgement."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-webhook-raw-body-extension",
      "question": "Can you acknowledge before durable admission?",
      "expectedConcepts": [
        "Route handlers and APIs",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Only if a durable queue/outbox has accepted responsibility. A process-local promise after returning 200 can lose the event on shutdown; a provider may stop retrying after that acknowledgement."
    }
  ]
}
```
