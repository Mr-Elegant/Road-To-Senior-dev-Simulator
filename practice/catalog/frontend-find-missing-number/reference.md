# Reference: Frontend: Find Missing Number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The expected sum is n(n+1)/2; subtract the actual sum to obtain the missing value in linear time and constant extra space. In JavaScript ensure the sums remain within safe integer precision or use BigInt throughout. XOR is another linear method but ordinary bitwise operators coerce to signed 32-bit integers, so it is not a universal numeric replacement.",
    "codeOrArtifact": "const solution = (function solution(values) { const n = values.length; return n * (n + 1) / 2 - values.reduce((a, b) => a + b, 0); });",
    "architectureNotes": "Follow-up: Reject duplicates/out-of-range values in a validation variant and explain the extra work needed to verify the precondition.\nTopic reference: https://namastedev.com/practice/find-missing-number\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "find-missing-number-correctness",
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
    "Reject duplicates/out-of-range values in a validation variant and explain the extra work needed to verify the precondition."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Missing 0; missing n; empty array.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "find-missing-number-variation",
      "question": "Reject duplicates/out-of-range values in a validation variant and explain the extra work needed to verify the precondition.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "The expected sum is n(n+1)/2; subtract the actual sum to obtain the missing value in linear time and constant extra space. In JavaScript ensure the sums remain within safe integer precision or use BigInt throughout. XOR is another linear method but ordinary bitwise operators coerce to signed 32-bit integers, so it is not a universal numeric replacement. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
