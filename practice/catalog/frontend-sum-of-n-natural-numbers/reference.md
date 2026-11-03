# Reference: Frontend: Sum of n natural numbers

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use n(n+1)/2 rather than a loop when only the total is required. With BigInt, divide one even factor before or after multiplication using exact integer arithmetic. Number inputs need safe-integer validation for both the input and result; a small enough input type does not automatically guarantee the product remains exactly representable.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!/^\\d+$/.test(n))\n        throw new Error('Invalid n'); const value = BigInt(n); return (value * (value + 1n) / 2n).toString(); });",
    "architectureNotes": "Follow-up: Compute a closed integer range sum and avoid overflow-prone intermediate operations in fixed-width languages.\nTopic reference: https://namastedev.com/practice/sum-of-n-natural-numbers\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sum-of-n-natural-numbers-correctness",
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
    "Compute a closed integer range sum and avoid overflow-prone intermediate operations in fixed-width languages."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: n=0; n=1; ordinary n.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sum-of-n-natural-numbers-variation",
      "question": "Compute a closed integer range sum and avoid overflow-prone intermediate operations in fixed-width languages.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use n(n+1)/2 rather than a loop when only the total is required. With BigInt, divide one even factor before or after multiplication using exact integer arithmetic. Number inputs need safe-integer validation for both the input and result; a small enough input type does not automatically guarantee the product remains exactly representable. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
