# Reference: Frontend: Power of Four

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Repeatedly divide a validated positive integer by four while divisible and accept only when the final value is one. An alternative is to identify a power of two and verify an even exponent, but bit masks in ordinary Number operators are restricted to 32-bit coercion. Define a separate BigInt version if wider integer support is needed.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)\n        return false; while (n % 4 === 0)\n        n /= 4; return n === 1; });",
    "architectureNotes": "Follow-up: Return the base-four exponent and test values beyond the signed 32-bit range.\nTopic reference: https://namastedev.com/practice/power-of-four\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "power-of-four-correctness",
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
    "Return the base-four exponent and test values beyond the signed 32-bit range."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 1; 4; 8.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "power-of-four-variation",
      "question": "Return the base-four exponent and test values beyond the signed 32-bit range.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Repeatedly divide a validated positive integer by four while divisible and accept only when the final value is one. An alternative is to identify a power of two and verify an even exponent, but bit masks in ordinary Number operators are restricted to 32-bit coercion. Define a separate BigInt version if wider integer support is needed. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
