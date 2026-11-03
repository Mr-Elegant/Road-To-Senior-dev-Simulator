# Reference: Frontend: Shortest Distance from Source (Dijkstra's Algorithm)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a min-heap of candidate distances, initialize the source to zero, and relax outgoing edges from the smallest valid entry. With a lazy heap, skip entries whose recorded distance is stale. Reject negative weights because the settled-distance argument no longer holds. Complexity with a binary heap is typically O((V+E) log V), with implementation-dependent lazy-heap bounds.",
    "codeOrArtifact": "const solution = (function solution({ count, edges, source }) { if (edges.some((e) => e[2] < 0))\n        throw new Error('Negative edge'); const adj = Array.from({ length: count }, () => []); for (const [a, b, w] of edges)\n        adj[a].push([b, w]); const d = Array(count).fill(Infinity), used = Array(count).fill(false); d[source] = 0; for (let step = 0; step < count; step++) {\n        let v = -1;\n        for (let i = 0; i < count; i++)\n            if (!used[i] && (v < 0 || d[i] < d[v]))\n                v = i;\n        if (v < 0 || d[v] === Infinity)\n            break;\n        used[v] = true;\n        for (const [n, w] of adj[v])\n            if (!used[n])\n                d[n] = Math.min(d[n], d[v] + w);\n    } return d.map(n => n === Infinity ? null : n); });",
    "architectureNotes": "Follow-up: Add path reconstruction and compare with Bellman–Ford when negative weights are permitted.\nTopic reference: https://namastedev.com/practice/shortest-distance-from-source-dijkstras-algorithm\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "shortest-distance-from-source-dijkstras-algorithm-correctness",
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
    "Add path reconstruction and compare with Bellman–Ford when negative weights are permitted."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero-weight edge; unreachable node; repeated improvements.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "shortest-distance-from-source-dijkstras-algorithm-variation",
      "question": "Add path reconstruction and compare with Bellman–Ford when negative weights are permitted.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a min-heap of candidate distances, initialize the source to zero, and relax outgoing edges from the smallest valid entry. With a lazy heap, skip entries whose recorded distance is stale. Reject negative weights because the settled-distance argument no longer holds. Complexity with a binary heap is typically O((V+E) log V), with implementation-dependent lazy-heap bounds. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
