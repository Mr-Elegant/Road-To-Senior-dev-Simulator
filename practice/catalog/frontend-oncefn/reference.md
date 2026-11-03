# Reference: Frontend: once(fn)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store a hasResult flag separately from the cached value so undefined, zero, and false can still be valid results. Invoke with apply to preserve the receiver. Decide whether a thrown error consumes the once opportunity; for this contract it does not. Async rejection requires another explicit policy because caching a promise shares both its pending result and rejection.",
    "codeOrArtifact": "const solution = (function solution(values) { let calls = 0, called = false, cached; const once = (n) => { if (!called) {\n        calls++;\n        cached = n;\n        called = true;\n    } return cached; }; return { outputs: values.map(once), calls }; });",
    "architectureNotes": "Follow-up: Create an async once variant and choose whether rejected work is cached or retried.\nTopic reference: https://namastedev.com/practice/oncefn\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "oncefn-correctness",
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
    "Create an async once variant and choose whether rejected work is cached or retried."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Returns undefined; returns zero; throws then succeeds.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "oncefn-variation",
      "question": "Create an async once variant and choose whether rejected work is cached or retried.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store a hasResult flag separately from the cached value so undefined, zero, and false can still be valid results. Invoke with apply to preserve the receiver. Decide whether a thrown error consumes the once opportunity; for this contract it does not. Async rejection requires another explicit policy because caching a promise shares both its pending result and rejection. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
