# Reference: Design a Next.js backend-for-frontend with bounded ownership

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use server-owned upstream destinations, validated DTOs, per-operation authorization and explicit timeouts/body limits. Keep reusable business/data logic outside the HTTP adapter so Server Components call it directly when appropriate. Expose stable Route Handler contracts to actual HTTP consumers and map upstream errors into documented response shapes. Propagate cancellation and trace context, apply bounded retries only for safe/idempotent operations, and choose streaming versus buffering intentionally.",
    "architectureNotes": "A client-supplied destination can become SSRF or credential exfiltration. Reject arbitrary hosts/redirect chains, constrain egress at the infrastructure layer, and avoid forwarding authentication headers to untrusted origins.",
    "codeOrArtifact": "# Decision record: Design a Next.js backend-for-frontend with bounded ownership\n\n## Context and scale\nOne Route Handler proxies arbitrary user URLs with server credentials and buffers unlimited responses.\nWeb UI plus mobile/external consumers; three upstream services\n\n## Accepted constraints\n- Expose an explicit admitted API surface.\n- Keep credentials server-side.\n- Bound work and separate public consumer contracts from UI composition.\n\n## Design and ownership\nUse server-owned upstream destinations, validated DTOs, per-operation authorization and explicit timeouts/body limits. Keep reusable business/data logic outside the HTTP adapter so Server Components call it directly when appropriate. Expose stable Route Handler contracts to actual HTTP consumers and map upstream errors into documented response shapes. Propagate cancellation and trace context, apply bounded retries only for safe/idempotent operations, and choose streaming versus buffering intentionally.\n\n## Failure and recovery\nA client-supplied destination can become SSRF or credential exfiltration. Reject arbitrary hosts/redirect chains, constrain egress at the infrastructure layer, and avoid forwarding authentication headers to untrusted origins.\n\n## Verification gates\n- Test malformed, oversized and unauthorized requests.\n- Inject stalls, partial bodies and non-JSON upstream failures.\n- Prove no credential crosses an unauthorized host or appears in client errors.\n\n## Interview change\nShould mobile clients depend on React Flight payloads?\nPrefer a documented stable application API for external clients. Framework transport is not a general version-independent public business contract; separate that boundary from internal UI rendering.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-bff-contract-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Use server-owned upstream destinations, validated DTOs, per-operation authorization and explicit timeouts/body limits. Keep reusable business/data logic outside the HTTP adapter so Server Components call it directly when appropriate. Expose stable Route Handler contracts to actual HTTP consumers and map upstream errors into documented response shapes. Propagate cancellation and trace context, apply bounded retries only for safe/idempotent operations, and choose streaming versus buffering intentionally.",
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
      "id": "next-lab-bff-contract-testing",
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
      "id": "next-lab-bff-contract-security",
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
      "id": "next-lab-bff-contract-tradeoffs",
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
    "Prefer a documented stable application API for external clients. Framework transport is not a general version-independent public business contract; separate that boundary from internal UI rendering."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-bff-contract-extension",
      "question": "Should mobile clients depend on React Flight payloads?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Prefer a documented stable application API for external clients. Framework transport is not a general version-independent public business contract; separate that boundary from internal UI rendering."
    }
  ]
}
```
