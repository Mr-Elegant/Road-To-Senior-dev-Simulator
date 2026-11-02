# Reference: Payment Timeout: Did the Customer Already Pay?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The service conflated transport failure with payment failure and changed the idempotency key for retries. Delayed and reordered webhook handling compounded the local state mismatch.\n\nEvidence\n1. cap_17 succeeded before the gateway timeout for order 771.\n2. The retry has a different idempotency key, so it is a distinct provider operation.\n3. Duplicate evt_44 delivery and an older processing event reveal the need for deduplication and transition checks.\n\nContainment\n1. Disable blind capture retries for uncertain operations; display pending status and keep original keys and provider IDs.\n2. Query authoritative provider state and reconcile ambiguous orders without issuing another charge.\n\nPermanent correction\n1. Persist one logical operation key before the first provider call and reuse it only with the same payload on retries.\n2. Implement a durable payment state machine and authenticated, deduplicated webhook inbox; protect concurrent attempts with database uniqueness and transactional updates.\n\nRecovery verification\n1. Inject a lost success response and prove only one provider capture exists for a logical operation.\n2. Reconcile every affected order, issue approved idempotent refunds for confirmed excess captures, and verify ledger/provider totals.\n\nRegression tests\n1. Test retries after timeouts, process restarts and simultaneous customer submissions.\n2. Replay duplicate and out-of-order signed webhooks; verify successful state never regresses and tampered signatures fail.\n\nRollback constraints\n1. Disable the new capture path if duplicate rate rises; retain pending reconciliation and never revert to fresh-key retries.\n2. Keep audit records and run refunds as a separately recoverable workflow.\n\nCommunication and handoff\n1. Tell customers when payment is processing versus confirmed; avoid asking them to repay uncertain transactions.\n2. Give support a list of confirmed duplicate captures, refund status and an assigned finance owner.",
    "codeOrArtifact": "Durable operation record\nUNIQUE(order_id, operation_type) -> stable idempotency_key, payload_hash, provider_id, state\n\nCreate operation transactionally BEFORE provider request.\nRetry same operation with same key + same payload.\nTimeout -> PENDING_RECONCILIATION, not FAILED.\nVerified webhook -> deduplicated inbox -> allowed state transition.\nConfirmed excess capture -> unique refund operation -> reconcile refund outcome.\nProvider key retention is finite: long-delayed retries require reconciliation first.",
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
    "diagnosis": "The service conflated transport failure with payment failure and changed the idempotency key for retries. Delayed and reordered webhook handling compounded the local state mismatch.",
    "evidence": [
      "cap_17 succeeded before the gateway timeout for order 771.",
      "The retry has a different idempotency key, so it is a distinct provider operation.",
      "Duplicate evt_44 delivery and an older processing event reveal the need for deduplication and transition checks."
    ],
    "containment": [
      "Disable blind capture retries for uncertain operations; display pending status and keep original keys and provider IDs.",
      "Query authoritative provider state and reconcile ambiguous orders without issuing another charge."
    ],
    "permanentFix": [
      "Persist one logical operation key before the first provider call and reuse it only with the same payload on retries.",
      "Implement a durable payment state machine and authenticated, deduplicated webhook inbox; protect concurrent attempts with database uniqueness and transactional updates."
    ],
    "verification": [
      "Inject a lost success response and prove only one provider capture exists for a logical operation.",
      "Reconcile every affected order, issue approved idempotent refunds for confirmed excess captures, and verify ledger/provider totals."
    ],
    "regressionTests": [
      "Test retries after timeouts, process restarts and simultaneous customer submissions.",
      "Replay duplicate and out-of-order signed webhooks; verify successful state never regresses and tampered signatures fail."
    ],
    "rollback": [
      "Disable the new capture path if duplicate rate rises; retain pending reconciliation and never revert to fresh-key retries.",
      "Keep audit records and run refunds as a separately recoverable workflow."
    ],
    "communication": [
      "Tell customers when payment is processing versus confirmed; avoid asking them to repay uncertain transactions.",
      "Give support a list of confirmed duplicate captures, refund status and an assigned finance owner."
    ],
    "sources": [
      {
        "title": "Stripe idempotent requests",
        "url": "https://docs.stripe.com/api/idempotent_requests"
      },
      {
        "title": "Stripe webhook delivery and verification",
        "url": "https://docs.stripe.com/webhooks"
      }
    ]
  },
  "alternatives": [
    "Use a provider PaymentIntent-like lifecycle with one durable intent per logical checkout and authoritative state retrieval.",
    "Serialize payment work through an outbox-backed worker, while retaining idempotent provider calls and reconciliation."
  ],
  "commonMistakes": [
    "Assuming a timeout proves no side effect occurred.",
    "Generating idempotency keys inside retry loops.",
    "Treating webhook arrival order as authoritative or refunding unverified captures."
  ],
  "followUps": [
    {
      "id": "incident-payment-ambiguity-followup",
      "question": "Does provider idempotency guarantee exactly-once business processing forever?",
      "sampleStrongAnswer": "No. Keys have provider-specific retention and request rules; local restarts, concurrent requests and downstream effects still need durable operation identity, deduplication and reconciliation.",
      "expectedConcepts": [
        "ambiguous outcome",
        "idempotency retention",
        "reconciliation"
      ]
    }
  ]
}
```
