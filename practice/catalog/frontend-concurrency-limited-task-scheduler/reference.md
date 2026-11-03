# Reference: Frontend: Concurrency Limited Task Scheduler

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep a queue and active count. Starting a task consumes one slot; completion, synchronous throw, or rejection releases it in a finally path before pumping more work. Associate each queued task with its own resolve/reject pair. Cancelling queued work removes/rejects it; cancelling active work needs cooperation from the task. Queue capacity is separate from active concurrency.",
    "codeOrArtifact": "const solution = (function solution({ limit, commands }) { if (!Number.isInteger(limit) || limit < 1)\n        throw new Error('Invalid limit'); const active = [], queued = [], completed = [], cancelled = []; const remove = (a, id) => { const i = a.indexOf(id); if (i < 0)\n        return false; a.splice(i, 1); return true; }; for (const c of commands) {\n        if (c.type === 'enqueue')\n            queued.push(c.id);\n        if (c.type === 'complete' && remove(active, c.id))\n            completed.push(c.id);\n        if (c.type === 'cancel' && (remove(queued, c.id) || remove(active, c.id)))\n            cancelled.push(c.id);\n        while (active.length < limit && queued.length)\n            active.push(queued.shift());\n    } return { active, queued, completed, cancelled }; });",
    "architectureNotes": "Follow-up: Add backpressure and fairness priorities without starving old tasks indefinitely.\nTopic reference: https://namastedev.com/practice/concurrency-limited-task-scheduler\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "concurrency-limited-task-scheduler-correctness",
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
    "Add backpressure and fairness priorities without starving old tasks indefinitely."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Queue while busy; rejection releases slot; synchronous throw.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "concurrency-limited-task-scheduler-variation",
      "question": "Add backpressure and fairness priorities without starving old tasks indefinitely.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep a queue and active count. Starting a task consumes one slot; completion, synchronous throw, or rejection releases it in a finally path before pumping more work. Associate each queued task with its own resolve/reject pair. Cancelling queued work removes/rejects it; cancelling active work needs cooperation from the task. Queue capacity is separate from active concurrency. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
