# Reference: Frontend: Custom Sort

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Copy the array and use a comparator that compares priority numerically before applying the chosen secondary comparison. Return zero for a true tie and add an ID tie-breaker when deterministic total ordering is needed. The comparator must be consistent and transitive; it must not mutate records or use changing random values.",
    "codeOrArtifact": "const solution = (function solution(records) { return [...records].sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); });",
    "architectureNotes": "Follow-up: Accept a list of sort descriptors and define explicit null placement and locale behavior.\nTopic reference: https://namastedev.com/practice/custom-sort\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "custom-sort-correctness",
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
    "Accept a list of sort descriptors and define explicit null placement and locale behavior."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Equal priorities; equal secondary keys; negative priority.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "custom-sort-variation",
      "question": "Accept a list of sort descriptors and define explicit null placement and locale behavior.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Copy the array and use a comparator that compares priority numerically before applying the chosen secondary comparison. Return zero for a true tie and add an ID tie-breaker when deterministic total ordering is needed. The comparator must be consistent and transitive; it must not mutate records or use changing random values. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
