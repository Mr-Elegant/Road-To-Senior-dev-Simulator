# Reference: Authorize tenant-scoped resource operations

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Authentication, tenant membership and operation capability are separate gates. Default-deny unknown operations. Resolve the resource’s tenant from trusted server data rather than accepting the client’s tenant assertion as proof of ownership.",
    "codeOrArtifact": "function solution({session,tenant,operation}){if(!session)return 'unauthenticated';if(session.tenant!==tenant)return 'forbidden';const roles={read:['viewer','editor','admin'],write:['editor','admin'],delete:['admin']};const allowed=Object.hasOwn(roles,operation)?roles[operation]:[];return allowed.includes(session.role)?'allowed':'forbidden';}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-authorization-matrix-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {session,tenant,operation}. session is null or {tenant,role}; role is viewer, editor or admin. Return unauthenticated when null, forbidden when tenant differs, or when operation is not read/write/delete. read admits all three roles, write editor/admin, delete admin; return allowed or forbidden.",
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
      "id": "next-lab-authorization-matrix-testing",
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
      "id": "next-lab-authorization-matrix-security",
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
      "id": "next-lab-authorization-matrix-tradeoffs",
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
    "At every read/mutation entry point near the data-access layer, including Server Actions and Route Handlers. Proxy can improve navigation but cannot replace object-level authorization or protect an excluded action path."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-authorization-matrix-extension",
      "question": "Where should this policy run when Proxy already checks a session?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "At every read/mutation entry point near the data-access layer, including Server Actions and Route Handlers. Proxy can improve navigation but cannot replace object-level authorization or protect an excluded action path."
    }
  ]
}
```
