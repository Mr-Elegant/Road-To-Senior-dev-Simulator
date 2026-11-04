# Reference: Design an auditable RSC data-exposure boundary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Mark server data modules server-only and define explicit public/actor-scoped DTO projections near the data-access boundary. Authorize before fetching or projecting, then send only values required by the rendered representation. Review children, action results, metadata, errors and RSC payloads as exposure channels. Treat server-only and optional taint mechanisms as guardrails, not substitutes for projection and object authorization. Log redacted identifiers and versioned policy decisions, not raw records.",
    "architectureNotes": "A future database column can silently leak if a DTO spreads a record. Use allowlist construction and a sensitive-field regression fixture; never rely on the client ignoring fields or on collapsed UI hiding serialized content.",
    "codeOrArtifact": "# Decision record: Design an auditable RSC data-exposure boundary\n\n## Context and scale\nDevelopers assume that anything computed in a Server Component cannot reach a browser.\nA regulated portal with internal account records and public client islands\n\n## Accepted constraints\n- Prevent sensitive props and errors from crossing the boundary.\n- Centralize authorized data access.\n- Provide reviewable DTO contracts and regression evidence.\n\n## Design and ownership\nMark server data modules server-only and define explicit public/actor-scoped DTO projections near the data-access boundary. Authorize before fetching or projecting, then send only values required by the rendered representation. Review children, action results, metadata, errors and RSC payloads as exposure channels. Treat server-only and optional taint mechanisms as guardrails, not substitutes for projection and object authorization. Log redacted identifiers and versioned policy decisions, not raw records.\n\n## Failure and recovery\nA future database column can silently leak if a DTO spreads a record. Use allowlist construction and a sensitive-field regression fixture; never rely on the client ignoring fields or on collapsed UI hiding serialized content.\n\n## Verification gates\n- Insert sentinel secrets and inspect HTML, RSC, script chunks and action responses.\n- Test different actors against the same resource ID.\n- Fail a server read and verify production error redaction.\n\n## Interview change\nWould encryption of transport eliminate the risk?\nTLS protects transport against intermediaries; the authorized browser is still the receiver. Encrypting or hiding framework payload syntax does not authorize delivering secrets to that receiver.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-rsc-data-boundary-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Mark server data modules server-only and define explicit public/actor-scoped DTO projections near the data-access boundary. Authorize before fetching or projecting, then send only values required by the rendered representation. Review children, action results, metadata, errors and RSC payloads as exposure channels. Treat server-only and optional taint mechanisms as guardrails, not substitutes for projection and object authorization. Log redacted identifiers and versioned policy decisions, not raw records.",
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
      "id": "next-lab-rsc-data-boundary-testing",
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
      "id": "next-lab-rsc-data-boundary-security",
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
      "id": "next-lab-rsc-data-boundary-tradeoffs",
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
    "TLS protects transport against intermediaries; the authorized browser is still the receiver. Encrypting or hiding framework payload syntax does not authorize delivering secrets to that receiver."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-rsc-data-boundary-extension",
      "question": "Would encryption of transport eliminate the risk?",
      "expectedConcepts": [
        "Security architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "TLS protects transport against intermediaries; the authorized browser is still the receiver. Encrypting or hiding framework payload syntax does not authorize delivering secrets to that receiver."
    }
  ]
}
```
