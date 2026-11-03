# Reference: Frontend: Array.prototype.reduce

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Distinguish an omitted initial argument from an explicitly supplied undefined using argument count. Without an initial value, find the first present element or throw for an empty/holey input. Visit only existing indices up to the captured initial length and call the reducer with accumulator, value, index, and source. Do not add a global prototype patch in a study demo.",
    "codeOrArtifact": "const solution = (function solution(input) { const { values, operation } = input; let index = 0, acc; if (Object.hasOwn(input, 'initial'))\n        acc = input.initial;\n    else {\n        if (!values.length)\n            throw new Error('Empty reduction');\n        acc = values[index++];\n    } for (; index < values.length; index++)\n        acc = operation === 'multiply' ? acc * values[index] : acc + values[index]; return acc; });",
    "architectureNotes": "Follow-up: Compare a focused array-only implementation with the complete specification requirements for generic receivers.\nTopic reference: https://namastedev.com/practice/arrayprototypereduce\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "arrayprototypereduce-correctness",
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
    "Compare a focused array-only implementation with the complete specification requirements for generic receivers."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty without seed; explicit undefined seed; sparse array.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "arrayprototypereduce-variation",
      "question": "Compare a focused array-only implementation with the complete specification requirements for generic receivers.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Distinguish an omitted initial argument from an explicitly supplied undefined using argument count. Without an initial value, find the first present element or throw for an empty/holey input. Visit only existing indices up to the captured initial length and call the reducer with accumulator, value, index, and source. Do not add a global prototype patch in a study demo. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
