# Reference: SaaS: Repair Subscription Access After Delayed Updates

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The starter uses last delivery wins and equates a plan name with permission. Apply only valid newer internal snapshots for the current tenant, then compute access against a deterministic clock. This exercise assumes a serialized reconciler assigned versions after reading authoritative billing state; provider webhook timestamps are not equivalent. In production deduplicate verified deliveries, serialize reconciliation per subscription, fetch authoritative state as required, and conditionally persist the internal revision and entitlements. Periodic reconciliation repairs missing notifications. Check access server-side and expire caches at the entitlement boundary. Test delayed updates, cancellation at period end, expired trials, and a provider outage. Monitor reconciliation lag and unexpected grants; on an inconsistent snapshot preserve a known valid policy and queue review rather than granting access from an unknown state. [Stripe ordering and retrieval guidance](https://docs.stripe.com/webhooks).",
    "codeOrArtifact": "function solution({ state, snapshots, now }) {\n  let next = { ...state };\n  const statuses = [\"active\", \"trialing\", \"past_due\", \"canceled\", \"unpaid\", \"incomplete\"];\n  const outcomes = snapshots.map(snapshot => {\n    if (snapshot.tenantId !== next.tenantId) return \"mismatch\";\n    if (!Number.isSafeInteger(snapshot.version) || snapshot.version <= 0 ||\n        !Number.isSafeInteger(snapshot.periodEnd) || snapshot.periodEnd < 0 ||\n        typeof snapshot.cancelAtPeriodEnd !== \"boolean\" ||\n        ![\"starter\", \"pro\"].includes(snapshot.plan) || !statuses.includes(snapshot.status)) return \"invalid\";\n    if (snapshot.version <= next.version) return \"stale\";\n    next = { ...snapshot };\n    return \"applied\";\n  });\n  const canExport = next.plan === \"pro\" && [\"active\", \"trialing\"].includes(next.status) && now < next.periodEnd;\n  return { state: next, canExport, outcomes };\n}"
  },
  "rubric": [
    {
      "id": "saas-subscription-entitlements-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Reject stale or cross-tenant snapshots and enforce the explicit plan, status, and expiry policy.",
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
      "id": "saas-subscription-entitlements-production",
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
    "Use provider entitlement APIs behind a cached server-side policy, with explicit cache expiry and a documented outage policy."
  ],
  "commonMistakes": [
    "Using event.created as a guaranteed per-subscription sequence.",
    "Revoking access immediately when cancelAtPeriodEnd becomes true."
  ],
  "followUps": [
    {
      "id": "sub-order",
      "question": "Why is an internal revision not enough if provider fetches race?",
      "expectedConcepts": [
        "serialization",
        "authoritative state",
        "stale reads"
      ],
      "sampleStrongAnswer": "A revision assigned when an old fetch completes can make stale data appear newer. Serialize fetch-and-commit for each subscription or use a documented provider ordering mechanism; assign the internal revision only within that controlled reconciliation."
    }
  ]
}
```
