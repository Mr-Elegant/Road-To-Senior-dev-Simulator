# Reference: SaaS: Close a Cross-Tenant Invoice Access Bug

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The broken function proves only that objects exist. The correction binds identity, requested tenant, resource tenant, and action in one decision, defaulting to denial. In production validate session context server-side and query invoices with both tenant_id and invoice_id before serialization. Apply the same scope to exports, caches, search indexes, object storage, and jobs. Database row-level security can add defense in depth, but request roles must not bypass it and pooled connection context must be scoped to the transaction. Verify with two real tenant accounts across every read/write route, including revoked membership and stale caches. Log denial metadata without invoice contents; revoke exposed links and investigate historical access after a leak. [OWASP tenant isolation](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html).",
    "codeOrArtifact": "function solution({ session, requestedTenantId, invoice, action }) {\n  if (!session || typeof session.userId !== \"string\" || !session.userId.trim() ||\n      !invoice || invoice.tenantId !== requestedTenantId) return { allowed: false };\n  const membership = session.memberships.find(m => m.tenantId === requestedTenantId && m.active === true);\n  if (!membership) return { allowed: false };\n  const permissions = new Map([\n    [\"owner\", [\"read\", \"edit\", \"delete\"]],\n    [\"editor\", [\"read\", \"edit\"]],\n    [\"viewer\", [\"read\"]]\n  ]);\n  return { allowed: (permissions.get(membership.role) || []).includes(action) };\n}"
  },
  "rubric": [
    {
      "id": "saas-tenant-authorization-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Access requires trusted identity, active tenant membership, matching resource ownership, and a known permitted action.",
      "levels": [
        {
          "score": 0,
          "description": "The original failure remains or the response is hard-coded."
        },
        {
          "score": 1,
          "description": "Happy path works; negative or replay cases fail."
        },
        {
          "score": 2,
          "description": "All fixture behaviors work, but production boundaries are unexplained."
        },
        {
          "score": 3,
          "description": "All fixture behaviors work and the business invariant is explained."
        }
      ]
    },
    {
      "id": "saas-tenant-authorization-production",
      "category": "reliability",
      "weight": 4,
      "label": "Production design and verification",
      "description": "Separate this deterministic model from durable storage, concurrency, authorization, and recovery requirements.",
      "levels": [
        {
          "score": 0,
          "description": "Treats an in-memory model as a production guarantee."
        },
        {
          "score": 1,
          "description": "Names a production risk without a concrete mitigation."
        },
        {
          "score": 2,
          "description": "Defines persistence and failure handling, but omits a verification or rollback plan."
        },
        {
          "score": 3,
          "description": "Defines durable invariants, failure recovery, observable verification, and safe rollout."
        }
      ]
    }
  ],
  "alternatives": [
    "Centralize policy evaluation with tenant-scoped repositories; test every adapter so a shared policy cannot be bypassed."
  ],
  "commonMistakes": [
    "Trusting a tenant header without checking membership.",
    "Checking the strongest role across all memberships rather than the requested tenant."
  ],
  "followUps": [
    {
      "id": "tenant-cache",
      "question": "How could a correct database query still leak an invoice?",
      "expectedConcepts": [
        "tenant-scoped cache keys",
        "authorization before cache reads",
        "revocation"
      ],
      "sampleStrongAnswer": "A cache keyed only by invoice ID or a shared response cache can bypass scoped queries. Authorize before reading, include tenant and relevant access scope in keys, and invalidate permission-sensitive entries when membership changes."
    }
  ]
}
```
