# Reference: Frontend: groupBy(arr, key)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a Map when keys may be objects or when arbitrary string keys must not collide with object prototypes. Scan once, create a bucket on the first occurrence, and append without mutating source records. Time is O(n) plus output storage. If returning a plain object is required, define key conversion and use a null-prototype object safely.",
    "codeOrArtifact": "const solution = (function solution({ records, key }) { const groups = new Map(); for (const item of records) {\n        const k = String(item[key]);\n        if (!groups.has(k))\n            groups.set(k, []);\n        groups.get(k).push(item);\n    } return [...groups]; });",
    "architectureNotes": "Follow-up: Accept a key-selector function and compare Map identity semantics with serialized compound keys.\nTopic reference: https://namastedev.com/practice/groupbyarr-key\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "groupbyarr-key-correctness",
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
    "Accept a key-selector function and compare Map identity semantics with serialized compound keys."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty array; missing key; __proto__ string.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "groupbyarr-key-variation",
      "question": "Accept a key-selector function and compare Map identity semantics with serialized compound keys.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a Map when keys may be objects or when arbitrary string keys must not collide with object prototypes. Scan once, create a bucket on the first occurrence, and append without mutating source records. Time is O(n) plus output storage. If returning a plain object is required, define key conversion and use a null-prototype object safely. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
