# Reference: Terminate a missing resource with notFound

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Missing data is an expected route outcome. notFound terminates the segment and renders its not-found boundary, allowing the type system to narrow the remaining value. Do not swallow framework control-flow exceptions in broad catch blocks. HTTP status behavior must also be checked before versus after streaming starts.",
    "codeOrArtifact": "// Corrected review reference: app/items/[id]/page.tsx\nimport { notFound } from 'next/navigation';\nconst items:Record<string,{title:string}>={one:{title:'First item'}};\nexport default async function Page({params}:{params:Promise<{id:string}>}){\n  const {id}=await params; const item=items[id];\n  if(!item)notFound();\n  return <h1>{item.title}</h1>;\n}",
    "architectureNotes": "Verification:\n- Render an existing item.\n- Request a missing item directly and inspect its body, robots metadata and status.\n- Test a streamed missing subtree separately; do not assert that every streamed response can change its committed status.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-not-found-control-flow-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Missing data is an expected route outcome. notFound terminates the segment and renders its not-found boundary, allowing the type system to narrow the remaining value. Do not swallow framework control-flow exceptions in broad catch blocks. HTTP status behavior must also be checked before versus after streaming starts.",
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
      "id": "next-lab-not-found-control-flow-testing",
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
      "id": "next-lab-not-found-control-flow-security",
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
      "id": "next-lab-not-found-control-flow-tradeoffs",
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
    "Redirect when a known canonical replacement exists and choose permanence deliberately. A login redirect, deleted resource and nonexistent identifier have different semantics; do not turn all failures into a 200 empty page."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-not-found-control-flow-extension",
      "question": "When should a missing item redirect instead?",
      "expectedConcepts": [
        "Rendering and streaming",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Redirect when a known canonical replacement exists and choose permanence deliberately. A login redirect, deleted resource and nonexistent identifier have different semantics; do not turn all failures into a 200 empty page."
    }
  ]
}
```
