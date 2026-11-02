# Reference: SaaS: Record Useful Audit History Without Leaking Secrets

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The starter serializes credentials and trusts the resource tenant. Validate the trusted context against both resource versions, require stable identity and string-valued auditable fields, then construct a fresh allowlisted record. Secret rotation needs a separate metadata-only security event; excluding secrets does not mean suppressing evidence that a rotation occurred. In production commit the authorized mutation and audit record together, or use a durable outbox in that transaction. Populate time and request identity server-side, enforce append-only permissions, restrict audit readers by tenant and role, and define retention. An allowlist limits sensitive content but does not make arbitrary business strings safe for HTML rendering: escape output and cap field lengths at ingestion. Test new secret fields, nested values, context mismatch, and rollback. Monitor missing audit events; pause affected writes if required audit durability fails instead of falling back to full-object logs.",
    "codeOrArtifact": "function solution({ context, before, after }) {\n  const nonempty = value => typeof value === \"string\" && value.trim().length > 0;\n  if (!context || !nonempty(context.tenantId) || !nonempty(context.actorId) || !before || !after ||\n      !nonempty(before.id) || before.id !== after.id ||\n      before.tenantId !== context.tenantId || after.tenantId !== context.tenantId) return { entry: null };\n  const fields = [\"name\", \"status\", \"plan\"];\n  if (fields.some(field => typeof before[field] !== \"string\" || typeof after[field] !== \"string\")) return { entry: null };\n  const changes = fields.filter(field => before[field] !== after[field])\n    .map(field => ({ field, before: before[field], after: after[field] }));\n  if (!changes.length) return { entry: null };\n  return { entry: {\n    tenantId: context.tenantId, actorId: context.actorId, resourceId: before.id,\n    action: \"organization.updated\", changes\n  } };\n}"
  },
  "rubric": [
    {
      "id": "saas-safe-audit-history-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Audit output contains only allowed primitive changes and trusted identity, with no cross-tenant attribution.",
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
      "id": "saas-safe-audit-history-production",
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
    "Emit typed domain events with an explicit schema, using an outbox to feed a restricted audit store."
  ],
  "commonMistakes": [
    "Redacting only known key names while logging arbitrary new fields.",
    "Writing audit entries independently from the mutation, losing one side during a crash."
  ],
  "followUps": [
    {
      "id": "audit-rotation",
      "question": "How would you audit API key rotation without logging the key?",
      "expectedConcepts": [
        "metadata-only security event",
        "trusted actor",
        "no credential contents"
      ],
      "sampleStrongAnswer": "Emit a dedicated integration.key_rotated event with tenant, actor, integration ID, server time, and request ID. Include no raw key or secret before/after values; store the event durably with the rotation."
    }
  ]
}
```
