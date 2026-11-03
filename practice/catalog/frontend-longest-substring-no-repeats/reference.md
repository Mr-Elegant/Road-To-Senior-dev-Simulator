# Reference: Frontend: Longest Substring No Repeats

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a sliding window and a map of each symbol’s most recent position. On repetition, move the left boundary to max(currentLeft,lastSeen+1), never backwards. Update the best window as the right side advances. This is O(n) time and O(alphabet) space over the chosen token sequence; UTF-16 indices and code-point indices must not be mixed.",
    "codeOrArtifact": "const solution = (function solution(text) { const chars = Array.from(text), last = new Map(); let left = 0, best = 0; for (let r = 0; r < chars.length; r++) {\n        if (last.has(chars[r]))\n            left = Math.max(left, last.get(chars[r]) + 1);\n        last.set(chars[r], r);\n        best = Math.max(best, r - left + 1);\n    } return best; });",
    "architectureNotes": "Follow-up: Return the actual substring while preserving correct offsets when iterating Unicode code points.\nTopic reference: https://namastedev.com/practice/longest-substring-no-repeats\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "longest-substring-no-repeats-correctness",
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
    "Return the actual substring while preserving correct offsets when iterating Unicode code points."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All unique; all same; repeated symbol outside current window.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "longest-substring-no-repeats-variation",
      "question": "Return the actual substring while preserving correct offsets when iterating Unicode code points.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a sliding window and a map of each symbol’s most recent position. On repetition, move the left boundary to max(currentLeft,lastSeen+1), never backwards. Update the best window as the right side advances. This is O(n) time and O(alphabet) space over the chosen token sequence; UTF-16 indices and code-point indices must not be mixed. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
