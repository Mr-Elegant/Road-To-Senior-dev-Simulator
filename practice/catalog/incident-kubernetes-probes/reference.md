# Reference: Restart Cascade: A Database Blip Kills Every Pod

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A shared dependency check was reused as liveness. PostgreSQL latency caused healthy processes to restart, amplifying connection churn. A missing startup allowance then prevented new pods from stabilizing.\n\nEvidence\n1. Liveness failures explicitly cite SELECT 1 timeout despite normal pre-failure CPU.\n2. Restart count rises by 80 and database connection attempts rise 12x.\n3. The canary needs 45 seconds but liveness begins at 5 seconds.\n\nContainment\n1. Roll back the probe change to the last verified policy; retain healthy replicas and bound reconnect retries.\n2. Protect database capacity while monitoring readiness and actual customer request outcomes.\n\nPermanent correction\n1. Provide distinct startup, liveness and readiness semantics with thresholds based on measured behavior.\n2. Keep liveness independent of recoverable shared dependency faults; decide readiness based on which requests the process can safely serve.\n\nRecovery verification\n1. Inject database delay and verify the fleet does not restart in sync; test useful traffic and error budgets.\n2. Test slow startup and a true process hang; ramp a canary while maintaining serving capacity.\n\nRegression tests\n1. Assert dependency loss does not trip process liveness and reconnect attempts stay bounded.\n2. Verify startup failure eventually surfaces, readiness blocks premature traffic, and process deadlock triggers replacement.\n\nRollback constraints\n1. Revert the new probe configuration if restart or error gates breach; retain previously healthy replicas.\n2. Do not permanently remove all probes to obtain a superficially green rollout.\n\nCommunication and handoff\n1. Explain the restart amplification and track affected requests rather than reporting pod count alone.\n2. Assign owners for probe contract tests and deployment capacity policy.",
    "codeOrArtifact": "startupProbe:\n  httpGet: { path: /startup, port: 3000 }\n  periodSeconds: 5\n  failureThreshold: 18\nlivenessProbe:\n  httpGet: { path: /live, port: 3000 }\n  periodSeconds: 10\n  failureThreshold: 3\nreadinessProbe:\n  httpGet: { path: /ready, port: 3000 }\n  periodSeconds: 5\n  failureThreshold: 3\n# Illustrative budgets: measure and validate for this service.\n# /live checks process progress; /ready checks ability to serve safely.",
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
    "diagnosis": "A shared dependency check was reused as liveness. PostgreSQL latency caused healthy processes to restart, amplifying connection churn. A missing startup allowance then prevented new pods from stabilizing.",
    "evidence": [
      "Liveness failures explicitly cite SELECT 1 timeout despite normal pre-failure CPU.",
      "Restart count rises by 80 and database connection attempts rise 12x.",
      "The canary needs 45 seconds but liveness begins at 5 seconds."
    ],
    "containment": [
      "Roll back the probe change to the last verified policy; retain healthy replicas and bound reconnect retries.",
      "Protect database capacity while monitoring readiness and actual customer request outcomes."
    ],
    "permanentFix": [
      "Provide distinct startup, liveness and readiness semantics with thresholds based on measured behavior.",
      "Keep liveness independent of recoverable shared dependency faults; decide readiness based on which requests the process can safely serve."
    ],
    "verification": [
      "Inject database delay and verify the fleet does not restart in sync; test useful traffic and error budgets.",
      "Test slow startup and a true process hang; ramp a canary while maintaining serving capacity."
    ],
    "regressionTests": [
      "Assert dependency loss does not trip process liveness and reconnect attempts stay bounded.",
      "Verify startup failure eventually surfaces, readiness blocks premature traffic, and process deadlock triggers replacement."
    ],
    "rollback": [
      "Revert the new probe configuration if restart or error gates breach; retain previously healthy replicas.",
      "Do not permanently remove all probes to obtain a superficially green rollout."
    ],
    "communication": [
      "Explain the restart amplification and track affected requests rather than reporting pod count alone.",
      "Assign owners for probe contract tests and deployment capacity policy."
    ],
    "sources": [
      {
        "title": "Kubernetes startup, readiness and liveness probes",
        "url": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"
      }
    ]
  },
  "alternatives": [
    "For a service that can serve useful cached reads, keep those paths available while explicitly degrading writes.",
    "For a service unable to serve any safe request without the database, readiness may depend on it, with thresholds and recovery behavior tested."
  ],
  "commonMistakes": [
    "Making liveness query every shared dependency.",
    "Disabling readiness and routing traffic before startup.",
    "Treating larger timeouts as a substitute for correct probe semantics."
  ],
  "followUps": [
    {
      "id": "incident-kubernetes-probes-followup",
      "question": "Should every dependency failure make a pod unready?",
      "sampleStrongAnswer": "It depends on whether the process can still serve useful safe requests and how fleet-wide removal affects routing. Define readiness from the service contract, test degradation, and keep that decision distinct from process restart.",
      "expectedConcepts": [
        "startup",
        "liveness",
        "readiness",
        "degradation"
      ]
    }
  ]
}
```
