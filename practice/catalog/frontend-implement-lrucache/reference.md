# Reference: Frontend: Implement LRUCache

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Combine a key-to-node map with a doubly linked list, moving accessed/updated nodes to the most-recent end and evicting the least-recent node at capacity. A JavaScript Map can model insertion-order recency by delete-and-set under an average-time contract. Distinguish missing keys from cached undefined and define zero-capacity behavior. Updating an existing key must not increase size.",
    "codeOrArtifact": "const solution = (function solution({ capacity, commands }) { const cache = new Map(); return commands.map((c) => { if (c.type === 'get') {\n        if (!cache.has(c.key))\n            return null;\n        const value = cache.get(c.key);\n        cache.delete(c.key);\n        cache.set(c.key, value);\n        return value;\n    } cache.delete(c.key); if (capacity > 0) {\n        cache.set(c.key, c.value);\n        if (cache.size > capacity)\n            cache.delete(cache.keys().next().value);\n    } return null; }); });",
    "architectureNotes": "Follow-up: Add TTL expiration and explain why recency, expiration, and capacity are independent policies.\nTopic reference: https://namastedev.com/practice/implement-lrucache\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-lrucache-correctness",
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
    "Add TTL expiration and explain why recency, expiration, and capacity are independent policies."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Read promotes key; overwrite promotes key; eviction.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-lrucache-variation",
      "question": "Add TTL expiration and explain why recency, expiration, and capacity are independent policies.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Combine a key-to-node map with a doubly linked list, moving accessed/updated nodes to the most-recent end and evicting the least-recent node at capacity. A JavaScript Map can model insertion-order recency by delete-and-set under an average-time contract. Distinguish missing keys from cached undefined and define zero-capacity behavior. Updating an existing key must not increase size. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
