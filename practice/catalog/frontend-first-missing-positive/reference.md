# Reference: Frontend: First Missing Positive

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For length n, the answer lies between 1 and n+1. Repeatedly place each in-range integer x into position x-1, stopping when it is already in the right place or a duplicate would make swapping loop. Then scan for the first index whose value is not index+1. State that this mutates the input; a nonmutating Set version has a different space contract.",
    "codeOrArtifact": "const solution = (function solution(values) { for (let i = 0; i < values.length; i++)\n        while (Number.isInteger(values[i]) && values[i] > 0 && values[i] <= values.length && values[values[i] - 1] !== values[i]) {\n            const j = values[i] - 1;\n            [values[i], values[j]] = [values[j], values[i]];\n        } for (let i = 0; i < values.length; i++)\n        if (values[i] !== i + 1)\n            return i + 1; return values.length + 1; });",
    "architectureNotes": "Follow-up: Prove that each successful placement makes progress and contrast the mutation contract with a pure implementation.\nTopic reference: https://namastedev.com/practice/first-missing-positive\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "first-missing-positive-correctness",
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
    "Prove that each successful placement makes progress and contrast the mutation contract with a pure implementation."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Duplicates; zero/negatives; all 1..n present.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "first-missing-positive-variation",
      "question": "Prove that each successful placement makes progress and contrast the mutation contract with a pure implementation.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For length n, the answer lies between 1 and n+1. Repeatedly place each in-range integer x into position x-1, stopping when it is already in the right place or a duplicate would make swapping loop. Then scan for the first index whose value is not index+1. State that this mutates the input; a nonmutating Set version has a different space contract. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
