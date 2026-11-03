# Reference: Frontend: Reverse Words in a String

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Trim the input, split on runs of whitespace, reverse the token sequence, and join with one space. This contract intentionally normalizes spacing and leaves the letters inside each word unchanged. Guard empty input so it produces an empty string. A preserve-original-whitespace variant is a different specification and should not be inferred from the same function name.",
    "codeOrArtifact": "const solution = (function solution(text) { return text.trim() ? text.trim().split(/\\s+/).reverse().join(' ') : ''; });",
    "architectureNotes": "Follow-up: Implement a separator-preserving variant and define precisely which separator attaches to which word after reversal.\nTopic reference: https://namastedev.com/practice/reverse-words-in-a-string\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "reverse-words-in-a-string-correctness",
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
    "Implement a separator-preserving variant and define precisely which separator attaches to which word after reversal."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Extra spaces; newline/tab; one word.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "reverse-words-in-a-string-variation",
      "question": "Implement a separator-preserving variant and define precisely which separator attaches to which word after reversal.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Trim the input, split on runs of whitespace, reverse the token sequence, and join with one space. This contract intentionally normalizes spacing and leaves the letters inside each word unchanged. Guard empty input so it produces an empty string. A preserve-original-whitespace variant is a different specification and should not be inferred from the same function name. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
