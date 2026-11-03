# Reference: Frontend: Shortest Distance from Source (BFS)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a queue, initialize the source distance to zero, and mark vertices when enqueued so each vertex enters once. Each newly discovered neighbor has its parent distance plus one. Use a head index rather than repeated array shift to preserve linear queue behavior. BFS is O(V+E); it does not solve arbitrary weighted shortest paths.",
    "codeOrArtifact": "const solution = (function solution({ count, edges, source }) { const adj = Array.from({ length: count }, () => []); for (const [a, b] of edges) {\n        adj[a].push(b);\n        adj[b].push(a);\n    } const distance = Array(count).fill(null), queue = [source]; distance[source] = 0; for (let head = 0; head < queue.length; head++) {\n        const v = queue[head];\n        for (const n of adj[v])\n            if (distance[n] === null) {\n                distance[n] = distance[v] + 1;\n                queue.push(n);\n            }\n    } return distance; });",
    "architectureNotes": "Follow-up: Return parent links for path reconstruction and define deterministic tie-breaking among equally short paths.\nTopic reference: https://namastedev.com/practice/shortest-distance-from-source-bfs\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "shortest-distance-from-source-bfs-correctness",
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
    "Return parent links for path reconstruction and define deterministic tie-breaking among equally short paths."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Disconnected node; self-loop; multiple equal paths.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "shortest-distance-from-source-bfs-variation",
      "question": "Return parent links for path reconstruction and define deterministic tie-breaking among equally short paths.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a queue, initialize the source distance to zero, and mark vertices when enqueued so each vertex enters once. Each newly discovered neighbor has its parent distance plus one. Use a head index rather than repeated array shift to preserve linear queue behavior. BFS is O(V+E); it does not solve arbitrary weighted shortest paths. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
