# Reference: Detect colliding URLs hidden by route groups

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Both defective files resolve to /about because route groups are omitted from URLs. Resolve the conflict intentionally instead of assuming group names namespace public paths. Multiple root layouts also have navigation implications and must be tested as part of route ownership.",
    "codeOrArtifact": "// Corrected review reference: route-plan.ts\nexport const files=['app/(shop)/products/page.tsx','app/(marketing)/about/page.tsx'];\n// Route groups organize layouts; parentheses do not create URL path segments.",
    "architectureNotes": "Verification:\n- Build the defective plan in a disposable lab and observe the conflict.\n- Build the revised route tree and directly request both URLs.\n- Test navigation across multiple root layouts if the architecture uses them.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-route-group-collision-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Both defective files resolve to /about because route groups are omitted from URLs. Resolve the conflict intentionally instead of assuming group names namespace public paths. Multiple root layouts also have navigation implications and must be tested as part of route ownership.",
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
      "id": "next-lab-route-group-collision-testing",
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
      "id": "next-lab-route-group-collision-security",
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
      "id": "next-lab-route-group-collision-tradeoffs",
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
    "Private _folders opt a subtree out of routing, while (groups) organize routes without adding URL segments. A private folder is an organizational mechanism, not a server authorization boundary."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-route-group-collision-extension",
      "question": "How do private folders differ from route groups?",
      "expectedConcepts": [
        "Routing composition",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Private _folders opt a subtree out of routing, while (groups) organize routes without adding URL segments. A private folder is an organizational mechanism, not a server authorization boundary."
    }
  ]
}
```
