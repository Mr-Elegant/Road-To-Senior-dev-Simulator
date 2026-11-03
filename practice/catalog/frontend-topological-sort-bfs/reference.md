# Reference: Frontend: Topological Sort (BFS)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Compute each vertex’s indegree, enqueue all zero-indegree vertices, and remove them one by one while decrementing outgoing neighbors. Enqueue a neighbor exactly when its indegree becomes zero. If fewer than V vertices are emitted, the graph contains a cycle. Multiple valid orders exist; use a priority queue if a lexicographic choice is required.",
    "codeOrArtifact": "const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []), degree = Array(count).fill(0); for (const [a, b] of edges) {\n        adj[a].push(b);\n        degree[b]++;\n    } const ready = [], out = []; degree.forEach((d, i) => { if (!d)\n        ready.push(i); }); while (ready.length) {\n        ready.sort((a, b) => a - b);\n        const v = ready.shift();\n        out.push(v);\n        for (const n of adj[v])\n            if (--degree[n] === 0)\n                ready.push(n);\n    } if (out.length !== count)\n        throw new Error('Cycle'); return out; });",
    "architectureNotes": "Follow-up: Produce dependency layers for concurrent execution while preserving a separate cycle-reporting path.\nTopic reference: https://namastedev.com/practice/topological-sort-bfs\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "topological-sort-bfs-correctness",
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
    "Produce dependency layers for concurrent execution while preserving a separate cycle-reporting path."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Independent nodes; diamond; cycle.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "topological-sort-bfs-variation",
      "question": "Produce dependency layers for concurrent execution while preserving a separate cycle-reporting path.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Compute each vertex’s indegree, enqueue all zero-indegree vertices, and remove them one by one while decrementing outgoing neighbors. Enqueue a neighbor exactly when its indegree becomes zero. If fewer than V vertices are emitted, the graph contains a cycle. Multiple valid orders exist; use a priority queue if a lexicographic choice is required. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
