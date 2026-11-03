# Reference: Frontend: Deep Omit

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Traverse supported containers and build new ones without changing the source. Remove matching own keys on objects and recursively transform array elements rather than deleting array indices accidentally. Define whether key names or full paths are matched. Preserve repeated references/cycles only if graph support is part of the contract; otherwise reject cycles clearly.",
    "codeOrArtifact": "const solution = (function solution({ value, keys }) { const omitted = new Set(keys); function visit(v) { if (Array.isArray(v))\n        return v.map(visit); if (v && typeof v === 'object') {\n        const out = Object.create(null);\n        for (const key of Object.keys(v))\n            if (!omitted.has(key))\n                out[key] = visit(v[key]);\n        return out;\n    } return v; } return visit(value); });",
    "architectureNotes": "Follow-up: Support path-pattern omission and explain how it differs from removing every key with the same name.\nTopic reference: https://namastedev.com/practice/deep-omit\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "deep-omit-correctness",
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
    "Support path-pattern omission and explain how it differs from removing every key with the same name."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Nested key; array of objects; null.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "deep-omit-variation",
      "question": "Support path-pattern omission and explain how it differs from removing every key with the same name.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Traverse supported containers and build new ones without changing the source. Remove matching own keys on objects and recursively transform array elements rather than deleting array indices accidentally. Define whether key names or full paths are matched. Preserve repeated references/cycles only if graph support is part of the contract; otherwise reject cycles clearly. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
