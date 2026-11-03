# Reference: Frontend: ReverseWords

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "This contract intentionally differs from reversing the order of words. Tokenize text while preserving separator runs, reverse only word tokens by the chosen character unit, and reconstruct the original separators. Array.from handles code points but not full grapheme clusters. Keep the transformation pure so repeated calls do not mutate cached input data.",
    "codeOrArtifact": "const solution = (function solution(text) { return text.replace(/\\S+/gu, word => Array.from(word).reverse().join('')); });",
    "architectureNotes": "Follow-up: Preserve user-perceived graphemes using segmentation and compare output with reversing word order.\nTopic reference: https://namastedev.com/practice/reversewords\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "reversewords-correctness",
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
    "Preserve user-perceived graphemes using segmentation and compare output with reversing word order."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One word; multiple spaces; punctuation policy.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "reversewords-variation",
      "question": "Preserve user-perceived graphemes using segmentation and compare output with reversing word order.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "This contract intentionally differs from reversing the order of words. Tokenize text while preserving separator runs, reverse only word tokens by the chosen character unit, and reconstruct the original separators. Array.from handles code points but not full grapheme clusters. Keep the transformation pure so repeated calls do not mutate cached input data. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
