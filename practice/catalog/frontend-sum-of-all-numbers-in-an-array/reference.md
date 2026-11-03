# Reference: Frontend: Sum of all numbers in an array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a linear accumulator or reduce with an initial zero so empty input is defined. Reject or explicitly handle NaN and infinities rather than allowing one invalid value to silently poison the total. Ordinary floating-point addition is order-sensitive; currency, huge integers, and high-accuracy measurements may require different representations or summation algorithms.",
    "codeOrArtifact": "const solution = (function solution(values) { let sum = 0; for (const n of values) {\n        if (typeof n !== 'number' || !Number.isFinite(n))\n            throw new Error('Invalid number');\n        sum += n;\n    } return sum; });",
    "architectureNotes": "Follow-up: Implement compensated summation and compare it with integer-minor-unit arithmetic for money.\nTopic reference: https://namastedev.com/practice/sum-of-all-numbers-in-an-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sum-of-all-numbers-in-an-array-correctness",
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
    "Implement compensated summation and compare it with integer-minor-unit arithmetic for money."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty array; negatives; mixed signs.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sum-of-all-numbers-in-an-array-variation",
      "question": "Implement compensated summation and compare it with integer-minor-unit arithmetic for money.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a linear accumulator or reduce with an initial zero so empty input is defined. Reject or explicitly handle NaN and infinities rather than allowing one invalid value to silently poison the total. Ordinary floating-point addition is order-sensitive; currency, huge integers, and high-accuracy measurements may require different representations or summation algorithms. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
