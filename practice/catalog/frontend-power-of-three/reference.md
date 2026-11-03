# Reference: Frontend: Power of Three

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate a positive integer, repeatedly divide by three while divisible, and accept only if the remainder value becomes one. Floating-point logarithm comparisons can be close to an integer without being exact and need additional proof or checks. Safe-integer limits still apply to Number input; use a separate BigInt contract for arbitrary-size integers.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)\n        return false; while (n % 3 === 0)\n        n /= 3; return n === 1; });",
    "architectureNotes": "Follow-up: Find the exponent as well as the boolean result without relying on floating-point logarithms.\nTopic reference: https://namastedev.com/practice/power-of-three\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "power-of-three-correctness",
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
    "Find the exponent as well as the boolean result without relying on floating-point logarithms."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 1; 3; neighboring non-power.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "power-of-three-variation",
      "question": "Find the exponent as well as the boolean result without relying on floating-point logarithms.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate a positive integer, repeatedly divide by three while divisible, and accept only if the remainder value becomes one. Floating-point logarithm comparisons can be close to an integer without being exact and need additional proof or checks. Safe-integer limits still apply to Number input; use a separate BigInt contract for arbitrary-size integers. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
