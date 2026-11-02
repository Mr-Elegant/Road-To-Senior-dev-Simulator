# Reference: Cache Stampede: The Five-Minute Expiry Cliff

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Identical TTLs created synchronized misses. Duplicate regeneration exceeded database capacity; per-process coalescing alone did not constrain cross-pod refreshes.\n\nEvidence\n1. Redis memory is normal while 18000 keys expire together.\n2. 12000 origin reads exceed the 800 QPS budget; the hot key creates 40 simultaneous refreshes.\n3. The deployment diff sets EX:300 for an entire batch.\n\nContainment\n1. Cap origin concurrency, coalesce identical reads and shed excess requests with bounded retry hints.\n2. Serve stale descriptions only within an explicit freshness policy; revalidate price and inventory on checkout.\n\nPermanent correction\n1. Apply TTL jitter, refresh-ahead for hot keys, and leases with owner tokens, TTL and safe release.\n2. Bound warmup work and separate disposable caches from durable session or coordination state.\n\nRecovery verification\n1. Run through at least one full expiry window at target traffic; origin load must stay below 800 QPS.\n2. Kill a refresh owner and verify bounded fallback, lease recovery, and correct checkout validation.\n\nRegression tests\n1. Expire a large key batch and assert the origin concurrency cap is never exceeded.\n2. Exercise concurrent refresh across pods, lease expiry and stale-price rejection.\n\nRollback constraints\n1. Disable the bulk warmer if origin load rises; retain admission controls while returning to a known-safe cache policy.\n2. Do not flush a shared Redis instance as a rollback.\n\nCommunication and handoff\n1. Explain that catalog descriptions may be slightly delayed while checkout values remain authoritative.\n2. Assign owners for TTL distribution, origin capacity alarms and cache isolation.",
    "codeOrArtifact": "Refresh policy\nkey TTL = base TTL + randomized bounded jitter\nmiss -> acquire expiring owner-token lease\nowner -> fetch under origin semaphore -> populate -> release only own lease\nnon-owner -> bounded wait OR permitted stale fields OR retryable failure\nNever substitute cached price/stock for authoritative checkout validation.\nGate: origin < 800 QPS through expiry and owner-loss tests.",
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
    "diagnosis": "Identical TTLs created synchronized misses. Duplicate regeneration exceeded database capacity; per-process coalescing alone did not constrain cross-pod refreshes.",
    "evidence": [
      "Redis memory is normal while 18000 keys expire together.",
      "12000 origin reads exceed the 800 QPS budget; the hot key creates 40 simultaneous refreshes.",
      "The deployment diff sets EX:300 for an entire batch."
    ],
    "containment": [
      "Cap origin concurrency, coalesce identical reads and shed excess requests with bounded retry hints.",
      "Serve stale descriptions only within an explicit freshness policy; revalidate price and inventory on checkout."
    ],
    "permanentFix": [
      "Apply TTL jitter, refresh-ahead for hot keys, and leases with owner tokens, TTL and safe release.",
      "Bound warmup work and separate disposable caches from durable session or coordination state."
    ],
    "verification": [
      "Run through at least one full expiry window at target traffic; origin load must stay below 800 QPS.",
      "Kill a refresh owner and verify bounded fallback, lease recovery, and correct checkout validation."
    ],
    "regressionTests": [
      "Expire a large key batch and assert the origin concurrency cap is never exceeded.",
      "Exercise concurrent refresh across pods, lease expiry and stale-price rejection."
    ],
    "rollback": [
      "Disable the bulk warmer if origin load rises; retain admission controls while returning to a known-safe cache policy.",
      "Do not flush a shared Redis instance as a rollback."
    ],
    "communication": [
      "Explain that catalog descriptions may be slightly delayed while checkout values remain authoritative.",
      "Assign owners for TTL distribution, origin capacity alarms and cache isolation."
    ],
    "sources": [
      {
        "title": "Redis eviction and memory policies",
        "url": "https://redis.io/docs/latest/develop/reference/eviction/"
      },
      {
        "title": "AWS retry budgets and jitter",
        "url": "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/"
      }
    ]
  },
  "alternatives": [
    "Use a dedicated refresh queue with deduplication and bounded workers.",
    "Precompute hot catalog views and invalidate them from product-change events while retaining expiry as a safety bound."
  ],
  "commonMistakes": [
    "Flushing shared Redis or warming with unlimited concurrency.",
    "Serving stale financial values without an explicit correctness policy.",
    "Using a refresh lock without expiration or owner-safe release."
  ],
  "followUps": [
    {
      "id": "incident-cache-stampede-followup",
      "question": "Why is single-flight inside one API process insufficient?",
      "sampleStrongAnswer": "Each pod can independently become a refresh owner. Coordinate hot-key refresh across pods or bound aggregate origin work, while handling lease loss and process failure.",
      "expectedConcepts": [
        "single-flight",
        "leases",
        "aggregate capacity"
      ]
    }
  ]
}
```
