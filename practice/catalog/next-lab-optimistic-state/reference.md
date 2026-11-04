# Reference: Keep optimistic presentation separate from authoritative state

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "React owns the DOM, so mutating innerHTML bypasses reconciliation and injects untrusted text. Optimistic state is a temporary projection over authoritative props; use a transition/action context and reconcile success or failure. Temporary rows use unique IDs so identical concurrent drafts do not collide; durable identity and retry behavior still belong to the server contract.",
    "codeOrArtifact": "// Corrected review reference: app/messages.tsx\n'use client';\nimport { useOptimistic } from 'react';\ntype Message={id:string;text:string;pending?:boolean};\nexport default function Messages({messages,send}:{messages:Message[];send:(data:FormData)=>Promise<void>}){\n const [visible,add]=useOptimistic(messages,(state:Message[],item:Message)=>[...state,{...item,pending:true}]);\n return <><ul>{visible.map(item=><li key={item.id}>{item.text}{item.pending?' (sending)':''}</li>)}</ul><form action={async data=>{add({id:'pending:'+crypto.randomUUID(),text:String(data.get('text')||'')});await send(data);}}><input name=\"text\"/><button>Send</button></form></>;\n}\n// send must be a Server Action. Temporary IDs identify concurrent optimistic rows; durable idempotency belongs on the server.",
    "architectureNotes": "Verification:\n- Send a successful message and reconcile server props.\n- Reject a send and verify the temporary result is not treated as durable.\n- Admit identical concurrent messages with distinct operation IDs before using the pattern in production.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-optimistic-state-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "React owns the DOM, so mutating innerHTML bypasses reconciliation and injects untrusted text. Optimistic state is a temporary projection over authoritative props; use a transition/action context and reconcile success or failure. Temporary rows use unique IDs so identical concurrent drafts do not collide; durable identity and retry behavior still belong to the server contract.",
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
      "id": "next-lab-optimistic-state-testing",
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
      "id": "next-lab-optimistic-state-security",
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
      "id": "next-lab-optimistic-state-tradeoffs",
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
    "Model draft/error state separately from the optimistic projection. Associate an operation ID with the retry policy and avoid appending the same authoritative message twice when the original result arrives late."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-optimistic-state-extension",
      "question": "How do you preserve a failed draft for retry?",
      "expectedConcepts": [
        "Mutations and forms",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Model draft/error state separately from the optimistic projection. Associate an operation ID with the retry policy and avoid appending the same authoritative message twice when the original result arrives late."
    }
  ]
}
```
