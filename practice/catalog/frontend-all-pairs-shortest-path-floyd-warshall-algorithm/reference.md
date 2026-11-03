# Reference: Frontend: All Pairs Shortest Path (Floyd-Warshall Algorithm)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Initialize diagonal distances to zero and each direct edge to the minimum parallel-edge weight. For each intermediate vertex k, relax every i,j through k, keeping k as the outer loop. Skip unreachable additions. Runtime is O(V cubed) and storage O(V squared). A negative diagonal indicates a negative cycle; pairs that can route through it do not have a finite shortest distance.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { const d = Array.from({ length: count }, (_, i) => Array.from({ length: count }, (_, j) => i === j ? 0 : Infinity)); for (const [a, b, w] of edges)\n        d[a][b] = Math.min(d[a][b], w); for (let k = 0; k < count; k++)\n        for (let i = 0; i < count; i++)\n            for (let j = 0; j < count; j++)\n                if (d[i][k] !== Infinity && d[k][j] !== Infinity)\n                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]); if (d.some((row, i) => row[i] < 0))\n        throw new Error('Negative cycle'); return d.map(row => row.map(v => v === Infinity ? null : v)); });",
    "architectureNotes": "Follow-up: Maintain a next-hop matrix for path reconstruction and mark pairs whose result is unbounded by a reachable negative cycle.\nTopic reference: https://namastedev.com/practice/all-pairs-shortest-path-floyd-warshall-algorithm\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "all-pairs-shortest-path-floyd-warshall-algorithm-correctness",
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
    "Maintain a next-hop matrix for path reconstruction and mark pairs whose result is unbounded by a reachable negative cycle."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Disconnected pair; parallel edge; negative edge.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "all-pairs-shortest-path-floyd-warshall-algorithm-variation",
      "question": "Maintain a next-hop matrix for path reconstruction and mark pairs whose result is unbounded by a reachable negative cycle.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Initialize diagonal distances to zero and each direct edge to the minimum parallel-edge weight. For each intermediate vertex k, relax every i,j through k, keeping k as the outer loop. Skip unreachable additions. Runtime is O(V cubed) and storage O(V squared). A negative diagonal indicates a negative cycle; pairs that can route through it do not have a finite shortest distance. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
