# Reference: Frontend: Fibonacci Modulo (Pisano Period)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A Pisano period is the repetition length of the pair (F_n mod m,F_(n+1) mod m). For small moduli, detect the return to (0,1), reduce n by the period, and compute the reduced term. Handle m=1 separately. Period discovery may be too expensive for large moduli; fast doubling computes F_n mod m in O(log n) arithmetic steps without discovering a period.",
    "codeOrArtifact": "const solution = (function solution({ n, modulus }) { if (!/^\\d+$/.test(n) || !Number.isInteger(modulus) || modulus < 1 || modulus > 1000000)\n        throw new Error('Invalid input'); const m = BigInt(modulus); function fib(k) { if (k === 0n)\n        return [0n, 1n % m]; const [a, b] = fib(k / 2n), c = a * ((2n * b - a + m) % m) % m, d = (a * a + b * b) % m; return k % 2n ? [d, (c + d) % m] : [c, d]; } return Number(fib(BigInt(n))[0]); });",
    "architectureNotes": "Follow-up: Use fast doubling as the general method and explain when explicit period discovery is useful or wasteful.\nTopic reference: https://namastedev.com/practice/fibonacci-modulo-pisano-period\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "fibonacci-modulo-pisano-period-correctness",
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
    "Use fast doubling as the general method and explain when explicit period discovery is useful or wasteful."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: m=1; n=0; small known cycle.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "fibonacci-modulo-pisano-period-variation",
      "question": "Use fast doubling as the general method and explain when explicit period discovery is useful or wasteful.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "A Pisano period is the repetition length of the pair (F_n mod m,F_(n+1) mod m). For small moduli, detect the return to (0,1), reduce n by the period, and compute the reduced term. Handle m=1 separately. Period discovery may be too expensive for large moduli; fast doubling computes F_n mod m in O(log n) arithmetic steps without discovering a period. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
