# Reference: Frontend: Count Negative

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Scan once and increment the count only when the value is less than zero under a documented finite-number input contract. JavaScript negative zero is not less than zero and should not be counted as a negative amount under this definition. If invalid entries are possible, decide whether to reject the array or skip them rather than relying on coercion.",
    "codeOrArtifact": "const solution = (function solution(values) { return values.filter(n => n < 0).length; });",
    "architectureNotes": "Follow-up: Return counts for negative, zero, and positive buckets in one pass.\nTopic reference: https://namastedev.com/practice/count-negative\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "count-negative-correctness",
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
    "Return counts for negative, zero, and positive buckets in one pass."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty array; all nonnegative; mixed signs.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "count-negative-variation",
      "question": "Return counts for negative, zero, and positive buckets in one pass.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Scan once and increment the count only when the value is less than zero under a documented finite-number input contract. JavaScript negative zero is not less than zero and should not be counted as a negative amount under this definition. If invalid entries are possible, decide whether to reject the array or skip them rather than relying on coercion. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
