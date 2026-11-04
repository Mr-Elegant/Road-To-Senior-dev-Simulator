# Reference: Constrain reverse-proxy action origins and payload limits

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Origin admission is an additional transport protection, not authentication or object permission. Model the actual trusted proxy/host chain before adding extra allowed domains and do not use an unrestricted wildcard to silence a mismatch. Body limits should follow the admitted operation; large uploads often need a separate scoped storage flow.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={experimental:{serverActions:{allowedOrigins:['trusted-proxy.example.com'],bodySizeLimit:'1mb'}}};export default config;\n// If the default same-origin policy already fits the deployment, omit allowedOrigins instead of expanding it.",
    "architectureNotes": "Verification:\n- Submit through the intended proxy and verify Origin/Host/forwarded-host handling.\n- Reject an untrusted origin and oversized action payload.\n- Call the mutation as an authenticated but unauthorized actor and verify data-level denial remains.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-server-action-origins-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Origin admission is an additional transport protection, not authentication or object permission. Model the actual trusted proxy/host chain before adding extra allowed domains and do not use an unrestricted wildcard to silence a mismatch. Body limits should follow the admitted operation; large uploads often need a separate scoped storage flow.",
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
      "id": "next-lab-server-action-origins-testing",
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
      "id": "next-lab-server-action-origins-security",
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
      "id": "next-lab-server-action-origins-tradeoffs",
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
    "No. Validate every argument and check current identity/capability at execution. Same-origin requests can still carry malicious values, and a trusted site can still have compromised clients or unauthorized users."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-server-action-origins-extension",
      "question": "Does an allowed origin prove a trustworthy action argument?",
      "expectedConcepts": [
        "Security and identity",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Validate every argument and check current identity/capability at execution. Same-origin requests can still carry malicious values, and a trusted site can still have compromised clients or unauthorized users."
    }
  ]
}
```
