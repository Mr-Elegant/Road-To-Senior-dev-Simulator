# Reference: Frontend: Oranges Rotting

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Start a multi-source BFS with every initially active source and count remaining susceptible cells. Each level represents one unit of time; mark cells when enqueued so they are not counted twice. If the queue empties with susceptible cells remaining, report failure. Keep the all-already-complete case at zero and decide whether the input grid may be mutated.",
    "codeOrArtifact": "const solution = (function solution(grid) { const a = grid.map(row => [...row]), queue = []; let fresh = 0, minutes = 0; for (let r = 0; r < a.length; r++)\n        for (let c = 0; c < a[r].length; c++) {\n            if (a[r][c] === 1)\n                fresh++;\n            if (a[r][c] === 2)\n                queue.push([r, c, 0]);\n        } for (let head = 0; head < queue.length; head++) {\n        const [r, c, t] = queue[head];\n        minutes = t;\n        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (a[nr]?.[nc] === 1) {\n                a[nr][nc] = 2;\n                fresh--;\n                queue.push([nr, nc, t + 1]);\n            }\n        }\n    } return fresh ? -1 : minutes; });",
    "architectureNotes": "Follow-up: Return the activation time of every cell and preserve the original grid by storing visitation separately.\nTopic reference: https://namastedev.com/practice/oranges-rotting\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "oranges-rotting-correctness",
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
    "Return the activation time of every cell and preserve the original grid by storing visitation separately."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No fresh cells; no sources; isolated cell.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "oranges-rotting-variation",
      "question": "Return the activation time of every cell and preserve the original grid by storing visitation separately.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Start a multi-source BFS with every initially active source and count remaining susceptible cells. Each level represents one unit of time; mark cells when enqueued so they are not counted twice. If the queue empties with susceptible cells remaining, report failure. Keep the all-already-complete case at zero and decide whether the input grid may be mutated. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
