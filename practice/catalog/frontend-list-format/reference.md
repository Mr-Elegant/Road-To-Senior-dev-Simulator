# Reference: Frontend: List Format

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a locale-aware product, use Intl.ListFormat with the intended style and type. A teaching implementation can define a narrow English format: empty string for no items, the item for one, conjunction for two, and comma-separated prefix plus final conjunction for more. Do not claim that punctuation or word order generalizes across languages.",
    "codeOrArtifact": "const solution = (function solution(items) { if (items.length < 2)\n        return items[0] || ''; if (items.length === 2)\n        return items[0] + ' and ' + items[1]; return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1]; });",
    "architectureNotes": "Follow-up: Offer a count-limited summary that reports remaining items without confusing formatting with truncation policy.\nTopic reference: https://namastedev.com/practice/list-format\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "list-format-correctness",
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
    "Offer a count-limited summary that reports remaining items without confusing formatting with truncation policy."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty; one; two.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "list-format-variation",
      "question": "Offer a count-limited summary that reports remaining items without confusing formatting with truncation policy.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a locale-aware product, use Intl.ListFormat with the intended style and type. A teaching implementation can define a narrow English format: empty string for no items, the item for one, conjunction for two, and comma-separated prefix plus final conjunction for more. Do not claim that punctuation or word order generalizes across languages. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
