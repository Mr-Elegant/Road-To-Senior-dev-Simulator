# Reference: Frontend: Shortest Distance from Source (Bellman-Ford Algorithm)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Initialize the source to zero and other distances to infinity. Relax all edges up to V-1 passes, stopping early if no distance changes. An additional successful relaxation from a reachable vertex proves a reachable negative cycle. A negative cycle in an unreachable component does not invalidate source distances. Runtime is O(VE), with O(V) distance storage.",
    "codeOrArtifact": "const solution = (function solution({ count, edges, source }) { const d = Array(count).fill(Infinity); d[source] = 0; for (let step = 0; step < count - 1; step++) {\n        let changed = false;\n        for (const [a, b, w] of edges)\n            if (d[a] !== Infinity && d[a] + w < d[b]) {\n                d[b] = d[a] + w;\n                changed = true;\n            }\n        if (!changed)\n            break;\n    } for (const [a, b, w] of edges)\n        if (d[a] !== Infinity && d[a] + w < d[b])\n            throw new Error('Negative cycle'); return d.map(v => v === Infinity ? null : v); });",
    "architectureNotes": "Follow-up: Propagate an unbounded marker to every vertex reachable from a detected negative cycle.\nTopic reference: https://namastedev.com/practice/shortest-distance-from-source-bellman-ford-algorithm\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "shortest-distance-from-source-bellman-ford-algorithm-correctness",
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
    "Propagate an unbounded marker to every vertex reachable from a detected negative cycle."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Negative edge; unreachable component; early stop.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "shortest-distance-from-source-bellman-ford-algorithm-variation",
      "question": "Propagate an unbounded marker to every vertex reachable from a detected negative cycle.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Initialize the source to zero and other distances to infinity. Relax all edges up to V-1 passes, stopping early if no distance changes. An additional successful relaxation from a reachable vertex proves a reachable negative cycle. A negative cycle in an unreachable component does not invalidate source distances. Runtime is O(VE), with O(V) distance storage. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
