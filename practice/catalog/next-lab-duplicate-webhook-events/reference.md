# Reference: Deduplicate a bounded webhook event batch

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Admit an event ID before admitting another copy in the same batch. A Set preserves insertion order and expresses the local uniqueness rule. It does not protect two server instances or coordinate the event record with the business write.",
    "codeOrArtifact": "function solution({seen,events}){const known=new Set(seen),accepted=[];for(const id of events)if(!known.has(id)){known.add(id);accepted.push(id);}return {accepted,seen:[...known]};}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-duplicate-webhook-events-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {seen,events}, arrays of event ID strings. Return {accepted,seen}; accepted contains each unseen ID once in incoming order; seen contains original IDs once, followed by accepted IDs. This is an in-memory batch policy, not durable exactly-once processing.",
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
      "id": "next-lab-duplicate-webhook-events-testing",
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
      "id": "next-lab-duplicate-webhook-events-security",
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
      "id": "next-lab-duplicate-webhook-events-tradeoffs",
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
    "Verify the signature over raw bytes, then insert a unique provider/event key and perform the business mutation in a transaction or durable workflow. A retry after a crash must observe the stored outcome, not a process-local Set."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-duplicate-webhook-events-extension",
      "question": "How do you implement durable idempotency?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Verify the signature over raw bytes, then insert a unique provider/event key and perform the business mutation in a transaction or durable workflow. A retry after a crash must observe the stored outcome, not a process-local Set."
    }
  ]
}
```
