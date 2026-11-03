# Reference: Frontend: Search in a 2D Sorted Matrix

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Start at the top-right cell. If the target is smaller, move left; if larger, move down. Each comparison discards one row or column, yielding O(rows+cols) time and O(1) extra space. Flattened binary search is only valid under the stronger property that every row starts after the previous row ends.",
    "codeOrArtifact": "const solution = (function solution({ matrix, target }) { let r = 0, c = (matrix[0]?.length || 0) - 1; while (r < matrix.length && c >= 0) {\n        if (matrix[r][c] === target)\n            return true;\n        if (matrix[r][c] > target)\n            c--;\n        else\n            r++;\n    } return false; });",
    "architectureNotes": "Follow-up: Compare the staircase algorithm with flattened binary search and state their different preconditions.\nTopic reference: https://namastedev.com/practice/search-in-a-2d-sorted-matrix\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "search-in-a-2d-sorted-matrix-correctness",
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
    "Compare the staircase algorithm with flattened binary search and state their different preconditions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One row/column; absent target; duplicate values.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "search-in-a-2d-sorted-matrix-variation",
      "question": "Compare the staircase algorithm with flattened binary search and state their different preconditions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Start at the top-right cell. If the target is smaller, move left; if larger, move down. Each comparison discards one row or column, yielding O(rows+cols) time and O(1) extra space. Flattened binary search is only valid under the stronger property that every row starts after the previous row ends. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
