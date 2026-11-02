# Reference: Canary Deployment 5xx Spike & Automated Rollback Analysis

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Canary deployments route a small fraction of real production traffic (e.g. 5% to 10%) to a new version.\nAutomated Canary Analysis (ACA) compares the canary against the stable baseline:\n1. Metric Comparison:\n- Error Rate Delta: If canary 5xx rate exceeds baseline by > 1.0%, abort immediately.\n- Latency Degradation: If P95 / P99 latency increases by > 40%, abort.\n- Error Budget Burn Rate: Multi-window burn rate alert.\n2. Rollback Execution:\n- Immediately set Canary traffic weight to 0% in Ingress / Service Mesh (Istio / Envoy / Argo Rollouts).\n- Scale down canary pods or leave 1 pod isolated in debug pool for telemetry inspection.\n- Notify on-call team via PagerDuty with exact failing metrics.",
    "codeOrArtifact": "function evaluateCanaryHealth(baselineMetrics, canaryMetrics) {\n  const errorRateDelta = canaryMetrics.errorRate - baselineMetrics.errorRate;\n  const latencyRatio = canaryMetrics.p95LatencyMs / Math.max(1, baselineMetrics.p95LatencyMs);\n\n  if (errorRateDelta > 0.015) {\n    return {\n      rollback: true,\n      action: 'ABORT_CANARY',\n      reason: `Error rate delta of ${(errorRateDelta * 100).toFixed(2)}% breached 1.5% threshold`,\n    };\n  }\n\n  if (latencyRatio > 1.5) {\n    return {\n      rollback: true,\n      action: 'ABORT_CANARY',\n      reason: `P95 latency increased by ${((latencyRatio - 1) * 100).toFixed(1)}%`,\n    };\n  }\n\n  return {\n    rollback: false,\n    action: 'CONTINUE_PROMOTION',\n    reason: 'Canary within acceptable performance bounds',\n  };\n}"
  },
  "rubric": [
    {
      "id": "rb-canary-analysis",
      "category": "reliability",
      "label": "Automated Canary Analysis (ACA) & Rollback Policy",
      "description": "Implements metric comparison thresholds and rapid traffic diversion.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Implements clear statistical thresholds, error budget burn rates, and traffic weight zeroing."
        },
        {
          "score": 2,
          "description": "Rolls back on basic error rate check without baseline comparison."
        },
        {
          "score": 0,
          "description": "Suggests manual inspection before rollback."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Kayenta or Argo Rollouts AnalysisTemplate with Prometheus PromQL metrics."
  ],
  "commonMistakes": [
    "Comparing canary metrics against an arbitrary static number instead of the concurrently running baseline version.",
    "Promoting the canary to 100% too fast without sufficient sample volume."
  ],
  "followUps": [
    {
      "id": "ops-fq-3",
      "question": "What is Multi-Window Multi-Burn-Rate alerting in Google SRE Site Reliability Engineering?",
      "expectedConcepts": [
        "Short window (high burn rate, fast alert)",
        "Long window (low burn rate, prevents budget exhaustion)",
        "Reduces false positives"
      ],
      "sampleStrongAnswer": "Multi-Window Multi-Burn-Rate alerting looks at both a short window (e.g. 1 hour, 14.4x burn rate) and a long window (e.g. 6 hours) simultaneously. This prevents alert fatigue from short ephemeral spikes while ensuring that severe outages trigger pages within minutes and subtle chronic degradations are detected before the 30-day error budget is depleted."
    }
  ]
}
```
