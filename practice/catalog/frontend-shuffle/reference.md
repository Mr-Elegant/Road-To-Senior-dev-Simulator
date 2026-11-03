# Reference: Frontend: shuffle()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Copy the input, then for each position from the end choose a uniform integer between zero and that position inclusive and swap. Every permutation is equally likely only if the bounded choices are uniform. Sorting with a random comparator is neither a valid comparator nor an unbiased shuffle. Deterministic tests should inject controlled random outputs.",
    "codeOrArtifact": "const solution = (function solution({ values, draws }) { const result = [...values]; let d = 0; for (let i = result.length - 1; i > 0; i--) {\n        const j = Math.floor(draws[d++] * (i + 1));\n        [result[i], result[j]] = [result[j], result[i]];\n    } return result; });",
    "architectureNotes": "Follow-up: Use rejection-sampled cryptographic integers for a stronger randomness requirement and explain why distribution tests are not a proof.\nTopic reference: https://namastedev.com/practice/shuffle\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "shuffle-correctness",
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
    "Use rejection-sampled cryptographic integers for a stronger randomness requirement and explain why distribution tests are not a proof."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty/single item; unchanged input; deterministic swaps.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "shuffle-variation",
      "question": "Use rejection-sampled cryptographic integers for a stronger randomness requirement and explain why distribution tests are not a proof.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Copy the input, then for each position from the end choose a uniform integer between zero and that position inclusive and swap. Every permutation is equally likely only if the bounded choices are uniform. Sorting with a random comparator is neither a valid comparator nor an unbiased shuffle. Deterministic tests should inject controlled random outputs. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
