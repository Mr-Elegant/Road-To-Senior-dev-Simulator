# Reference: Frontend: Find largest number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a single pass with an initial value taken from the sequence rather than zero, which fails for all-negative data. Keep validation separate from comparison and avoid sorting solely to obtain an extremum. For streaming input, maintain the same accumulator incrementally. Time is O(n) and auxiliary space is O(1).",
    "codeOrArtifact": "const solution = (function solution(values) { if (!values.length)\n        throw new Error('Empty array'); let best = values[0]; for (const n of values)\n        best = Math.max(best, n); return best; });",
    "architectureNotes": "Follow-up: Compute minimum and maximum together and report their stable first positions.\nTopic reference: https://namastedev.com/practice/find-largest-number\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "find-largest-number-correctness",
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
    "Compute minimum and maximum together and report their stable first positions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All negative; one item; repeated maximum.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "find-largest-number-variation",
      "question": "Compute minimum and maximum together and report their stable first positions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a single pass with an initial value taken from the sequence rather than zero, which fails for all-negative data. Keep validation separate from comparison and avoid sorting solely to obtain an extremum. For streaming input, maintain the same accumulator incrementally. Time is O(n) and auxiliary space is O(1). For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
