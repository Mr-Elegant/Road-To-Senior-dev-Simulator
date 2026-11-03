# Reference: Frontend: JSON.stringify

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Handle primitives, arrays, and own enumerable object keys recursively. Escape control characters, quotes, and backslashes in strings. In a compatible subset, undefined/function/symbol object properties are omitted while array positions become null; nonfinite numbers become null, and cycles or BigInt require explicit handling. Track active ancestors rather than rejecting every repeated reference.",
    "codeOrArtifact": "const solution = (function solution(value) { function quote(s) { return '\"' + s.replace(/[\"\\\\\\u0000-\\u001f]/g, c => { const escapes = { '\"': '\\\\\"', '\\\\': '\\\\\\\\', '\\b': '\\\\b', '\\f': '\\\\f', '\\n': '\\\\n', '\\r': '\\\\r', '\\t': '\\\\t' }; return escapes[c] || '\\\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'); }) + '\"'; } function encode(v) { if (v === null)\n        return 'null'; if (typeof v === 'string')\n        return quote(v); if (typeof v === 'number' || typeof v === 'boolean')\n        return String(v); if (Array.isArray(v))\n        return '[' + v.map(encode).join(',') + ']'; return '{' + Object.keys(v).map(k => quote(k) + ':' + encode(v[k])).join(',') + '}'; } return encode(value); });",
    "architectureNotes": "Follow-up: Add toJSON and replacer semantics only after documenting their ordering and error behavior.\nTopic reference: https://namastedev.com/practice/jsonstringify\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "jsonstringify-correctness",
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
    "Add toJSON and replacer semantics only after documenting their ordering and error behavior."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Escaped string; unsupported value in object vs array; shared object.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "jsonstringify-variation",
      "question": "Add toJSON and replacer semantics only after documenting their ordering and error behavior.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Handle primitives, arrays, and own enumerable object keys recursively. Escape control characters, quotes, and backslashes in strings. In a compatible subset, undefined/function/symbol object properties are omitted while array positions become null; nonfinite numbers become null, and cycles or BigInt require explicit handling. Track active ancestors rather than rejecting every repeated reference. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
