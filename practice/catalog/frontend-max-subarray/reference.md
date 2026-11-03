# Reference: Frontend: Max SubArray

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Maintain the best sum ending at the current element and the best sum seen anywhere. At each value choose between starting a new segment there and extending the previous segment. Initialize from the first element rather than zero, otherwise an all-negative array incorrectly returns an empty segment’s sum. This is O(n) time and O(1) auxiliary state.",
    "codeOrArtifact": "const solution = (function solution(values) { if (!values.length)\n        throw new Error('Empty array'); let end = values[0], best = end; for (const n of values.slice(1)) {\n        end = Math.max(n, end + n);\n        best = Math.max(best, end);\n    } return best; });",
    "architectureNotes": "Follow-up: Return segment indices and define a deterministic tie-breaker between equally good segments.\nTopic reference: https://namastedev.com/practice/max-subarray\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "max-subarray-correctness",
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
    "Return segment indices and define a deterministic tie-breaker between equally good segments."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All negative; one element; zeros.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "max-subarray-variation",
      "question": "Return segment indices and define a deterministic tie-breaker between equally good segments.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Maintain the best sum ending at the current element and the best sum seen anywhere. At each value choose between starting a new segment there and extending the previous segment. Initialize from the first element rather than zero, otherwise an all-negative array incorrectly returns an empty segment’s sum. This is O(n) time and O(1) auxiliary state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
