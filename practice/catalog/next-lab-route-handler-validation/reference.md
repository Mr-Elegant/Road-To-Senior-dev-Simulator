# Reference: Validate JSON Route Handler requests without leaking exceptions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A TypeScript expectation does not validate an HTTP body. Separate unsupported media, malformed JSON and invalid domain fields, and expose stable client errors rather than server internals. This teaching handler validates and echoes a title; 201 alone does not imply durable persistence.",
    "codeOrArtifact": "// Corrected review reference: app/api/notes/route.ts\nexport async function POST(request:Request){\n if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')return Response.json({error:'Unsupported media type'},{status:415});\n let body:unknown;try{body=await request.json();}catch{return Response.json({error:'Invalid JSON'},{status:400});}\n if(!body||typeof body!=='object'||!('title' in body)||typeof body.title!=='string'||!body.title.trim()||body.title.length>80)return Response.json({error:'Invalid title'},{status:422});\n return Response.json({title:body.title.trim()},{status:201});\n}\n// Add authentication, transport body limits and persistence before treating this echo as a write endpoint.",
    "architectureNotes": "Verification:\n- Send missing/wrong content type, invalid JSON, null and a valid title.\n- Enforce body-size limits at the receiving server/deployment boundary.\n- Add an authenticated persistence integration and verify transaction failures separately.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-route-handler-validation-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A TypeScript expectation does not validate an HTTP body. Separate unsupported media, malformed JSON and invalid domain fields, and expose stable client errors rather than server internals. This teaching handler validates and echoes a title; 201 alone does not imply durable persistence.",
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
      "id": "next-lab-route-handler-validation-testing",
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
      "id": "next-lab-route-handler-validation-security",
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
      "id": "next-lab-route-handler-validation-tradeoffs",
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
    "Publish a schema with status/error shapes and use contract tests. Bound reads before parsing large bodies, and avoid claiming that a Content-Length header alone enforces a trustworthy size limit."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-route-handler-validation-extension",
      "question": "Where should API consumers learn the contract?",
      "expectedConcepts": [
        "Route handlers and APIs",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Publish a schema with status/error shapes and use contract tests. Bound reads before parsing large bodies, and avoid claiming that a Content-Length header alone enforces a trustworthy size limit."
    }
  ]
}
```
