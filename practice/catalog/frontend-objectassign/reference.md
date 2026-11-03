# Reference: Frontend: Object.assign()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Convert a non-null target to an object and skip null/undefined sources. Enumerate each source’s own enumerable keys, including symbols, and assign values in source order so later sources overwrite earlier ones. This reads getters and invokes target setters; it does not copy descriptors or recursively clone children. Throwing accessors can leave a partially changed target.",
    "codeOrArtifact": "const solution = (function solution({ target, sources }) { const out = Object.create(null); for (const source of [target, ...sources])\n        if (source != null)\n            for (const key of Object.keys(source))\n                Object.defineProperty(out, key, { value: source[key], writable: true, configurable: true, enumerable: true }); return out; });",
    "architectureNotes": "Follow-up: Compare assignment semantics with descriptor copying and immutable object spread without claiming they are identical.\nTopic reference: https://namastedev.com/practice/objectassign\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "objectassign-correctness",
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
    "Compare assignment semantics with descriptor copying and immutable object spread without claiming they are identical."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Multiple sources; symbol key; inherited key.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "objectassign-variation",
      "question": "Compare assignment semantics with descriptor copying and immutable object spread without claiming they are identical.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Convert a non-null target to an object and skip null/undefined sources. Enumerate each source’s own enumerable keys, including symbols, and assign values in source order so later sources overwrite earlier ones. This reads getters and invokes target setters; it does not copy descriptors or recursively clone children. Throwing accessors can leave a partially changed target. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
