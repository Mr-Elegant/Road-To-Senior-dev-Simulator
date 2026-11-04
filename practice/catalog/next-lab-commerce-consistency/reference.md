# Reference: Separate a cached storefront from authoritative checkout

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Serve public catalog content under a measured caching policy while treating displayed availability as advisory. Route checkout through authenticated server admission, atomic inventory reservations, idempotent order creation and a durable payment workflow. Keep the database transaction short; persist a reservation and outbox before external calls. Model ambiguous remote outcomes as pending/unknown and reconcile using stable provider idempotency keys. Invalidate public representations after authoritative state transitions, without using cache freshness as a stock lock.",
    "architectureNotes": "The payment provider may commit a charge before the response times out. Do not release stock or create a second charge solely because the HTTP call failed; reconcile the stored order/payment attempt and handle reservation expiry with a defined compensation policy.",
    "codeOrArtifact": "# Decision record: Separate a cached storefront from authoritative checkout\n\n## Context and scale\nA fast cached product page is being used as proof that an item is still available when payment begins.\n50,000 visitors/minute during a launch; inventory must never go negative\n\n## Accepted constraints\n- Keep product browsing fast.\n- Reserve stock atomically with bounded expiry.\n- Handle payment timeouts without duplicate charges.\n\n## Design and ownership\nServe public catalog content under a measured caching policy while treating displayed availability as advisory. Route checkout through authenticated server admission, atomic inventory reservations, idempotent order creation and a durable payment workflow. Keep the database transaction short; persist a reservation and outbox before external calls. Model ambiguous remote outcomes as pending/unknown and reconcile using stable provider idempotency keys. Invalidate public representations after authoritative state transitions, without using cache freshness as a stock lock.\n\n## Failure and recovery\nThe payment provider may commit a charge before the response times out. Do not release stock or create a second charge solely because the HTTP call failed; reconcile the stored order/payment attempt and handle reservation expiry with a defined compensation policy.\n\n## Verification gates\n- Race many buyers for the last unit in real database integration tests.\n- Crash between reservation, outbox delivery and provider response.\n- Replay provider webhooks and verify exactly-once business effects through constraints, not process memory.\n\n## Interview change\nCan optimistic UI mark the order paid?\nIt can show a pending interaction, but paid must come from an authoritative confirmed transition. Client optimism, Next.js revalidation and a disabled button cannot establish a financial outcome.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-commerce-consistency-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Serve public catalog content under a measured caching policy while treating displayed availability as advisory. Route checkout through authenticated server admission, atomic inventory reservations, idempotent order creation and a durable payment workflow. Keep the database transaction short; persist a reservation and outbox before external calls. Model ambiguous remote outcomes as pending/unknown and reconcile using stable provider idempotency keys. Invalidate public representations after authoritative state transitions, without using cache freshness as a stock lock.",
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
      "id": "next-lab-commerce-consistency-testing",
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
      "id": "next-lab-commerce-consistency-security",
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
      "id": "next-lab-commerce-consistency-tradeoffs",
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
    "It can show a pending interaction, but paid must come from an authoritative confirmed transition. Client optimism, Next.js revalidation and a disabled button cannot establish a financial outcome."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-commerce-consistency-extension",
      "question": "Can optimistic UI mark the order paid?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It can show a pending interaction, but paid must come from an authoritative confirmed transition. Client optimism, Next.js revalidation and a disabled button cannot establish a financial outcome."
    }
  ]
}
```
