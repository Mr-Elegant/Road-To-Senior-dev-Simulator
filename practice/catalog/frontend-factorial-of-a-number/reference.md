# Reference: Frontend: Factorial of a number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Define 0! as one, validate an integer input, and multiply iteratively from two through n. Number quickly loses exact integer precision, so BigInt is appropriate for exact large factorials. Convert factors consistently instead of mixing Number and BigInt multiplication. Avoid recursion solely for this loop, since it adds stack depth without improving the model.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isInteger(n) || n < 0 || n > 100)\n        throw new Error('Invalid n'); let result = 1n; for (let i = 2; i <= n; i++)\n        result *= BigInt(i); return result.toString(); });",
    "architectureNotes": "Follow-up: Return the number of trailing decimal zeros using factors of five rather than constructing the entire factorial.\nTopic reference: https://namastedev.com/practice/factorial-of-a-number\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "factorial-of-a-number-correctness",
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
    "Return the number of trailing decimal zeros using factors of five rather than constructing the entire factorial."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 0; 1; ordinary positive input.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "factorial-of-a-number-variation",
      "question": "Return the number of trailing decimal zeros using factors of five rather than constructing the entire factorial.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Define 0! as one, validate an integer input, and multiply iteratively from two through n. Number quickly loses exact integer precision, so BigInt is appropriate for exact large factorials. Convert factors consistently instead of mixing Number and BigInt multiplication. Avoid recursion solely for this loop, since it adds stack depth without improving the model. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
