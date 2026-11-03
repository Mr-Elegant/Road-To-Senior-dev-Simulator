# Reference: Frontend: Sum of Consecutive Integers

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a sequence length k, subtract k(k-1)/2 from the target and require the remainder to be a positive multiple of k. Iterate lengths while the smallest possible sum 1+…+k does not exceed the target. This is O(sqrt n) arithmetic steps. Be explicit that zero/negative starting values are excluded; allowing them changes the answer and bounds.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)\n        throw new Error('Invalid n'); let count = 0; for (let k = 1; k * (k + 1) / 2 <= n; k++) {\n        const remainder = n - k * (k - 1) / 2;\n        if (remainder > 0 && remainder % k === 0)\n            count++;\n    } return count; });",
    "architectureNotes": "Follow-up: Return each starting value and length, and relate the count to odd divisors under the same positivity assumptions.\nTopic reference: https://namastedev.com/practice/sum-of-consecutive-integers\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sum-of-consecutive-integers-correctness",
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
    "Return each starting value and length, and relate the count to odd divisors under the same positivity assumptions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Target one; power of two; odd target.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sum-of-consecutive-integers-variation",
      "question": "Return each starting value and length, and relate the count to odd divisors under the same positivity assumptions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a sequence length k, subtract k(k-1)/2 from the target and require the remainder to be a positive multiple of k. Iterate lengths while the smallest possible sum 1+…+k does not exceed the target. This is O(sqrt n) arithmetic steps. Be explicit that zero/negative starting values are excluded; allowing them changes the answer and bounds. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
