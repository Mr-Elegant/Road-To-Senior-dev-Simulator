# Reference: Production Incident: Node.js Container OOMKilled Memory Leak

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Incident Report:\n1. Root-Cause Hypothesis:\nCommit 'c4e910a' introduced an unbounded array 'requestHistory = []' in module scope. On every incoming request, 'logRequestTelemetry()' pushes full request objects (including 'req.body') into this array. Because the array is never pruned, V8 heap retains references to all historical requests indefinitely. Monotonic RSS slope (+200MB/hour) hits the 1024MB Kubernetes container limit after ~4 hours, triggering kernel OOMKiller (Exit 137) and 502 Bad Gateway responses.\n\n2. Immediate Mitigation (Target: < 5 mins):\nExecute Kubernetes rollout undo:\n'kubectl rollout undo deployment/api-core'\nThis restores the previous stable container image and stops crashes immediately.\n\n3. Permanent Correction:\nDo not store telemetry in application process memory. If in-memory sampling is required, use a bounded LRU cache (e.g. max 500 items) or send telemetry asynchronously to an external collector (OpenTelemetry / Datadog / CloudWatch) over UDP/HTTP without retention.\n\n4. Regression Testing:\nWrite a test that generates 100,000 synthetic requests and asserts that telemetry array length never exceeds MAX_ITEMS (e.g. 500).\n\n5. Monitoring Improvement:\nPromQL Alerting Rule:\n'expr: container_memory_working_set_bytes{container=\"api-core\"} / container_spec_memory_limit_bytes > 0.85\nfor: 5m\nlabels: severity = critical\nannotations: summary = \"Container memory exceeding 85% for 5 minutes\"'",
    "codeOrArtifact": "/**\n * Permanent Correction: Bounded Ring Buffer / LRU Cache\n */\nclass BoundedTelemetryBuffer {\n  constructor(maxSize = 500) {\n    this.maxSize = maxSize;\n    this.buffer = new Array(maxSize);\n    this.index = 0;\n    this.count = 0;\n  }\n\n  add(entry) {\n    // Overwrite oldest entry in ring buffer without reallocating arrays\n    this.buffer[this.index] = {\n      path: entry.path,\n      time: Date.now(),\n      status: entry.status,\n      // Strip large payloads (req.body) to keep footprint minimal\n    };\n    this.index = (this.index + 1) % this.maxSize;\n    if (this.count < this.maxSize) this.count++;\n  }\n\n  getRecent() {\n    return this.buffer.slice(0, this.count);\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-incident-rca",
      "category": "root_cause",
      "label": "Root Cause Hypothesis & Evidence Formulation",
      "description": "Directly links unbounded array in commit c4e910a to monotonic RSS growth and OOMKill.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Pinpoints unbounded global array in commit c4e910a, references RSS metric slope and exit code 137."
        },
        {
          "score": 2,
          "description": "Identifies memory leak in code but does not cite metrics or commit hash."
        },
        {
          "score": 0,
          "description": "Guesses random memory leak without reviewing commit diff."
        }
      ]
    },
    {
      "id": "rb-incident-mitigation",
      "category": "reliability",
      "label": "Immediate Mitigation & Production Stabilization",
      "description": "Recommends fast rollback or traffic drain to stop customer impact.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Immediately triggers git revert / kubectl rollout undo, verifies pod stability."
        },
        {
          "score": 2,
          "description": "Suggests restarting pods or adding RAM as permanent solution."
        },
        {
          "score": 0,
          "description": "Waits for code fix before acting on production incident."
        }
      ]
    },
    {
      "id": "rb-incident-correction",
      "category": "code_quality",
      "label": "Permanent Correction & Guardrails",
      "description": "Implements bounded cache with LRU eviction and memory bounds.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Replaces unbounded array with fixed-size LRU cache or external telemetry system."
        },
        {
          "score": 1,
          "description": "Uses array.pop() without strict boundary limits."
        },
        {
          "score": 0,
          "description": "No code fix."
        }
      ]
    }
  ],
  "alternatives": [
    "Sending structured logs to stdout and letting Fluentbit / Vector ship logs to Datadog/Elasticsearch."
  ],
  "commonMistakes": [
    "Increasing pod memory limit from 1GB to 4GB: an unbounded leak will simply take 16 hours to crash instead of 4 hours.",
    "Trying to manually run `global.gc()` in production."
  ],
  "followUps": [
    {
      "id": "ops-fq-1",
      "question": "What is the difference between `container_memory_rss` and `container_memory_working_set_bytes` in Kubernetes?",
      "expectedConcepts": [
        "working_set includes memory that cannot be freed (RSS + unevictable page cache)",
        "OOMKilled uses working_set_bytes, not pure RSS"
      ],
      "sampleStrongAnswer": "`container_memory_working_set_bytes` measures the actual memory the Linux kernel cannot evict under memory pressure (anonymous memory, RSS, and dirty page cache). Kubernetes OOMKilled decisions are based on `working_set_bytes`, not pure RSS. If page cache accumulates and cannot be dropped, working set hits the limit and triggers the OOM killer."
    }
  ]
}
```
