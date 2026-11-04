# Reference: Bound retries by attempts, deadline and idempotency

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Retry eligibility is a conjunction of semantic safety and resource budgets. A network failure after a mutation may mean the server committed; a client key is useful only when the receiving service actually enforces idempotency. Backoff, jitter and Retry-After parsing are outside this model.",
    "codeOrArtifact": "function solution(x){const safe=['GET','HEAD'].includes(x.method)||(typeof x.idempotencyKey==='string'&&x.idempotencyKey.length>0);return safe&&(x.status===429||x.status>=500)&&x.attempt<x.maxAttempts&&x.delayMs<x.remainingMs;}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-retry-budget-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {method,status,attempt,maxAttempts,remainingMs,delayMs,idempotencyKey}. Return retry:true only for GET/HEAD or a nonempty string idempotencyKey, status 429 or >=500, attempt<maxAttempts, and delayMs<remainingMs. Otherwise false. Return a boolean, not a retry schedule.",
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
      "id": "next-lab-retry-budget-testing",
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
      "id": "next-lab-retry-budget-security",
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
      "id": "next-lab-retry-budget-tradeoffs",
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
    "Record an unknown outcome and reconcile using the provider’s idempotency key or status API. Do not treat a timeout as proof of rollback or generate a new key on every retry."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-retry-budget-extension",
      "question": "What if a payment request timed out after committing?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Record an unknown outcome and reconcile using the provider’s idempotency key or status API. Do not treat a timeout as proof of rollback or generate a new key on every retry."
    }
  ]
}
```
