# Reference: Frontend: Find the Single Element in a Sorted Array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use binary search and align the midpoint to an even index. If nums[mid] equals nums[mid+1], intact pairs still occupy the left portion and the singleton lies to the right; otherwise it lies at or left of mid. Shrink until one index remains. This is O(log n) time and O(1) space under the exact sorted-pair precondition.",
    "codeOrArtifact": "const solution = (function solution(values) { let l = 0, r = values.length - 1; while (l < r) {\n        let m = l + Math.floor((r - l) / 2);\n        if (m % 2)\n            m--;\n        if (values[m] === values[m + 1])\n            l = m + 2;\n        else\n            r = m;\n    } return values[l]; });",
    "architectureNotes": "Follow-up: Explain why the parity invariant fails if counts are not exactly two or the array is not sorted.\nTopic reference: https://namastedev.com/practice/find-the-single-element-in-a-sorted-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "find-the-single-element-in-a-sorted-array-correctness",
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
    "Explain why the parity invariant fails if counts are not exactly two or the array is not sorted."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Singleton first/last; one-element array; ordinary middle.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "find-the-single-element-in-a-sorted-array-variation",
      "question": "Explain why the parity invariant fails if counts are not exactly two or the array is not sorted.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use binary search and align the midpoint to an even index. If nums[mid] equals nums[mid+1], intact pairs still occupy the left portion and the singleton lies to the right; otherwise it lies at or left of mid. Shrink until one index remains. This is O(log n) time and O(1) space under the exact sorted-pair precondition. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
