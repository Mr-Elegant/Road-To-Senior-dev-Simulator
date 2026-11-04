# Reference: Validate a Server Action payload before mutation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Server Actions accept untrusted payloads regardless of the client form’s attributes. Parse raw fields, collect stable field errors and only return parsed data after all checks pass. Authorization and transactional persistence remain separate subsequent checks.",
    "codeOrArtifact": "function solution({title,quantity}){const fields=[];const text=typeof title==='string'?title.trim():'';if(!text||text.length>80)fields.push('title');const n=typeof quantity==='string'&&/^\\d+$/.test(quantity)?Number(quantity):0;if(n<1||n>999)fields.push('quantity');return fields.length?{ok:false,fields}:{ok:true,title:text,quantity:n};}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-action-field-validation-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {title,quantity}; title and quantity are raw unknown values. Title must be a trimmed nonempty string <=80 characters. Quantity must be a digit string representing 1..999. Return {ok:true,title,quantity:number} or {ok:false,fields:[...]} with title then quantity errors.",
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
      "id": "next-lab-action-field-validation-testing",
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
      "id": "next-lab-action-field-validation-security",
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
      "id": "next-lab-action-field-validation-tradeoffs",
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
    "FormData entries may be Files and keys may repeat. Extract admitted scalar fields deliberately, reject duplicates when relevant, and map validation results into a serializable action state."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-action-field-validation-extension",
      "question": "What changes when the input is FormData?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "FormData entries may be Files and keys may repeat. Extract admitted scalar fields deliberately, reject duplicates when relevant, and map validation results into a serializable action state."
    }
  ]
}
```
