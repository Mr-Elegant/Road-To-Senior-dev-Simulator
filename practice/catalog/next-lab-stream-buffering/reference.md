# Reference: Preserve a streaming response through the deployment proxy

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Converting a stream to text buffers the whole body before sending it. Forward a supported stream and propagate cancellation while keeping its content type and privacy policy explicit. A correct application response can still be buffered by infrastructure, so observe real byte arrival at each hop rather than inferring streaming from the API shape.",
    "codeOrArtifact": "// Corrected review reference: app/api/report/route.ts\nimport { createReportStream } from '@/lib/reports';\nexport async function GET(request:Request){const stream=await createReportStream(request.signal);return new Response(stream,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Accel-Buffering':'no'}});}\n// createReportStream returns a bounded Web ReadableStream and honors cancellation.\n// Configure and verify the actual reverse proxy/CDN; this header is not a universal buffering override.",
    "architectureNotes": "Verification:\n- Use an origin emitting an immediate marker and a delayed marker.\n- Compare first-marker arrival directly and through the deployment proxy.\n- Cancel the client request and verify the upstream stream releases resources.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-stream-buffering-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Converting a stream to text buffers the whole body before sending it. Forward a supported stream and propagate cancellation while keeping its content type and privacy policy explicit. A correct application response can still be buffered by infrastructure, so observe real byte arrival at each hop rather than inferring streaming from the API shape.",
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
      "id": "next-lab-stream-buffering-testing",
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
      "id": "next-lab-stream-buffering-security",
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
      "id": "next-lab-stream-buffering-tradeoffs",
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
    "Once headers are committed, the response cannot simply become a different status. Design an application-level terminal/error representation where appropriate, cancel owned work and record correlated server evidence."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-stream-buffering-extension",
      "question": "Can a late stream error change the HTTP status?",
      "expectedConcepts": [
        "Deployment and runtime",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Once headers are committed, the response cannot simply become a different status. Design an application-level terminal/error representation where appropriate, cancel owned work and record correlated server evidence."
    }
  ]
}
```
