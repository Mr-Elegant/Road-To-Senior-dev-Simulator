# Reference: Frontend: Spiral Matrix Pathfinder

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Maintain top, bottom, left, and right boundaries. Traverse the top row and right column, shrink those boundaries, then traverse the bottom row and left column only if a valid rectangle remains. These guard checks prevent duplication for a final single row or column. Time is O(rows*cols) and auxiliary boundary state is O(1), excluding output.",
    "codeOrArtifact": "const solution = (function solution(matrix) { if (!matrix.length || !matrix[0].length)\n        return []; let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1; const out = []; while (top <= bottom && left <= right) {\n        for (let c = left; c <= right; c++)\n            out.push(matrix[top][c]);\n        top++;\n        for (let r = top; r <= bottom; r++)\n            out.push(matrix[r][right]);\n        right--;\n        if (top <= bottom) {\n            for (let c = right; c >= left; c--)\n                out.push(matrix[bottom][c]);\n            bottom--;\n        }\n        if (left <= right) {\n            for (let r = bottom; r >= top; r--)\n                out.push(matrix[r][left]);\n            left++;\n        }\n    } return out; });",
    "architectureNotes": "Follow-up: Return coordinates as well as values and define obstacle behavior as a separate pathfinding problem.\nTopic reference: https://namastedev.com/practice/spiral-matrix-pathfinder\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "spiral-matrix-pathfinder-correctness",
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
    "Return coordinates as well as values and define obstacle behavior as a separate pathfinding problem."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One row; one column; odd square.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "spiral-matrix-pathfinder-variation",
      "question": "Return coordinates as well as values and define obstacle behavior as a separate pathfinding problem.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Maintain top, bottom, left, and right boundaries. Traverse the top row and right column, shrink those boundaries, then traverse the bottom row and left column only if a valid rectangle remains. These guard checks prevent duplication for a final single row or column. Time is O(rows*cols) and auxiliary boundary state is O(1), excluding output. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
