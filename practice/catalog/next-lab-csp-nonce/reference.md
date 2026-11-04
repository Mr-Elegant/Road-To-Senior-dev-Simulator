# Reference: Plan nonce-based CSP without assuming static HTML can vary per request

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A fixed nonce provides no meaningful per-response nonce boundary, and retaining unsafe-inline can defeat the intended protection. Nonce ownership involves the request header seen by rendering and the response policy seen by the browser. Static cached HTML and per-request nonce requirements need an explicit compatibility decision.",
    "codeOrArtifact": "// Corrected review reference: csp-policy.ts\nexport function policy(nonce:string){return \"default-src 'self'; script-src 'self' 'nonce-\"+nonce+\"' 'strict-dynamic'; object-src 'none'; base-uri 'self'\";}\n// Generate an unpredictable nonce per request and propagate it through documented Next request/response headers.\n// This policy fragment alone does not install CSP or nonce every application script.",
    "architectureNotes": "Verification:\n- Install the full documented CSP propagation in a disposable real app.\n- Verify legitimate scripts carry the matching nonce and injected inline scripts are blocked.\n- Test report-only deployment, third-party scripts and production rendering/caching behavior.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-csp-nonce-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A fixed nonce provides no meaningful per-response nonce boundary, and retaining unsafe-inline can defeat the intended protection. Nonce ownership involves the request header seen by rendering and the response policy seen by the browser. Static cached HTML and per-request nonce requirements need an explicit compatibility decision.",
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
      "id": "next-lab-csp-nonce-testing",
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
      "id": "next-lab-csp-nonce-security",
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
      "id": "next-lab-csp-nonce-tradeoffs",
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
    "Start with report-only telemetry and an inventory of required script/style sources, fix violations, then enforce through a monitored rollout. CSP complements input handling and authorization; it does not repair unsafe data access."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-csp-nonce-extension",
      "question": "Would you enable a strict policy in one production step?",
      "expectedConcepts": [
        "Security and identity",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Start with report-only telemetry and an inventory of required script/style sources, fix violations, then enforce through a monitored rollout. CSP complements input handling and authorization; it does not repair unsafe data access."
    }
  ]
}
```
