# Reference: Consumer Backlog: One Poison Event Blocks Fulfillment

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An incompatible event schema poisons one ordered partition. Overscaling cannot bypass the record safely; offset shortcuts risk loss and unguarded replay risks duplicate fulfillment.\n\nEvidence\n1. All errors point to partition 2 offset 8841 with schema v3.\n2. 18 replicas compete for six partitions while other partitions continue progressing.\n3. The producer changed address shape without a compatible consumer rollout.\n\nContainment\n1. Stop or roll back incompatible production where safe and preserve the failed record plus its schema and coordinates.\n2. Pause only the affected partition with bounded backoff; continue unaffected partitions if ordering and business dependencies permit.\n\nPermanent correction\n1. Introduce schema compatibility checks and tolerant versioned consumers before producers switch.\n2. Durably quarantine unrecoverable records before committing past them; use unique business-event processing records around fulfillment side effects.\n\nRecovery verification\n1. Replay the reviewed range with bounded concurrency and reconcile received, fulfilled and quarantined counts.\n2. Require oldest-event age and per-partition lag to return within service budgets without duplicate shipments.\n\nRegression tests\n1. Send v2, v3, malformed and duplicate events; assert compatible processing or durable quarantine.\n2. Crash between side effect, quarantine and offset commit; prove replay remains recoverable and business effects are deduplicated.\n\nRollback constraints\n1. Pause the affected partition if the corrected consumer fails; retain the reviewed replay range.\n2. Never use reset-to-latest as a substitute for reconstructing lost work.\n\nCommunication and handoff\n1. Publish the affected order window and fulfillment delay with a recovery estimate based on measured drain rate.\n2. Assign owners for quarantined order disposition and schema rollout policy.",
    "codeOrArtifact": "For each source event:\n1. Read event ID, partition, offset and schema version.\n2. Validate compatible payload.\n3. If processable: apply business effect through durable deduplication.\n4. If not: write durable quarantine with payload + error + coordinates.\n5. Confirm disposition, then commit the next source offset.\n6. On ambiguous external writes: reconcile before advancing.\nKafka transactions do not automatically include an external warehouse API.",
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
    "diagnosis": "An incompatible event schema poisons one ordered partition. Overscaling cannot bypass the record safely; offset shortcuts risk loss and unguarded replay risks duplicate fulfillment.",
    "evidence": [
      "All errors point to partition 2 offset 8841 with schema v3.",
      "18 replicas compete for six partitions while other partitions continue progressing.",
      "The producer changed address shape without a compatible consumer rollout."
    ],
    "containment": [
      "Stop or roll back incompatible production where safe and preserve the failed record plus its schema and coordinates.",
      "Pause only the affected partition with bounded backoff; continue unaffected partitions if ordering and business dependencies permit."
    ],
    "permanentFix": [
      "Introduce schema compatibility checks and tolerant versioned consumers before producers switch.",
      "Durably quarantine unrecoverable records before committing past them; use unique business-event processing records around fulfillment side effects."
    ],
    "verification": [
      "Replay the reviewed range with bounded concurrency and reconcile received, fulfilled and quarantined counts.",
      "Require oldest-event age and per-partition lag to return within service budgets without duplicate shipments."
    ],
    "regressionTests": [
      "Send v2, v3, malformed and duplicate events; assert compatible processing or durable quarantine.",
      "Crash between side effect, quarantine and offset commit; prove replay remains recoverable and business effects are deduplicated."
    ],
    "rollback": [
      "Pause the affected partition if the corrected consumer fails; retain the reviewed replay range.",
      "Never use reset-to-latest as a substitute for reconstructing lost work."
    ],
    "communication": [
      "Publish the affected order window and fulfillment delay with a recovery estimate based on measured drain rate.",
      "Assign owners for quarantined order disposition and schema rollout policy."
    ],
    "sources": [
      {
        "title": "Apache Kafka delivery semantics and offsets",
        "url": "https://kafka.apache.org/41/design/design/"
      }
    ]
  },
  "alternatives": [
    "Use Kafka transactions for Kafka-to-Kafka transformations with read_committed consumers; external side effects remain a separate boundary.",
    "Keep strict partition ordering and stop the partition until manual repair when skipping a record would violate domain invariants."
  ],
  "commonMistakes": [
    "Adding consumers beyond partition capacity.",
    "Committing offsets before durable disposition.",
    "Claiming Kafka exactly-once automatically prevents duplicate external shipments."
  ],
  "followUps": [
    {
      "id": "incident-kafka-poison-message-followup",
      "question": "When is sending a failed record to a dead-letter queue insufficient?",
      "sampleStrongAnswer": "When later events depend on it, or when the write and source commit can fail independently without recovery. Define ordering policy, durable disposition, replay ownership and a crash-safe acknowledgement protocol.",
      "expectedConcepts": [
        "partition ordering",
        "durable disposition",
        "side effects"
      ]
    }
  ]
}
```
