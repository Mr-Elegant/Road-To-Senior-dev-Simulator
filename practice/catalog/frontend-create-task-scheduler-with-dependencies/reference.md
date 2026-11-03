# Reference: Frontend: Create Task Scheduler With Dependencies

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate task IDs and dependency references, compute indegrees, and queue initially ready tasks. Completion releases dependents by decrementing their unresolved dependency count. Define whether a failed task blocks descendants, triggers cancellation, or allows a compensating policy. Detect cycles independently so an empty ready queue is not mistaken for successful completion. Concurrency slots must be released on every settlement.",
    "codeOrArtifact": "const solution = (function solution(tasks) { const byId = new Map(tasks.map(t => [t.id, t])); for (const t of tasks)\n        for (const dep of t.deps)\n            if (!byId.has(dep))\n                throw new Error('Missing dependency'); const done = new Set(), layers = []; while (done.size < tasks.length) {\n        const ready = tasks.filter(t => !done.has(t.id) && t.deps.every((id) => done.has(id))).map(t => t.id).sort();\n        if (!ready.length)\n            throw new Error('Cycle');\n        layers.push(ready);\n        ready.forEach(id => done.add(id));\n    } return layers; });",
    "architectureNotes": "Follow-up: Persist task states for restart recovery and distinguish at-least-once execution from idempotent task effects.\nTopic reference: https://namastedev.com/practice/create-task-scheduler-with-dependencies\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "create-task-scheduler-with-dependencies-correctness",
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
    "Persist task states for restart recovery and distinguish at-least-once execution from idempotent task effects."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cycle; missing dependency; independent task failure.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "create-task-scheduler-with-dependencies-variation",
      "question": "Persist task states for restart recovery and distinguish at-least-once execution from idempotent task effects.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate task IDs and dependency references, compute indegrees, and queue initially ready tasks. Completion releases dependents by decrementing their unresolved dependency count. Define whether a failed task blocks descendants, triggers cancellation, or allows a compensating policy. Detect cycles independently so an empty ready queue is not mistaken for successful completion. Concurrency slots must be released on every settlement. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
