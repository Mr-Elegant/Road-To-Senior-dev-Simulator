# Reference: Frontend: Detect data type in JS

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use explicit checks for null and Array.isArray before typeof-based primitive handling. Add supported built-ins deliberately; Object.prototype.toString can help with cross-realm values but Symbol.toStringTag may spoof its label. Avoid instance-of-only checks across realms. A type inspector should report its confidence/contract rather than treating display labels as a security boundary.",
    "codeOrArtifact": "const solution = (function solution(entries) { const values = { null: null, array: [], date: new Date(0), map: new Map(), set: new Set(), nan: NaN, number: 1, string: 'x', boolean: false, function: () => { }, object: {} }; return entries.map(k => { const v = values[k]; if (v === null)\n        return 'null'; if (Array.isArray(v))\n        return 'array'; if (typeof v === 'number' && Number.isNaN(v))\n        return 'nan'; if (v instanceof Date)\n        return 'date'; if (v instanceof Map)\n        return 'map'; if (v instanceof Set)\n        return 'set'; return typeof v; }); });",
    "architectureNotes": "Follow-up: Separate semantic validation of a value from a convenience diagnostic type label.\nTopic reference: https://namastedev.com/practice/detect-data-type-in-js\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "detect-data-type-in-js-correctness",
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
    "Separate semantic validation of a value from a convenience diagnostic type label."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: null; array; NaN.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "detect-data-type-in-js-variation",
      "question": "Separate semantic validation of a value from a convenience diagnostic type label.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use explicit checks for null and Array.isArray before typeof-based primitive handling. Add supported built-ins deliberately; Object.prototype.toString can help with cross-realm values but Symbol.toStringTag may spoof its label. Avoid instance-of-only checks across realms. A type inspector should report its confidence/contract rather than treating display labels as a security boundary. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
