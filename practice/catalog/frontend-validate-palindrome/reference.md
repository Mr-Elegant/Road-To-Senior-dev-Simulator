# Reference: Frontend: Validate Palindrome

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize the string according to the contract, then compare characters from both ends while moving inward. A two-pointer check is O(n) time and can avoid constructing a reversed copy after normalization. Specify whether punctuation, accents, and spaces are ignored. For code-point or grapheme semantics, tokenize before indexing rather than assuming UTF-16 units are characters.",
    "codeOrArtifact": "const solution = (function solution(text) { const s = text.toLowerCase().replace(/[^a-z0-9]/g, ''); let l = 0, r = s.length - 1; while (l < r)\n        if (s[l++] !== s[r--])\n            return false; return true; });",
    "architectureNotes": "Follow-up: Compare a strict literal palindrome checker with a locale-aware user-text variant.\nTopic reference: https://namastedev.com/practice/validate-palindrome\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "validate-palindrome-correctness",
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
    "Compare a strict literal palindrome checker with a locale-aware user-text variant."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty normalized text; punctuation; mixed case.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "validate-palindrome-variation",
      "question": "Compare a strict literal palindrome checker with a locale-aware user-text variant.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize the string according to the contract, then compare characters from both ends while moving inward. A two-pointer check is O(n) time and can avoid constructing a reversed copy after normalization. Specify whether punctuation, accents, and spaces are ignored. For code-point or grapheme semantics, tokenize before indexing rather than assuming UTF-16 units are characters. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
