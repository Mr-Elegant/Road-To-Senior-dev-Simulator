# Reference: Migration Lock: A Small DDL Change Stops Orders

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An unbounded high-conflict DDL lock request waited behind a long reporting transaction and queued new work. The symptom is lock contention, not necessarily expensive SQL execution.\n\nEvidence\n1. Migration PID 812 waits on PID 601 according to pg_blocking_pids.\n2. 126 sessions queue while CPU is low; impact begins with the migration.\n3. The migration lacks lock_timeout and overlaps mixed application versions.\n\nContainment\n1. Record session age, query text, lock modes and blocker relationships; redact customer values.\n2. Cancel the identified waiting migration with pg_cancel_backend after confirming its role; verify rollback and order recovery. Escalate termination only if cancellation cannot resolve the situation safely.\n\nPermanent correction\n1. Use expand-contract releases with a short lock_timeout; keep both application versions compatible with the expanded schema.\n2. Backfill in checkpointed batches with transaction, lag and disk budgets; contract only after old readers and writers are gone.\n\nRecovery verification\n1. Ensure lock waiters return to baseline and order error rate stays below 0.5% for 10 minutes.\n2. Validate old/new binaries, backfill completeness and replica replay before changing read paths.\n\nRegression tests\n1. Hold a conflicting reporting transaction in staging and assert migration fails fast without a prolonged queue.\n2. Interrupt and resume the backfill; test mixed-version reads/writes and rollback against the expanded schema.\n\nRollback constraints\n1. Roll back the application while retaining compatible additive columns; do not blindly drop newly populated data.\n2. Stop and resume the backfill independently of deploy rollback.\n\nCommunication and handoff\n1. Record affected order windows, migration state and cancellation result for the incident commander.\n2. Assign a migration owner and reporting transaction lifecycle follow-up.",
    "codeOrArtifact": "-- Inspect first; use actual reviewed PIDs in an incident.\nSELECT pid, state, xact_start, wait_event_type, wait_event,\n       pg_blocking_pids(pid) AS blockers\nFROM pg_stat_activity\nWHERE datname = current_database();\n\n-- A separately scheduled, short additive migration:\nBEGIN;\nSET LOCAL lock_timeout = '1s';\nSET LOCAL statement_timeout = '10s';\nALTER TABLE orders ADD COLUMN risk_band text;\nCOMMIT;\n-- On timeout: rollback, investigate and reschedule; no tight retry loop.",
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
    "diagnosis": "An unbounded high-conflict DDL lock request waited behind a long reporting transaction and queued new work. The symptom is lock contention, not necessarily expensive SQL execution.",
    "evidence": [
      "Migration PID 812 waits on PID 601 according to pg_blocking_pids.",
      "126 sessions queue while CPU is low; impact begins with the migration.",
      "The migration lacks lock_timeout and overlaps mixed application versions."
    ],
    "containment": [
      "Record session age, query text, lock modes and blocker relationships; redact customer values.",
      "Cancel the identified waiting migration with pg_cancel_backend after confirming its role; verify rollback and order recovery. Escalate termination only if cancellation cannot resolve the situation safely."
    ],
    "permanentFix": [
      "Use expand-contract releases with a short lock_timeout; keep both application versions compatible with the expanded schema.",
      "Backfill in checkpointed batches with transaction, lag and disk budgets; contract only after old readers and writers are gone."
    ],
    "verification": [
      "Ensure lock waiters return to baseline and order error rate stays below 0.5% for 10 minutes.",
      "Validate old/new binaries, backfill completeness and replica replay before changing read paths."
    ],
    "regressionTests": [
      "Hold a conflicting reporting transaction in staging and assert migration fails fast without a prolonged queue.",
      "Interrupt and resume the backfill; test mixed-version reads/writes and rollback against the expanded schema."
    ],
    "rollback": [
      "Roll back the application while retaining compatible additive columns; do not blindly drop newly populated data.",
      "Stop and resume the backfill independently of deploy rollback."
    ],
    "communication": [
      "Record affected order windows, migration state and cancellation result for the incident commander.",
      "Assign a migration owner and reporting transaction lifecycle follow-up."
    ],
    "sources": [
      {
        "title": "PostgreSQL explicit locking",
        "url": "https://www.postgresql.org/docs/current/explicit-locking.html"
      }
    ]
  },
  "alternatives": [
    "Schedule a reviewed low-traffic window with reporting coordination for DDL requiring stronger locks.",
    "For an index-only change, consider CREATE INDEX CONCURRENTLY with its own operational constraints; it does not make arbitrary ALTER TABLE operations concurrent."
  ],
  "commonMistakes": [
    "Assuming every ALTER TABLE rewrites the table or that metadata-only means lock-free.",
    "Terminating every session without inspecting blockers.",
    "Combining DDL, full-table backfill and destructive contraction in one release."
  ],
  "followUps": [
    {
      "id": "incident-migration-lock-followup",
      "question": "Why can a waiting ALTER TABLE cause impact before it acquires its lock?",
      "sampleStrongAnswer": "Its queued incompatible lock request can make later conflicting requests wait as well. Inspect the full lock queue and remove the reviewed migration request rather than inferring health from low CPU.",
      "expectedConcepts": [
        "lock queue",
        "AccessExclusiveLock",
        "expand-contract"
      ]
    }
  ]
}
```
