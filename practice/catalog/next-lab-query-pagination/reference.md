# Reference: Normalize searchParams pagination without coercion surprises

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Parse the raw URL representation before numeric conversion. A duplicated query parameter is not a scalar, and an empty string must not become zero. Clamp admitted integers once and derive the offset from the same normalized values.",
    "codeOrArtifact": "function solution({page,size}) { const parse=(v,f,max)=>typeof v==='string'&&/^\\d+$/.test(v)?Math.max(1,Math.min(max,Number(v))):f; const p=parse(page,1,10000), s=parse(size,20,100); return {page:p,size:s,offset:(p-1)*s}; }",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-query-pagination-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {page,size} contains strings, arrays or missing values. Accept decimal digit strings only. Page defaults to 1 and clamps to 1..10000; size defaults to 20 and clamps to 1..100. Arrays are invalid. Return {page,size,offset:(page-1)*size}.",
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
      "id": "next-lab-query-pagination-testing",
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
      "id": "next-lab-query-pagination-security",
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
      "id": "next-lab-query-pagination-tradeoffs",
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
    "Use an opaque validated cursor tied to a stable sort and tenant/filter scope. Do not multiply a cursor by page size. Specify token expiry, deleted rows and tie-break ordering before replacing the offset query."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-query-pagination-extension",
      "question": "How would cursor pagination change this contract?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Use an opaque validated cursor tied to a stable sort and tenant/filter scope. Do not multiply a cursor by page size. Specify token expiry, deleted rows and tie-break ordering before replacing the offset query."
    }
  ]
}
```
