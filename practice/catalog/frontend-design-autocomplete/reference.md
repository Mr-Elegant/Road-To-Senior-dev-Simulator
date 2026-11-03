# Reference: Frontend: Design Autocomplete

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a static prefix dictionary, a trie or sorted-array prefix range can locate candidates. Ranking may require cached top-k entries per prefix or a separate scoring index. Define case/Unicode normalization, ties, and update behavior before selecting a structure. Client debouncing does not solve server ranking, authorization, privacy, or cache freshness; protect against stale suggestion responses separately.",
    "codeOrArtifact": "const solution = (function solution({ entries, prefix, limit }) { const root = { children: new Map(), entries: [] }; for (const entry of entries) {\n        let node = root;\n        node.entries.push(entry);\n        for (const c of entry.word) {\n            if (!node.children.has(c))\n                node.children.set(c, { children: new Map(), entries: [] });\n            node = node.children.get(c);\n            node.entries.push(entry);\n        }\n    } let node = root; for (const c of prefix.toLowerCase()) {\n        node = node.children.get(c);\n        if (!node)\n            return [];\n    } return [...node.entries].sort((a, b) => b.score - a.score || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0)).slice(0, limit).map(e => e.word); });",
    "architectureNotes": "Follow-up: Compare trie top-k caches with a search index when ranking depends on user context and rapidly changing popularity.\nTopic reference: https://namastedev.com/practice/design-autocomplete\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "design-autocomplete-correctness",
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
    "Compare trie top-k caches with a search index when ranking depends on user context and rapidly changing popularity."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty prefix; no match; equal rank.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "design-autocomplete-variation",
      "question": "Compare trie top-k caches with a search index when ranking depends on user context and rapidly changing popularity.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a static prefix dictionary, a trie or sorted-array prefix range can locate candidates. Ranking may require cached top-k entries per prefix or a separate scoring index. Define case/Unicode normalization, ties, and update behavior before selecting a structure. Client debouncing does not solve server ranking, authorization, privacy, or cache freshness; protect against stale suggestion responses separately. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
