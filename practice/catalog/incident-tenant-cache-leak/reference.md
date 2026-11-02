# Reference: Tenant Isolation: A CDN Serves Another Customer’s Invoice

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The edge cached tenant-specific authenticated responses with an identity-blind key. A cache hit bypassed origin authorization; local invoice IDs collided across tenants.\n\nEvidence\n1. Tenant A MISS followed by tenant B HIT on the same path returns the same invoice.\n2. Age:83 and absent origin access for the second request identify edge reuse.\n3. The rollout key includes only pathname and enables a 300-second private-route TTL.\n\nContainment\n1. Disable shared caching for private invoice paths through verified CDN policy, then invalidate affected objects.\n2. Preserve access/configuration evidence under restricted access and engage the security incident owner.\n\nPermanent correction\n1. Keep private invoice responses uncached with private, no-store semantics and a CDN configuration that respects them.\n2. Authorize every origin document access using server-verified tenant identity; only adopt private caching after a separate reviewed identity-aware design.\n\nRecovery verification\n1. Use synthetic tenant A/B and signed-out fixtures across relevant edge regions; verify neither content nor cached authorization crosses accounts.\n2. Correlate affected document IDs with access logs, record uncertainty and complete the approved security response.\n\nRegression tests\n1. Request identical local invoice IDs under two tenants and anonymously, including warm-cache requests.\n2. Test policy rollouts, invalidation coverage, forged tenant headers and error-response cache behavior.\n\nRollback constraints\n1. Keep private routes bypassed if any isolation probe fails; never restore the path-only policy for speed.\n2. Retain configuration snapshots and logs for the investigation; do not purge evidence as a workaround.\n\nCommunication and handoff\n1. Provide the security owner a verified timeline, possible exposure scope and containment evidence.\n2. Coordinate accurate affected-customer communication through the organization’s response process without unverified claims.",
    "codeOrArtifact": "Private invoice response policy\nCache-Control: private, no-store\nCDN behavior: caching disabled for /api/invoices/*\nOrigin: resolve tenant from verified server session; authorize document ownership.\n\nSynthetic verification matrix:\nA -> A invoice: allowed\nB -> A invoice: rejected\nanonymous -> private invoice: rejected\nrepeat after A warms edge: same authorization results\nRepeat at each relevant edge region; retain redacted evidence.",
    "architectureNotes": "Reference response under the stated constraints. Other justified approaches may be valid."
  },
  "rubric": [
    {
      "id": "incident-evidence",
      "category": "root_cause",
      "label": "Diagnosis supported by evidence",
      "description": "Connect the symptom, recent change, and causal mechanism; separate confirmed facts from hypotheses.",
      "weight": 5,
      "levels": [
        {
          "score": 0,
          "description": "No actionable response or unsupported assertions."
        },
        {
          "score": 1,
          "description": "Identifies a symptom but omits a safe action or evidence."
        },
        {
          "score": 2,
          "description": "Sound response with evidence; verification or residual risk is incomplete."
        },
        {
          "score": 3,
          "description": "Evidence-backed response with bounded mitigation, explicit recovery gates, tests and trade-offs."
        }
      ]
    },
    {
      "id": "incident-containment",
      "category": "reliability",
      "label": "Containment and safe recovery",
      "description": "Bound impact, protect integrity, state recovery gates and a reversible next step.",
      "weight": 5,
      "levels": [
        {
          "score": 0,
          "description": "No actionable response or unsupported assertions."
        },
        {
          "score": 1,
          "description": "Identifies a symptom but omits a safe action or evidence."
        },
        {
          "score": 2,
          "description": "Sound response with evidence; verification or residual risk is incomplete."
        },
        {
          "score": 3,
          "description": "Evidence-backed response with bounded mitigation, explicit recovery gates, tests and trade-offs."
        }
      ]
    },
    {
      "id": "incident-prevention",
      "category": "testing",
      "label": "Permanent fix and regression coverage",
      "description": "Fix the mechanism, test the failure and define monitoring plus ownership.",
      "weight": 4,
      "levels": [
        {
          "score": 0,
          "description": "No actionable response or unsupported assertions."
        },
        {
          "score": 1,
          "description": "Identifies a symptom but omits a safe action or evidence."
        },
        {
          "score": 2,
          "description": "Sound response with evidence; verification or residual risk is incomplete."
        },
        {
          "score": 3,
          "description": "Evidence-backed response with bounded mitigation, explicit recovery gates, tests and trade-offs."
        }
      ]
    },
    {
      "id": "incident-tradeoffs",
      "category": "tradeoffs",
      "label": "Decisions and communication",
      "description": "Explain the decision journal, alternatives, residual risk and customer communication.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "No actionable response or unsupported assertions."
        },
        {
          "score": 1,
          "description": "Identifies a symptom but omits a safe action or evidence."
        },
        {
          "score": 2,
          "description": "Sound response with evidence; verification or residual risk is incomplete."
        },
        {
          "score": 3,
          "description": "Evidence-backed response with bounded mitigation, explicit recovery gates, tests and trade-offs."
        }
      ]
    }
  ],
  "playbook": {
    "diagnosis": "The edge cached tenant-specific authenticated responses with an identity-blind key. A cache hit bypassed origin authorization; local invoice IDs collided across tenants.",
    "evidence": [
      "Tenant A MISS followed by tenant B HIT on the same path returns the same invoice.",
      "Age:83 and absent origin access for the second request identify edge reuse.",
      "The rollout key includes only pathname and enables a 300-second private-route TTL."
    ],
    "containment": [
      "Disable shared caching for private invoice paths through verified CDN policy, then invalidate affected objects.",
      "Preserve access/configuration evidence under restricted access and engage the security incident owner."
    ],
    "permanentFix": [
      "Keep private invoice responses uncached with private, no-store semantics and a CDN configuration that respects them.",
      "Authorize every origin document access using server-verified tenant identity; only adopt private caching after a separate reviewed identity-aware design."
    ],
    "verification": [
      "Use synthetic tenant A/B and signed-out fixtures across relevant edge regions; verify neither content nor cached authorization crosses accounts.",
      "Correlate affected document IDs with access logs, record uncertainty and complete the approved security response."
    ],
    "regressionTests": [
      "Request identical local invoice IDs under two tenants and anonymously, including warm-cache requests.",
      "Test policy rollouts, invalidation coverage, forged tenant headers and error-response cache behavior."
    ],
    "rollback": [
      "Keep private routes bypassed if any isolation probe fails; never restore the path-only policy for speed.",
      "Retain configuration snapshots and logs for the investigation; do not purge evidence as a workaround."
    ],
    "communication": [
      "Provide the security owner a verified timeline, possible exposure scope and containment evidence.",
      "Coordinate accurate affected-customer communication through the organization’s response process without unverified claims."
    ],
    "sources": [
      {
        "title": "CloudFront cache key policy",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html"
      }
    ]
  },
  "alternatives": [
    "Cache only public invoice-independent assets and retain private data access at the origin.",
    "A separately reviewed edge authorization design may support private caching, but identity verification and cache partitioning must hold for every hit."
  ],
  "commonMistakes": [
    "Assuming correct origin authorization protects CDN cache hits.",
    "Trusting a client-provided tenant identity.",
    "Deleting evidence or closing the investigation after testing one customer path."
  ],
  "followUps": [
    {
      "id": "incident-tenant-cache-leak-followup",
      "question": "Is adding Vary: Cookie sufficient to fix this incident?",
      "sampleStrongAnswer": "Not by itself. The CDN must actually include the intended trusted variation in its effective cache behavior, and authorization must hold for every response. Disable private caching until the complete design is verified.",
      "expectedConcepts": [
        "cache key",
        "authorization boundary",
        "tenant isolation"
      ]
    }
  ]
}
```
