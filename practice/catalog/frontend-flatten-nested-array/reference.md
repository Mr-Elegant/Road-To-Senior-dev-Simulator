# Reference: Frontend: Flatten Nested Array

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Walk each element: recurse or push explicit stack frames for arrays and append non-array leaves. An explicit stack avoids call-stack overflow for deep nesting. Specify hole behavior, depth limits, and whether cyclic arrays are rejected. Keep cycle detection on the active ancestry path if repeated shared arrays should be expanded at each occurrence.",
    "codeOrArtifact": "const solution = (function solution(values) { const stack = [...values].reverse(), out = []; while (stack.length) {\n        const value = stack.pop();\n        if (Array.isArray(value)) {\n            for (let i = value.length - 1; i >= 0; i--)\n                stack.push(value[i]);\n        }\n        else\n            out.push(value);\n    } return out; });",
    "architectureNotes": "Follow-up: Support a maximum flattening depth and compare path-cycle detection with global deduplication.\nTopic reference: https://namastedev.com/practice/flatten-nested-array\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "flatten-nested-array-correctness",
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
    "Support a maximum flattening depth and compare path-cycle detection with global deduplication."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty arrays; nested empties; non-array objects.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "flatten-nested-array-variation",
      "question": "Support a maximum flattening depth and compare path-cycle detection with global deduplication.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Walk each element: recurse or push explicit stack frames for arrays and append non-array leaves. An explicit stack avoids call-stack overflow for deep nesting. Specify hole behavior, depth limits, and whether cyclic arrays are rejected. Keep cycle detection on the active ancestry path if repeated shared arrays should be expanded at each occurrence. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
