# Reference: Frontend: Prim's MST Algorithm

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Grow a visited set from one start vertex. Push boundary edges into a minimum heap, repeatedly choose the cheapest edge entering an unvisited vertex, and add that vertex’s outgoing edges. Skip edges whose destination is already visited. A lazy heap implementation is O(E log E), often expressed as O(E log V) for ordinary simple graphs. Negative edge weights are allowed; connectivity must be checked.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { if (!count)\n        return 0; const matrix = Array.from({ length: count }, () => Array(count).fill(Infinity)); for (const [a, b, w] of edges)\n        matrix[a][b] = matrix[b][a] = Math.min(matrix[a][b], w); const used = Array(count).fill(false), distance = Array(count).fill(Infinity); distance[0] = 0; let total = 0; for (let step = 0; step < count; step++) {\n        let v = -1;\n        for (let i = 0; i < count; i++)\n            if (!used[i] && (v < 0 || distance[i] < distance[v]))\n                v = i;\n        if (v < 0 || distance[v] === Infinity)\n            throw new Error('Disconnected');\n        used[v] = true;\n        total += distance[v];\n        for (let i = 0; i < count; i++)\n            if (!used[i])\n                distance[i] = Math.min(distance[i], matrix[v][i]);\n    } return total; });",
    "architectureNotes": "Follow-up: Return a minimum spanning forest for disconnected input and explain why directed graphs need a different problem formulation.\nTopic reference: https://namastedev.com/practice/prims-mst-algorithm\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "prims-mst-algorithm-correctness",
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
    "Return a minimum spanning forest for disconnected input and explain why directed graphs need a different problem formulation."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Single vertex; equal weights; negative weight.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "prims-mst-algorithm-variation",
      "question": "Return a minimum spanning forest for disconnected input and explain why directed graphs need a different problem formulation.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Grow a visited set from one start vertex. Push boundary edges into a minimum heap, repeatedly choose the cheapest edge entering an unvisited vertex, and add that vertex’s outgoing edges. Skip edges whose destination is already visited. A lazy heap implementation is O(E log E), often expressed as O(E log V) for ordinary simple graphs. Negative edge weights are allowed; connectivity must be checked. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
