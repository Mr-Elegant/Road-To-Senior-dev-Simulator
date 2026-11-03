# Reference: Frontend: Search Rotated Array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use binary search. At each step identify which half is sorted, then decide whether the target belongs inside that sorted interval; otherwise search the other half. Keep endpoint inclusivity consistent to avoid losing a target at mid or an edge. This remains O(log n) under the no-duplicates precondition; duplicates can make deciding the sorted side ambiguous.",
    "codeOrArtifact": "const solution = (function solution({ values, target }) { let l = 0, r = values.length - 1; while (l <= r) {\n        const m = l + Math.floor((r - l) / 2);\n        if (values[m] === target)\n            return m;\n        if (values[l] <= values[m]) {\n            if (values[l] <= target && target < values[m])\n                r = m - 1;\n            else\n                l = m + 1;\n        }\n        else if (values[m] < target && target <= values[r])\n            l = m + 1;\n        else\n            r = m - 1;\n    } return -1; });",
    "architectureNotes": "Follow-up: Support duplicates and explain why worst-case runtime can degrade to linear.\nTopic reference: https://namastedev.com/practice/search-rotated-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "search-rotated-array-correctness",
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
    "Support duplicates and explain why worst-case runtime can degrade to linear."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No rotation; one item; target at pivot.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "search-rotated-array-variation",
      "question": "Support duplicates and explain why worst-case runtime can degrade to linear.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use binary search. At each step identify which half is sorted, then decide whether the target belongs inside that sorted interval; otherwise search the other half. Keep endpoint inclusivity consistent to avoid losing a target at mid or an edge. This remains O(log n) under the no-duplicates precondition; duplicates can make deciding the sorted side ambiguous. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
