# Reference: Frontend: Find smallest number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Initialize the minimum from the first accepted value and scan once, replacing it whenever a smaller value appears. This is O(n) time and O(1) extra space, compared with unnecessary O(n log n) sorting. Define empty and invalid-value behavior explicitly. Avoid spreading a very large array into Math.min, which can exceed function argument limits.",
    "codeOrArtifact": "const solution = (function solution(values) { if (!values.length)\n        throw new Error('Empty array'); let best = values[0]; for (const n of values)\n        best = Math.min(best, n); return best; });",
    "architectureNotes": "Follow-up: Return both minimum value and first index with a deterministic tie rule.\nTopic reference: https://namastedev.com/practice/find-smallest-number\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "find-smallest-number-correctness",
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
    "Return both minimum value and first index with a deterministic tie rule."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One item; all positive; all negative.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "find-smallest-number-variation",
      "question": "Return both minimum value and first index with a deterministic tie rule.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Initialize the minimum from the first accepted value and scan once, replacing it whenever a smaller value appears. This is O(n) time and O(1) extra space, compared with unnecessary O(n log n) sorting. Define empty and invalid-value behavior explicitly. Avoid spreading a very large array into Math.min, which can exceed function argument limits. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
