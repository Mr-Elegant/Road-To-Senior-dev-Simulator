# Reference: Frontend: Sum of Subarray Minimum

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For each position count how many subarrays choose that element as their representative minimum, using distances to appropriate smaller boundaries. With duplicates, make one side strict and the other non-strict so equal minima are counted exactly once. Monotonic stacks find boundaries in O(n). If a modulus is required, preserve integer accuracy in multiplication and normalize negative remainders deliberately.",
    "codeOrArtifact": "const solution = (function solution(values) { const stack = [], left = [], right = Array(values.length).fill(values.length); for (let i = 0; i < values.length; i++) {\n        while (stack.length && values[stack[stack.length - 1]] >= values[i])\n            right[stack.pop()] = i;\n        left[i] = stack.length ? stack[stack.length - 1] : -1;\n        stack.push(i);\n    } return values.reduce((sum, n, i) => sum + n * (i - left[i]) * (right[i] - i), 0); });",
    "architectureNotes": "Follow-up: Return both minimum and maximum contribution totals and prove the asymmetric duplicate tie rule.\nTopic reference: https://namastedev.com/practice/sum-of-subarray-minimum\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sum-of-subarray-minimum-correctness",
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
    "Return both minimum and maximum contribution totals and prove the asymmetric duplicate tie rule."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Equal values; increasing/decreasing sequence; one item.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sum-of-subarray-minimum-variation",
      "question": "Return both minimum and maximum contribution totals and prove the asymmetric duplicate tie rule.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For each position count how many subarrays choose that element as their representative minimum, using distances to appropriate smaller boundaries. With duplicates, make one side strict and the other non-strict so equal minima are counted exactly once. Monotonic stacks find boundaries in O(n). If a modulus is required, preserve integer accuracy in multiplication and normalize negative remainders deliberately. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
