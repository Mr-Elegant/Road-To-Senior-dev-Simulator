# Reference: Architect an isolated multi-tenant Next.js SaaS

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Terminate traffic at a trusted ingress and resolve a normalized, allowlisted domain to a server-owned tenant ID. Verify the current actor and tenant membership in the data-access boundary, then constrain database predicates by tenant. Partition cached public representations by tenant, locale and schema/version; keep sensitive per-user data outside shared entries. Separate public shells from runtime private subtrees, document cookie domain/SameSite policy, and never trust a proxy rewrite as object authorization.",
    "architectureNotes": "A custom domain can change ownership while an old cache entry remains. Make domain changes an audited workflow with verification, cache/version rotation and a bounded propagation SLO. Reject ambiguous Host/forwarded-host inputs at the trusted boundary.",
    "codeOrArtifact": "# Decision record: Architect an isolated multi-tenant Next.js SaaS\n\n## Context and scale\nA SaaS proposes deriving its tenant from an arbitrary Host header and caching every dashboard by pathname.\n2,000 tenants; 10,000 peak reads/second; private account data\n\n## Accepted constraints\n- Resolve only admitted domains to tenants.\n- Enforce tenant membership on every read and mutation.\n- Keep public assets cacheable without caching private dashboards globally.\n\n## Design and ownership\nTerminate traffic at a trusted ingress and resolve a normalized, allowlisted domain to a server-owned tenant ID. Verify the current actor and tenant membership in the data-access boundary, then constrain database predicates by tenant. Partition cached public representations by tenant, locale and schema/version; keep sensitive per-user data outside shared entries. Separate public shells from runtime private subtrees, document cookie domain/SameSite policy, and never trust a proxy rewrite as object authorization.\n\n## Failure and recovery\nA custom domain can change ownership while an old cache entry remains. Make domain changes an audited workflow with verification, cache/version rotation and a bounded propagation SLO. Reject ambiguous Host/forwarded-host inputs at the trusted boundary.\n\n## Verification gates\n- Attempt cross-tenant IDs, forged domains and action calls outside Proxy coverage.\n- Warm caches in tenant A before requesting the same pathname in B.\n- Revoke membership and verify the documented access-revocation bound.\n\n## Interview change\nShould all tenants share one deployment?\nCompare isolation needs, regional requirements, noisy-neighbor budgets and operational cost. Shared infrastructure can work with strong logical boundaries; high-risk tenants may justify separate deployments and data partitions. Deployment isolation does not remove application authorization.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-tenant-platform-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Terminate traffic at a trusted ingress and resolve a normalized, allowlisted domain to a server-owned tenant ID. Verify the current actor and tenant membership in the data-access boundary, then constrain database predicates by tenant. Partition cached public representations by tenant, locale and schema/version; keep sensitive per-user data outside shared entries. Separate public shells from runtime private subtrees, document cookie domain/SameSite policy, and never trust a proxy rewrite as object authorization.",
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
      "id": "next-lab-tenant-platform-testing",
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
      "id": "next-lab-tenant-platform-security",
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
      "id": "next-lab-tenant-platform-tradeoffs",
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
    "Compare isolation needs, regional requirements, noisy-neighbor budgets and operational cost. Shared infrastructure can work with strong logical boundaries; high-risk tenants may justify separate deployments and data partitions. Deployment isolation does not remove application authorization."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-tenant-platform-extension",
      "question": "Should all tenants share one deployment?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Compare isolation needs, regional requirements, noisy-neighbor budgets and operational cost. Shared infrastructure can work with strong logical boundaries; high-risk tenants may justify separate deployments and data partitions. Deployment isolation does not remove application authorization."
    }
  ]
}
```
