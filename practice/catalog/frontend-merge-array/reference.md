# Reference: Frontend: Merge Array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use one pointer per input and repeatedly append the smaller current value, then append either remainder. This is O(n+m) time and O(n+m) output space. Decide whether equal values are all retained; a merge is not automatically a deduplication operation. Do not sort the combined data when sorted inputs already provide the needed structure.",
    "codeOrArtifact": "const solution = (function solution({ left, right }) { const out = []; let i = 0, j = 0; while (i < left.length && j < right.length)\n        out.push(left[i] <= right[j] ? left[i++] : right[j++]); return out.concat(left.slice(i), right.slice(j)); });",
    "architectureNotes": "Follow-up: Merge k sorted streams with a heap and discuss finite arrays versus unbounded iterators.\nTopic reference: https://namastedev.com/practice/merge-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "merge-array-correctness",
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
    "Merge k sorted streams with a heap and discuss finite arrays versus unbounded iterators."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One input empty; equal values; negatives.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "merge-array-variation",
      "question": "Merge k sorted streams with a heap and discuss finite arrays versus unbounded iterators.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use one pointer per input and repeatedly append the smaller current value, then append either remainder. This is O(n+m) time and O(n+m) output space. Decide whether equal values are all retained; a merge is not automatically a deduplication operation. Do not sort the combined data when sorted inputs already provide the needed structure. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
