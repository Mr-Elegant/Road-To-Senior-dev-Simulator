# Reference: Frontend: Worker Pool

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A promise concurrency loop does not create CPU parallelism. Create a limited number of Workers, send serializable tasks, and correlate results by unique IDs. Release or replace a worker on success, failure, or timeout and settle each task exactly once. Structured cloning and transferables affect cost and ownership. Cancellation may require terminating a worker and rebuilding its state.",
    "codeOrArtifact": "const solution = (function solution({ workers, jobs, events }) { const active = Array(workers).fill(null), queued = [...jobs], assignments = [], completed = []; function pump() { for (let w = 0; w < workers; w++)\n        if (active[w] === null && queued.length) {\n            active[w] = queued.shift();\n            assignments.push([w, active[w]]);\n        } } pump(); for (const e of events) {\n        const job = active[e.worker];\n        if (job !== null && job !== undefined) {\n            if (e.type === 'done')\n                completed.push(job);\n            else\n                queued.unshift(job);\n            active[e.worker] = null;\n        }\n        pump();\n    } return { assignments, completed, active, queued }; });",
    "architectureNotes": "Follow-up: Add backpressure, per-task deadlines, and worker replacement without leaking unsettled promises.\nTopic reference: https://namastedev.com/practice/worker-pool\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "worker-pool-correctness",
      "category": "correctness",
      "label": "Observable behavior and reasoning",
      "weight": 5,
      "description": "Use the executable cases as behavioral evidence; explain invariant, validation, complexity, and limits.",
      "levels": [
        {
          "score": 0,
          "description": "The main behavior does not work."
        },
        {
          "score": 1,
          "description": "Only a happy path works."
        },
        {
          "score": 2,
          "description": "Authored cases pass but the reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "Authored cases pass and the invariant, boundaries, and trade-offs are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Add backpressure, per-task deadlines, and worker replacement without leaking unsettled promises."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Worker crash; timeout; out-of-order results.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "worker-pool-variation",
      "question": "Add backpressure, per-task deadlines, and worker replacement without leaking unsettled promises.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "A promise concurrency loop does not create CPU parallelism. Create a limited number of Workers, send serializable tasks, and correlate results by unique IDs. Release or replace a worker on success, failure, or timeout and settle each task exactly once. Structured cloning and transferables affect cost and ownership. Cancellation may require terminating a worker and rebuilding its state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
