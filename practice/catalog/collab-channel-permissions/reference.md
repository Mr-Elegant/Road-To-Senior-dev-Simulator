# Reference: Collaboration: Authorize Channel Reads and Sends

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "codeOrArtifact": "function solution({tenantId,channel,session,members,action}) {\n  const deny = reason => ({allowed:false,reason});\n  if(!['read','send','manage'].includes(action)) return deny('invalid_action');\n  if(!session || !session.active || !session.userId) return deny('unauthenticated');\n  if(session.tenantId!==tenantId || channel.tenantId!==tenantId) return deny('forbidden');\n  const member = members.find(m=>m.userId===session.userId && m.active);\n  if(channel.private && !member) return deny('forbidden');\n  if(action==='manage' && member?.role!=='admin') return deny('forbidden');\n  if(action==='send' && channel.archived) return deny('read_only');\n  return {allowed:true,reason:'allowed'};\n}",
    "explanation": "Apply explicit action allowlists and authenticated tenant scope before channel rules. Public visibility does not grant administration. Membership revocation and archived-send restrictions must apply on every server operation, including reconnect subscriptions and history queries. This fixture assumes trusted session/membership inputs; it is not a replacement for server authentication.",
    "architectureNotes": "How would you revoke an active socket subscription immediately when channel membership changes? Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees."
  },
  "rubric": [
    {
      "id": "collab-channel-permissions-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Correctly handle retries, ordering, boundaries, and unauthorized/stale events using the stated contract.",
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
      "id": "collab-channel-permissions-production",
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
    "Use an append-only event log with transactional projections.",
    "Use a database snapshot plus a versioned resume cursor."
  ],
  "commonMistakes": [
    "Trusting delivery order or treating retries as new operations.",
    "Mutating caller-owned arrays or accepting cross-channel data.",
    "Presenting a fixture result as a guarantee of real-time delivery or media connectivity."
  ],
  "followUps": [
    {
      "id": "channel-permissions-production",
      "question": "How would you revoke an active socket subscription immediately when channel membership changes?",
      "expectedConcepts": [
        "durable ordering",
        "authenticated scope",
        "replay",
        "failure recovery"
      ],
      "sampleStrongAnswer": "Apply explicit action allowlists and authenticated tenant scope before channel rules. Public visibility does not grant administration. Membership revocation and archived-send restrictions must apply on every server operation, including reconnect subscriptions and history queries. This fixture assumes trusted session/membership inputs; it is not a replacement for server authentication. Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests."
    }
  ]
}
```
