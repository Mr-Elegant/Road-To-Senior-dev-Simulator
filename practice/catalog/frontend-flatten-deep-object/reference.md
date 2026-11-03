# Reference: Frontend: Flatten Deep Object

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use explicit node-type handling: arrays contribute index segments, objects contribute own key segments, and primitives become leaves. Store paths as arrays or use a reversible escaping scheme. Preserve empty containers with tagged entries if reconstructability is required. An iterative traversal avoids stack overflow, while ancestry tracking distinguishes cycles from harmless repeated references.",
    "codeOrArtifact": "const solution = (function solution(value) { const out = []; function visit(v, path) { if (v && typeof v === 'object' && Object.keys(v).length) {\n        for (const k of Object.keys(v))\n            visit(v[k], [...path, Array.isArray(v) ? Number(k) : k]);\n    }\n    else\n        out.push({ path, value: v }); } visit(value, []); return out; });",
    "architectureNotes": "Follow-up: Preserve aliasing as reference records and explain why a tree-shaped path list otherwise loses graph identity.\nTopic reference: https://namastedev.com/practice/flatten-deep-object\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "flatten-deep-object-correctness",
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
    "Preserve aliasing as reference records and explain why a tree-shaped path list otherwise loses graph identity."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Array/object mixture; empty containers; numeric-looking keys.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "flatten-deep-object-variation",
      "question": "Preserve aliasing as reference records and explain why a tree-shaped path list otherwise loses graph identity.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use explicit node-type handling: arrays contribute index segments, objects contribute own key segments, and primitives become leaves. Store paths as arrays or use a reversible escaping scheme. Preserve empty containers with tagged entries if reconstructability is required. An iterative traversal avoids stack overflow, while ancestry tracking distinguishes cycles from harmless repeated references. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
