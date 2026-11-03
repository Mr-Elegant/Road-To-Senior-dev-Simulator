# Reference: Frontend: Remove Duplicates from Array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track seen values with a Set and append only the first encounter. Set uses SameValueZero semantics, so NaN values deduplicate and positive/negative zero share an identity. Object entries are compared by reference, not structural content. State that behavior instead of presenting a primitive deduplicator as deep equality.",
    "codeOrArtifact": "const solution = (function solution(values) { return [...new Set(values)]; });",
    "architectureNotes": "Follow-up: Deduplicate objects by a supplied stable ID and define first-wins versus last-wins behavior.\nTopic reference: https://namastedev.com/practice/remove-duplicates-from-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "remove-duplicates-from-array-correctness",
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
    "Deduplicate objects by a supplied stable ID and define first-wins versus last-wins behavior."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty input; repeated NaN; -0/0.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "remove-duplicates-from-array-variation",
      "question": "Deduplicate objects by a supplied stable ID and define first-wins versus last-wins behavior.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track seen values with a Set and append only the first encounter. Set uses SameValueZero semantics, so NaN values deduplicate and positive/negative zero share an identity. Object entries are compared by reference, not structural content. State that behavior instead of presenting a primitive deduplicator as deep equality. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
