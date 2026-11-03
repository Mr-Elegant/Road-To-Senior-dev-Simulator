# Reference: Frontend: Count even numbers

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a validated integer array, scan once and count values whose remainder modulo two is zero. Zero and negative even integers qualify. Non-integers and unsafe integers require a documented validation policy because parity of an already-rounded Number may not match the original value. The algorithm is O(n) with constant auxiliary space.",
    "codeOrArtifact": "const solution = (function solution(values) { return values.filter(n => n % 2 === 0).length; });",
    "architectureNotes": "Follow-up: Partition the input into even and odd collections while retaining original order.\nTopic reference: https://namastedev.com/practice/count-even-numbers\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "count-even-numbers-correctness",
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
    "Partition the input into even and odd collections while retaining original order."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero; negatives; no matches.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "count-even-numbers-variation",
      "question": "Partition the input into even and odd collections while retaining original order.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a validated integer array, scan once and count values whose remainder modulo two is zero. Zero and negative even integers qualify. Non-integers and unsafe integers require a documented validation policy because parity of an already-rounded Number may not match the original value. The algorithm is O(n) with constant auxiliary space. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
