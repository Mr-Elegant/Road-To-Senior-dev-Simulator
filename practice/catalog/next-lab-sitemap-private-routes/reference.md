# Reference: Publish canonical public sitemap entries without exposing private resources

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A sitemap is a public discovery artifact. Project only published canonical routes and use a trusted origin rather than an arbitrary forwarded host. robots directives are crawler instructions, not access control; private endpoints must remain authenticated even when absent from the sitemap.",
    "codeOrArtifact": "// Corrected review reference: app/sitemap.ts\nimport type { MetadataRoute } from 'next';\nexport default function sitemap():MetadataRoute.Sitemap{return [{url:'https://example.com/',changeFrequency:'weekly'},{url:'https://example.com/docs',changeFrequency:'weekly'}];}\n// Use a trusted configured public origin and published canonical records for dynamic entries.",
    "architectureNotes": "Verification:\n- Request sitemap.xml and validate absolute canonical URLs.\n- Seed private/draft resources and prove they are omitted.\n- Verify robots/noindex policy independently from actual authorization.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-sitemap-private-routes-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A sitemap is a public discovery artifact. Project only published canonical routes and use a trusted origin rather than an arbitrary forwarded host. robots directives are crawler instructions, not access control; private endpoints must remain authenticated even when absent from the sitemap.",
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
      "id": "next-lab-sitemap-private-routes-testing",
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
      "id": "next-lab-sitemap-private-routes-security",
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
      "id": "next-lab-sitemap-private-routes-tradeoffs",
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
    "Partition through supported sitemap generation conventions and the search-engine protocol limits. Bound build/query cost and use real content modification times; do not fabricate a new lastModified for every unchanged URL on every request."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-sitemap-private-routes-extension",
      "question": "How do very large sitemaps scale?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Partition through supported sitemap generation conventions and the search-engine protocol limits. Bound build/query cost and use real content modification times; do not fabricate a new lastModified for every unchanged URL on every request."
    }
  ]
}
```
