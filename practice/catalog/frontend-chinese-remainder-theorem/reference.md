# Reference: Frontend: Chinese Remainder Theorem

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Let M be the product of moduli and Mi=M/mi. Compute the modular inverse of Mi modulo mi using the extended Euclidean algorithm, then sum ai*Mi*inverse and normalize modulo M. Use BigInt so intermediate products remain exact. If moduli are not pairwise coprime, the inverse-based formula is invalid; a generalized merge must test residue compatibility modulo each gcd.",
    "codeOrArtifact": "const solution = (function solution({ residues, moduli }) { const ms = moduli.map((s) => BigInt(s)), as = residues.map((s) => BigInt(s)); const norm = (a, m) => (a % m + m) % m; function egcd(a, b) { if (b === 0n)\n        return [a, 1n, 0n]; const [g, x, y] = egcd(b, a % b); return [g, y, x - a / b * y]; } for (let i = 0; i < ms.length; i++)\n        for (let j = 0; j < i; j++)\n            if (egcd(ms[i], ms[j])[0] !== 1n)\n                throw new Error('Not coprime'); const modulus = ms.reduce((a, b) => a * b, 1n); let result = 0n; for (let i = 0; i < ms.length; i++) {\n        const part = modulus / ms[i], inverse = norm(egcd(part, ms[i])[1], ms[i]);\n        result += as[i] * part * inverse;\n    } return { value: norm(result, modulus).toString(), modulus: modulus.toString() }; });",
    "architectureNotes": "Follow-up: Implement generalized pairwise merging and return no solution when the residue difference is not divisible by the gcd.\nTopic reference: https://namastedev.com/practice/chinese-remainder-theorem\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "chinese-remainder-theorem-correctness",
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
    "Implement generalized pairwise merging and return no solution when the residue difference is not divisible by the gcd."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Negative residue; modulus one policy; coprime system.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "chinese-remainder-theorem-variation",
      "question": "Implement generalized pairwise merging and return no solution when the residue difference is not divisible by the gcd.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Let M be the product of moduli and Mi=M/mi. Compute the modular inverse of Mi modulo mi using the extended Euclidean algorithm, then sum ai*Mi*inverse and normalize modulo M. Use BigInt so intermediate products remain exact. If moduli are not pairwise coprime, the inverse-based formula is invalid; a generalized merge must test residue compatibility modulo each gcd. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
