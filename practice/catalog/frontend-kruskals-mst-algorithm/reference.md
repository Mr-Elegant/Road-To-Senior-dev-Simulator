# Reference: Frontend: Kruskal's MST Algorithm

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Sort undirected edges by weight, then use a disjoint-set union structure with path compression and union by rank/size. Accept an edge only if its endpoints have different representatives, then union those components. Sorting dominates at O(E log E); DSU operations are almost constant amortized. A connected graph’s result has V-1 edges; disconnected input produces a forest unless the contract rejects it.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { const parent = Array.from({ length: count }, (_, i) => i), size = Array(count).fill(1); function find(v) { while (parent[v] !== v) {\n        parent[v] = parent[parent[v]];\n        v = parent[v];\n    } return v; } let weight = 0, components = count; for (const [a, b, w] of [...edges].sort((a, b) => a[2] - b[2])) {\n        let ra = find(a), rb = find(b);\n        if (ra === rb)\n            continue;\n        if (size[ra] < size[rb])\n            [ra, rb] = [rb, ra];\n        parent[rb] = ra;\n        size[ra] += size[rb];\n        components--;\n        weight += w;\n    } return { weight, components }; });",
    "architectureNotes": "Follow-up: Return component information and a deterministic tie-breaking policy without claiming the MST is unique.\nTopic reference: https://namastedev.com/practice/kruskals-mst-algorithm\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "kruskals-mst-algorithm-correctness",
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
    "Return component information and a deterministic tie-breaking policy without claiming the MST is unique."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cycle edge rejected; disconnected graph; negative weights.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "kruskals-mst-algorithm-variation",
      "question": "Return component information and a deterministic tie-breaking policy without claiming the MST is unique.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Sort undirected edges by weight, then use a disjoint-set union structure with path compression and union by rank/size. Accept an edge only if its endpoints have different representatives, then union those components. Sorting dominates at O(E log E); DSU operations are almost constant amortized. A connected graph’s result has V-1 edges; disconnected input produces a forest unless the contract rejects it. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
