# Reference: Frontend: Implement Garbage Collector

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent heap objects as IDs with outgoing references and provide an explicit root set. Mark every reachable object using a visited traversal, then sweep only unmarked allocated objects. Unreachable cycles are collected because reachability is defined from roots, not incoming-reference count alone. This model excludes real engine barriers, generations, moving collectors, finalizers, and concurrent mutation.",
    "codeOrArtifact": "const solution = (function solution({ objects, roots }) { const heap = new Map(objects.map((o) => [o.id, o.refs])); for (const refs of heap.values())\n        for (const id of refs)\n            if (!heap.has(id))\n                throw new Error('Dangling reference'); for (const id of roots)\n        if (!heap.has(id))\n            throw new Error('Unknown root'); const marked = new Set(), stack = [...roots]; while (stack.length) {\n        const id = stack.pop();\n        if (marked.has(id))\n            continue;\n        marked.add(id);\n        stack.push(...heap.get(id));\n    } return { survivors: [...marked].sort(), collected: [...heap.keys()].filter(id => !marked.has(id)).sort() }; });",
    "architectureNotes": "Follow-up: Add an incremental marking model and state the write-barrier invariant needed when the graph changes during marking.\nTopic reference: https://namastedev.com/practice/implement-garbage-collector\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-garbage-collector-correctness",
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
    "Add an incremental marking model and state the write-barrier invariant needed when the graph changes during marking."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Reachable cycle; unreachable cycle; no roots.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-garbage-collector-variation",
      "question": "Add an incremental marking model and state the write-barrier invariant needed when the graph changes during marking.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent heap objects as IDs with outgoing references and provide an explicit root set. Mark every reachable object using a visited traversal, then sweep only unmarked allocated objects. Unreachable cycles are collected because reachability is defined from roots, not incoming-reference count alone. This model excludes real engine barriers, generations, moving collectors, finalizers, and concurrent mutation. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
