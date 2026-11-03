# Reference: Frontend: Voting Eligibility

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Accept a validated integer age and a caller-supplied minimum age, then compare them directly. Reject invalid or negative ages according to the contract; do not use truthiness because zero is a valid numeric value. The exercise is a threshold model, not a complete jurisdictional eligibility determination, which may depend on additional current rules and verified identity.",
    "codeOrArtifact": "const solution = (function solution({ age, minimum }) { if (!Number.isInteger(age) || age < 0 || !Number.isInteger(minimum) || minimum < 0)\n        throw new Error('Invalid age'); return age >= minimum; });",
    "architectureNotes": "Follow-up: Accept a birth date and calculate completed calendar years before applying the supplied threshold.\nTopic reference: https://namastedev.com/practice/voting-eligibility\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "voting-eligibility-correctness",
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
    "Accept a birth date and calculate completed calendar years before applying the supplied threshold."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Below, at, above threshold; negative; fraction.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "voting-eligibility-variation",
      "question": "Accept a birth date and calculate completed calendar years before applying the supplied threshold.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Accept a validated integer age and a caller-supplied minimum age, then compare them directly. Reject invalid or negative ages according to the contract; do not use truthiness because zero is a valid numeric value. The exercise is a threshold model, not a complete jurisdictional eligibility determination, which may depend on additional current rules and verified identity. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
