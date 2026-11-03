# Reference: Frontend: Power of Two

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a safe-integer Number, reject nonpositive or noninteger values and divide by two while the remainder is zero; accept exactly when the final value is one. This takes O(log n) time and avoids the 32-bit coercion of n & (n-1). A BigInt implementation can use that bit identity safely for arbitrary-width positive integers.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)\n        return false; while (n % 2 === 0)\n        n /= 2; return n === 1; });",
    "architectureNotes": "Follow-up: Implement Number and BigInt variants with separate input contracts rather than mixing numeric types.\nTopic reference: https://namastedev.com/practice/power-of-two\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "power-of-two-correctness",
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
    "Implement Number and BigInt variants with separate input contracts rather than mixing numeric types."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 1; 0; negative value.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "power-of-two-variation",
      "question": "Implement Number and BigInt variants with separate input contracts rather than mixing numeric types.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a safe-integer Number, reject nonpositive or noninteger values and divide by two while the remainder is zero; accept exactly when the final value is one. This takes O(log n) time and avoids the 32-bit coercion of n & (n-1). A BigInt implementation can use that bit identity safely for arbitrary-width positive integers. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
