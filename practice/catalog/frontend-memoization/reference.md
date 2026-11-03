# Reference: Frontend: Memoization

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose keys that match the function’s semantics. JSON.stringify is not a universal argument key because it loses values, can throw, and does not preserve object identity. A nested Map/WeakMap argument trie is one alternative. Cache presence separately from a falsey result, preserve the receiver if required, and bound long-lived caches. Async rejection needs an explicit cache-invalidation policy.",
    "codeOrArtifact": "const solution = (function solution(calls) { const cache = new Map(); let evaluations = 0; const outputs = calls.map(([a, b]) => { const key = JSON.stringify([a, b]); if (!cache.has(key)) {\n        evaluations++;\n        cache.set(key, a * b + a);\n    } return cache.get(key); }); return { outputs, evaluations }; });",
    "architectureNotes": "Follow-up: Combine memoization with LRU capacity and document whether concurrent callers share a pending promise.\nTopic reference: https://namastedev.com/practice/memoization\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "memoization-correctness",
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
    "Combine memoization with LRU capacity and document whether concurrent callers share a pending promise."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Falsey result; multiple arguments; object identity.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "memoization-variation",
      "question": "Combine memoization with LRU capacity and document whether concurrent callers share a pending promise.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose keys that match the function’s semantics. JSON.stringify is not a universal argument key because it loses values, can throw, and does not preserve object identity. A nested Map/WeakMap argument trie is one alternative. Cache presence separately from a falsey result, preserve the receiver if required, and bound long-lived caches. Async rejection needs an explicit cache-invalidation policy. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
