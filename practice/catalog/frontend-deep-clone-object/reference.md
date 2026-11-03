# Reference: Frontend: Deep Clone Object

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a source-to-clone map and register each clone before traversing children, so cycles terminate and shared references remain shared. Handle supported types explicitly; arrays and plain objects are not enough for Date, Map, Set, or typed buffers. Functions, DOM nodes, accessors, and custom prototypes require declared behavior. Consider structuredClone when its supported type set matches the contract.",
    "codeOrArtifact": "const solution = (function solution({ value, cycle = false }) { const source = structuredClone(value); if (cycle) {\n        source.self = source;\n        source.aliasA = { x: 1 };\n        source.aliasB = source.aliasA;\n    } const seen = new Map(); function clone(v) { if (!v || typeof v !== 'object')\n        return v; if (seen.has(v))\n        return seen.get(v); const out = Array.isArray(v) ? [] : {}; seen.set(v, out); for (const k of Object.keys(v))\n        out[k] = clone(v[k]); return out; } const output = clone(source); function separate(a, b) { if (!a || typeof a !== 'object')\n        return true; if (a === b)\n        return false; return Object.keys(a).every(k => separate(a[k], b[k])); } const plain = clone(value); return { equal: JSON.stringify(plain) === JSON.stringify(value), distinct: !value || typeof value !== 'object' || output !== source, nestedDistinct: separate(value, plain), cyclePreserved: !cycle || output.self === output, aliasPreserved: !cycle || output.aliasA === output.aliasB && output.aliasA !== source.aliasA }; });",
    "architectureNotes": "Follow-up: Preserve property descriptors and explain why copying getters can trigger side effects if implemented by reading values.\nTopic reference: https://namastedev.com/practice/deep-clone-object\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "deep-clone-object-correctness",
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
    "Preserve property descriptors and explain why copying getters can trigger side effects if implemented by reading values."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Self-cycle; shared child; Date/Map policy.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "deep-clone-object-variation",
      "question": "Preserve property descriptors and explain why copying getters can trigger side effects if implemented by reading values.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a source-to-clone map and register each clone before traversing children, so cycles terminate and shared references remain shared. Handle supported types explicitly; arrays and plain objects are not enough for Date, Map, Set, or typed buffers. Functions, DOM nodes, accessors, and custom prototypes require declared behavior. Consider structuredClone when its supported type set matches the contract. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
