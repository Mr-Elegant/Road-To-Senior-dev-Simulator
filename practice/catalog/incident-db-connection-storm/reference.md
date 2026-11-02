# Reference: Connection Storm: Autoscaling Makes Checkout Worse

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Autoscaling multiplied independent client pools beyond the usable PostgreSQL connection budget. Retries then amplified demand. Moderate CPU does not rule out connection saturation.\n\nEvidence\n1. The new ceiling permits 40 x 30 = 1200 clients against 360 usable slots.\n2. Reserved-slot errors and 840 pool waiters correlate with the rollout, while CPU remains 45%.\n3. A 5.1 attempt ratio and 95-second transactions explain the sustained pressure.\n\nContainment\n1. Freeze replica growth and bound checkout admission; reserve administrative access and degrade nonessential workloads.\n2. Set a fleet-wide budget: for example 40 x 6 = 240 checkout connections, with explicit allocations for other clients.\n3. Apply bounded jittered retries and operation deadlines. Inspect pg_stat_activity before cancelling any abandoned work.\n\nPermanent correction\n1. Introduce centrally budgeted pooling or a transaction pooler after checking session-state compatibility.\n2. Make replica limits and pool size a joint capacity constraint, with load tests and deployment checks.\n\nRecovery verification\n1. Ramp traffic in steps; require stable pool wait, connection count below the allocated budget, and error rate below 0.5% for 10 minutes.\n2. Reconcile all uncertain payment attempts by their original idempotency keys; verify no duplicate captures.\n\nRegression tests\n1. Load test the maximum replica count with all service pools included.\n2. Inject database latency and verify retries and queue length stay bounded; assert administrative capacity remains available.\n\nRollback constraints\n1. Restore the last verified pool/admission configuration if pool wait or errors exceed gates; do not revert to the oversized pools.\n2. Retain payment operation identifiers during rollback and reconciliation.\n\nCommunication and handoff\n1. Name an incident commander, publish checkout degradation and the next update time, and record the pool budget change.\n2. Assign follow-up ownership for capacity tests and pending payment reconciliation.",
    "codeOrArtifact": "Recovery checklist\n[ ] Admission bounded; operational slots reserved\n[ ] Sum(max replicas x pool max) <= allocated DB slots\n[ ] One retry layer; capped attempts + jitter + deadline\n[ ] pg_stat_activity inspected; no blanket termination\n[ ] Canary -> 10% -> 25% -> 50% -> 100%, stop on gate breach\n[ ] Reconcile uncertain payments before closing incident",
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
    "diagnosis": "Autoscaling multiplied independent client pools beyond the usable PostgreSQL connection budget. Retries then amplified demand. Moderate CPU does not rule out connection saturation.",
    "evidence": [
      "The new ceiling permits 40 x 30 = 1200 clients against 360 usable slots.",
      "Reserved-slot errors and 840 pool waiters correlate with the rollout, while CPU remains 45%.",
      "A 5.1 attempt ratio and 95-second transactions explain the sustained pressure."
    ],
    "containment": [
      "Freeze replica growth and bound checkout admission; reserve administrative access and degrade nonessential workloads.",
      "Set a fleet-wide budget: for example 40 x 6 = 240 checkout connections, with explicit allocations for other clients.",
      "Apply bounded jittered retries and operation deadlines. Inspect pg_stat_activity before cancelling any abandoned work."
    ],
    "permanentFix": [
      "Introduce centrally budgeted pooling or a transaction pooler after checking session-state compatibility.",
      "Make replica limits and pool size a joint capacity constraint, with load tests and deployment checks."
    ],
    "verification": [
      "Ramp traffic in steps; require stable pool wait, connection count below the allocated budget, and error rate below 0.5% for 10 minutes.",
      "Reconcile all uncertain payment attempts by their original idempotency keys; verify no duplicate captures."
    ],
    "regressionTests": [
      "Load test the maximum replica count with all service pools included.",
      "Inject database latency and verify retries and queue length stay bounded; assert administrative capacity remains available."
    ],
    "rollback": [
      "Restore the last verified pool/admission configuration if pool wait or errors exceed gates; do not revert to the oversized pools.",
      "Retain payment operation identifiers during rollback and reconciliation."
    ],
    "communication": [
      "Name an incident commander, publish checkout degradation and the next update time, and record the pool budget change.",
      "Assign follow-up ownership for capacity tests and pending payment reconciliation."
    ],
    "sources": [
      {
        "title": "AWS: timeouts, retries and jitter",
        "url": "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/"
      },
      {
        "title": "PostgreSQL connection settings",
        "url": "https://www.postgresql.org/docs/current/runtime-config-connection.html"
      }
    ]
  },
  "alternatives": [
    "Use a validated transaction pooler to multiplex short transactions; session variables and prepared statements need compatibility testing.",
    "Queue noninteractive checkout work with bounded depth and explicit expiration rather than keeping HTTP requests open."
  ],
  "commonMistakes": [
    "Scaling client pods based solely on request latency.",
    "Increasing max_connections without accounting for memory and downstream capacity.",
    "Blindly terminating all database sessions or retrying payments with new operation keys."
  ],
  "followUps": [
    {
      "id": "incident-db-connection-storm-followup",
      "question": "Why can CPU stay moderate during a severe database outage?",
      "sampleStrongAnswer": "Clients may wait for slots or locks instead of executing CPU-heavy work. Inspect connection states, pool wait and blocking relationships before selecting a capacity remedy.",
      "expectedConcepts": [
        "connection budget",
        "queueing",
        "wait events"
      ]
    }
  ]
}
```
