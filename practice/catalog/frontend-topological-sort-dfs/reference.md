# Reference: Frontend: Topological Sort (DFS)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use three visitation states: unseen, active on the DFS path, and complete. An edge to an active node proves a directed cycle. Append nodes when their descendants finish, then reverse the completion list. Visit every vertex so disconnected components are included. Time and space are O(V+E), while deep graphs may require an explicit DFS stack.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []); for (const [a, b] of edges)\n        adj[a].push(b); adj.forEach(a => a.sort((x, y) => x - y)); const state = Array(count).fill(0), out = []; function dfs(v) { if (state[v] === 1)\n        throw new Error('Cycle'); if (state[v] === 2)\n        return; state[v] = 1; for (const next of adj[v])\n        dfs(next); state[v] = 2; out.push(v); } for (let v = 0; v < count; v++)\n        dfs(v); return out.reverse(); });",
    "architectureNotes": "Follow-up: Return a cycle witness and distinguish an edge to an active node from an edge to an already completed node.\nTopic reference: https://namastedev.com/practice/topological-sort-dfs\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "topological-sort-dfs-correctness",
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
    "Return a cycle witness and distinguish an edge to an active node from an edge to an already completed node."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Disconnected vertices; self-loop; cycle.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "topological-sort-dfs-variation",
      "question": "Return a cycle witness and distinguish an edge to an active node from an edge to an already completed node.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use three visitation states: unseen, active on the DFS path, and complete. An edge to an active node proves a directed cycle. Append nodes when their descendants finish, then reverse the completion list. Visit every vertex so disconnected components are included. Time and space are O(V+E), while deep graphs may require an explicit DFS stack. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
