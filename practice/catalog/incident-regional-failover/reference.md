# Reference: Regional Failover: The Replica Is Ninety Seconds Behind

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Regional isolation exposed the durability limit of asynchronous replication and incomplete writer fencing. The recovery decision must address single-writer authority and measured data exposure separately.\n\nEvidence\n1. The initial replay gap is 90 seconds versus a 30-second RPO.\n2. Internal workers can reach the old primary despite public route failure.\n3. Archived WAL reduces the confirmed gap to 20 seconds; the returning old primary contains divergent records.\n\nContainment\n1. Fence every old writer path using the reviewed infrastructure mechanism and confirm enforcement.\n2. Capture last acknowledged operation IDs and WAL positions; recover available WAL before calculating the remaining exposure.\n\nPermanent correction\n1. Automate failover authority, fencing checks and writer routing as one tested runbook.\n2. Choose synchronous durability or an explicit business reconciliation model where the cost and latency match the required RPO.\n\nRecovery verification\n1. Prove there is one writable authority, confirm replay completion to the chosen recovery point, and test all worker/API routes.\n2. Reconcile potentially exposed orders against payment and request records; report actual loss and unresolved cases.\n\nRegression tests\n1. Partition the old primary from public routing while workers can still reach it; assert promotion cannot bypass fencing.\n2. Restore from WAL, measure RPO/RTO, and rehearse old-primary return plus idempotent reconciliation.\n\nRollback constraints\n1. Do not reverse promotion by simply turning the old primary back on.\n2. Keep region B authoritative; rebuild region A as a replica and plan failback only after consistency and routing gates pass.\n\nCommunication and handoff\n1. Publish measured availability and data exposure separately; escalate RPO breaches instead of claiming zero loss.\n2. Assign reconciliation owners and publish a clear next update time.",
    "codeOrArtifact": "Promotion gate\n1. Incident commander identifies recovery authority.\n2. Old primary + workers fenced; independently verify.\n3. Record durable/replayed WAL positions and available archives.\n4. Calculate exposure; obtain explicit RPO exception if required.\n5. Promote once; update API, workers and connection pools.\n6. Verify single writer and reconcile exposed business IDs.\n7. Preserve divergent old data; rebuild replica before planned failback.",
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
    "diagnosis": "Regional isolation exposed the durability limit of asynchronous replication and incomplete writer fencing. The recovery decision must address single-writer authority and measured data exposure separately.",
    "evidence": [
      "The initial replay gap is 90 seconds versus a 30-second RPO.",
      "Internal workers can reach the old primary despite public route failure.",
      "Archived WAL reduces the confirmed gap to 20 seconds; the returning old primary contains divergent records."
    ],
    "containment": [
      "Fence every old writer path using the reviewed infrastructure mechanism and confirm enforcement.",
      "Capture last acknowledged operation IDs and WAL positions; recover available WAL before calculating the remaining exposure."
    ],
    "permanentFix": [
      "Automate failover authority, fencing checks and writer routing as one tested runbook.",
      "Choose synchronous durability or an explicit business reconciliation model where the cost and latency match the required RPO."
    ],
    "verification": [
      "Prove there is one writable authority, confirm replay completion to the chosen recovery point, and test all worker/API routes.",
      "Reconcile potentially exposed orders against payment and request records; report actual loss and unresolved cases."
    ],
    "regressionTests": [
      "Partition the old primary from public routing while workers can still reach it; assert promotion cannot bypass fencing.",
      "Restore from WAL, measure RPO/RTO, and rehearse old-primary return plus idempotent reconciliation."
    ],
    "rollback": [
      "Do not reverse promotion by simply turning the old primary back on.",
      "Keep region B authoritative; rebuild region A as a replica and plan failback only after consistency and routing gates pass."
    ],
    "communication": [
      "Publish measured availability and data exposure separately; escalate RPO breaches instead of claiming zero loss.",
      "Assign reconciliation owners and publish a clear next update time."
    ],
    "sources": [
      {
        "title": "PostgreSQL standby and replication",
        "url": "https://www.postgresql.org/docs/current/warm-standby.html"
      }
    ]
  },
  "alternatives": [
    "Wait for primary recovery if the expected delay is preferable to the measured data-loss risk.",
    "Use synchronous replication for workloads whose durability requirement justifies its latency and availability trade-offs."
  ],
  "commonMistakes": [
    "Equating a reachable standby with a current standby.",
    "Using DNS as the only fencing mechanism.",
    "Automatically failing back to the old primary without divergence analysis."
  ],
  "followUps": [
    {
      "id": "incident-regional-failover-followup",
      "question": "Does synchronous replication remove the need for fencing?",
      "sampleStrongAnswer": "No. It can improve the durability of acknowledged writes depending on configuration, but leader ownership, routing and split-brain prevention still need explicit coordination and fencing.",
      "expectedConcepts": [
        "RPO",
        "fencing",
        "single writer",
        "durability"
      ]
    }
  ]
}
```
