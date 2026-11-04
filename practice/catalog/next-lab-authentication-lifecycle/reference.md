# Reference: Design session verification, rotation and account switching

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a server-verified session boundary for privileged reads/actions and a client session state machine distinguishing initial unknown, verified, refreshing and signed-out states. Scope local caches/history by actor identity, cancel or ignore stale responses on account changes, and keep usable public shell/UI mounted during refresh. Prefer secure HTTP-only cookie transport when using cookie sessions and define rotation, expiry and revocation checks. Never treat a cached client session display as authoritative permission to mutate.",
    "architectureNotes": "An old history response can arrive after a second account signs in. Associate each request and merge operation with its initiating actor/version, reject stale ownership and clear private state deliberately on switch.",
    "codeOrArtifact": "# Decision record: Design session verification, rotation and account switching\n\n## Context and scale\nA global client loading gate blocks navigation on every session refresh and briefly shows the previous account’s history.\n100,000 active sessions; shared-device usage and immediate privileged revocation\n\n## Accepted constraints\n- Keep navigation usable during background verification.\n- Prevent cross-account state reuse.\n- Define sensitive-operation revocation semantics.\n\n## Design and ownership\nUse a server-verified session boundary for privileged reads/actions and a client session state machine distinguishing initial unknown, verified, refreshing and signed-out states. Scope local caches/history by actor identity, cancel or ignore stale responses on account changes, and keep usable public shell/UI mounted during refresh. Prefer secure HTTP-only cookie transport when using cookie sessions and define rotation, expiry and revocation checks. Never treat a cached client session display as authoritative permission to mutate.\n\n## Failure and recovery\nAn old history response can arrive after a second account signs in. Associate each request and merge operation with its initiating actor/version, reject stale ownership and clear private state deliberately on switch.\n\n## Verification gates\n- Delay session and history responses while navigating.\n- Switch accounts rapidly and replay late responses.\n- Revoke a privileged session and test real action/data endpoints, not just hidden navigation controls.\n\n## Interview change\nWould storing a JWT in localStorage remove the need to check?\nIt does not solve expiry, revocation, changing entitlements or XSS exposure. Choose the session model against explicit requirements and keep current server authorization regardless of client transport.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-authentication-lifecycle-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Use a server-verified session boundary for privileged reads/actions and a client session state machine distinguishing initial unknown, verified, refreshing and signed-out states. Scope local caches/history by actor identity, cancel or ignore stale responses on account changes, and keep usable public shell/UI mounted during refresh. Prefer secure HTTP-only cookie transport when using cookie sessions and define rotation, expiry and revocation checks. Never treat a cached client session display as authoritative permission to mutate.",
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
      "id": "next-lab-authentication-lifecycle-testing",
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
      "id": "next-lab-authentication-lifecycle-security",
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
      "id": "next-lab-authentication-lifecycle-tradeoffs",
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
    "It does not solve expiry, revocation, changing entitlements or XSS exposure. Choose the session model against explicit requirements and keep current server authorization regardless of client transport."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-authentication-lifecycle-extension",
      "question": "Would storing a JWT in localStorage remove the need to check?",
      "expectedConcepts": [
        "Security architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It does not solve expiry, revocation, changing entitlements or XSS exposure. Choose the session model against explicit requirements and keep current server authorization regardless of client transport."
    }
  ]
}
```
