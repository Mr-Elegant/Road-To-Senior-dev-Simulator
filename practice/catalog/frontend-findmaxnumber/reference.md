# Reference: Frontend: findMaxNumber

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Maintain the best value and index while scanning, replacing them only on a strict greater-than comparison to preserve the first tie. Initialize only after a first valid item; an empty stream needs a separate result. This extends the maximum-value exercise with a stable witness and works incrementally without storing the full stream.",
    "codeOrArtifact": "const solution = (function solution(values) { if (!values.length)\n        return null; let index = 0; for (let i = 1; i < values.length; i++)\n        if (values[i] > values[index])\n            index = i; return { value: values[index], index }; });",
    "architectureNotes": "Follow-up: Adapt the accumulator to an async iterable and propagate cancellation and source failures.\nTopic reference: https://namastedev.com/practice/findmaxnumber\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "findmaxnumber-correctness",
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
    "Adapt the accumulator to an async iterable and propagate cancellation and source failures."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All negatives; repeated maximum; empty stream.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "findmaxnumber-variation",
      "question": "Adapt the accumulator to an async iterable and propagate cancellation and source failures.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Maintain the best value and index while scanning, replacing them only on a strict greater-than comparison to preserve the first tie. Initialize only after a first valid item; an empty stream needs a separate result. This extends the maximum-value exercise with a stable witness and works incrementally without storing the full stream. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
