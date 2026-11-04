# Reference: Bound an upstream request and propagate failure deliberately

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A server timeout budget must include the upstream dependency instead of waiting until the platform kills the whole invocation. Check HTTP failures separately from transport failures and clear owned timers. The reference deliberately returns a stable failure body; a richer contract can distinguish abort from other network errors.",
    "codeOrArtifact": "// Corrected review reference: app/api/status/route.ts\nexport async function GET(){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),1500);try{const response=await fetch('https://status.example.com/public',{signal:controller.signal,cache:'no-store'});if(!response.ok)return Response.json({error:'Upstream unavailable'},{status:502});return Response.json(await response.json(),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Upstream unavailable'},{status:504});}finally{clearTimeout(timer);}}",
    "architectureNotes": "Verification:\n- Use a controlled origin returning success, 500 and a stalled body.\n- Verify the deadline frees request-owned resources.\n- Test caller cancellation and combine it with the deadline where the supported runtime permits.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-bounded-upstream-fetch-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A server timeout budget must include the upstream dependency instead of waiting until the platform kills the whole invocation. Check HTTP failures separately from transport failures and clear owned timers. The reference deliberately returns a stable failure body; a richer contract can distinguish abort from other network errors.",
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
      "id": "next-lab-bounded-upstream-fetch-testing",
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
      "id": "next-lab-bounded-upstream-fetch-security",
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
      "id": "next-lab-bounded-upstream-fetch-tradeoffs",
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
    "Only when the operation is safe or receiver-enforced idempotent, with remaining deadline and attempt budgets. A timeout can leave a mutation outcome unknown; reconcile instead of blindly duplicating it."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-bounded-upstream-fetch-extension",
      "question": "Is retrying always appropriate after this failure?",
      "expectedConcepts": [
        "Data fetching",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Only when the operation is safe or receiver-enforced idempotent, with remaining deadline and attempt budgets. A timeout can leave a mutation outcome unknown; reconcile instead of blindly duplicating it."
    }
  ]
}
```
