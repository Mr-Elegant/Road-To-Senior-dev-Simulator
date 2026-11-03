# Reference: Frontend: Detect Cycle in an Undirected Connected Graph (DFS)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In a simple graph DFS, an already visited neighbor that is not the current node’s parent indicates a cycle. To support disconnected input, start a traversal from every unseen vertex. For parallel edges, track edge IDs and skip only the incoming edge, since skipping every edge to the parent hides a two-edge multigraph cycle.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []); edges.forEach(([a, b], id) => { adj[a].push([b, id]); adj[b].push([a, id]); }); const seen = new Set(); function dfs(v, incoming) { seen.add(v); for (const [next, id] of adj[v]) {\n        if (id === incoming)\n            continue;\n        if (seen.has(next) || dfs(next, id))\n            return true;\n    } return false; } for (let i = 0; i < count; i++)\n        if (!seen.has(i) && dfs(i, -1))\n            return true; return false; });",
    "architectureNotes": "Follow-up: Produce the actual cycle path and explain how edge identity changes multigraph detection.\nTopic reference: https://namastedev.com/practice/detect-cycle-in-an-undirected-connected-graph-dfs\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "detect-cycle-in-an-undirected-connected-graph-dfs-correctness",
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
    "Produce the actual cycle path and explain how edge identity changes multigraph detection."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Tree; triangle; self-loop.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "detect-cycle-in-an-undirected-connected-graph-dfs-variation",
      "question": "Produce the actual cycle path and explain how edge identity changes multigraph detection.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "In a simple graph DFS, an already visited neighbor that is not the current node’s parent indicates a cycle. To support disconnected input, start a traversal from every unseen vertex. For parallel edges, track edge IDs and skip only the incoming edge, since skipping every edge to the parent hides a two-edge multigraph cycle. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
