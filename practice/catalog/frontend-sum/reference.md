# Reference: Frontend: sum()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Return a function that captures the current total. A numeric argument produces another accumulator and an empty call returns the total. This avoids surprising implicit coercion through valueOf or toString. Define whether each call accepts one value or a batch and reject unsupported values. Use immutable closure state when chains must be safely reusable.",
    "codeOrArtifact": "const solution = (function solution(groups) { function sum(total = 0) { return (...args) => args.length ? sum(total + args.reduce((a, b) => a + b, 0)) : total; } let current = sum(); for (const group of groups)\n        current = current(...group); return current(); });",
    "architectureNotes": "Follow-up: Support grouped arguments while keeping termination unambiguous and avoiding mutation shared by sibling chains.\nTopic reference: https://namastedev.com/practice/sum\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sum-correctness",
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
    "Support grouped arguments while keeping termination unambiguous and avoiding mutation shared by sibling chains."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: sum(1)(2)(); empty termination; zero.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sum-variation",
      "question": "Support grouped arguments while keeping termination unambiguous and avoiding mutation shared by sibling chains.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Return a function that captures the current total. A numeric argument produces another accumulator and an empty call returns the total. This avoids surprising implicit coercion through valueOf or toString. Define whether each call accepts one value or a batch and reject unsupported values. Use immutable closure state when chains must be safely reusable. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
