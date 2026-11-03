# Reference: Frontend: Capitalize Words

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose whether the rest of each word is preserved or lowercased, then implement exactly that rule. Tokenization and reconstruction determine whether original spacing is retained. Uppercasing can expand a character into multiple code points, so do not assume a fixed output length. Treat this as formatting, not a general person-name normalization algorithm.",
    "codeOrArtifact": "const solution = (function solution(text) { return text.replace(/\\S+/gu, word => { const chars = Array.from(word); return chars[0].toUpperCase() + chars.slice(1).join(''); }); });",
    "architectureNotes": "Follow-up: Preserve whitespace exactly using token-aware replacement rather than split-and-join.\nTopic reference: https://namastedev.com/practice/capitalize-words\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "capitalize-words-correctness",
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
    "Preserve whitespace exactly using token-aware replacement rather than split-and-join."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Multiple spaces; empty text; apostrophes.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "capitalize-words-variation",
      "question": "Preserve whitespace exactly using token-aware replacement rather than split-and-join.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose whether the rest of each word is preserved or lowercased, then implement exactly that rule. Tokenization and reconstruction determine whether original spacing is retained. Uppercasing can expand a character into multiple code points, so do not assume a fixed output length. Treat this as formatting, not a general person-name normalization algorithm. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
