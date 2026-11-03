# Reference: Frontend: Flatten Nested Objects

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Walk own enumerable keys, accumulate a path, and emit non-plain-object leaves. Define how empty objects and keys containing separators are represented; a segment-array path avoids dot-key ambiguity. Treat arrays as leaves for this contract rather than accidentally turning them into numeric object fields. Detect cycles along the active path and do not modify the input.",
    "codeOrArtifact": "const solution = (function solution(value) { const out = []; function visit(v, p) { if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length) {\n        for (const k of Object.keys(v))\n            visit(v[k], p ? p + '.' + k : k);\n    }\n    else\n        out.push([p, v]); } visit(value, ''); return out.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });",
    "architectureNotes": "Follow-up: Add an inverse unflatten operation and demonstrate why ambiguous separator encoding prevents a reliable round trip.\nTopic reference: https://namastedev.com/practice/flatten-nested-objects\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "flatten-nested-objects-correctness",
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
    "Add an inverse unflatten operation and demonstrate why ambiguous separator encoding prevents a reliable round trip."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty object; array leaf; key containing a dot.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "flatten-nested-objects-variation",
      "question": "Add an inverse unflatten operation and demonstrate why ambiguous separator encoding prevents a reliable round trip.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Walk own enumerable keys, accumulate a path, and emit non-plain-object leaves. Define how empty objects and keys containing separators are represented; a segment-array path avoids dot-key ambiguity. Treat arrays as leaves for this contract rather than accidentally turning them into numeric object fields. Detect cycles along the active path and do not modify the input. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
