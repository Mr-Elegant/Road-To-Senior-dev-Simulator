# Reference: Frontend: Count Vowels

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Scan characters once and test membership in a small vowel set after case normalization. Count occurrences, not distinct vowels. State that the exercise uses a/e/i/o/u and does not automatically model accented vowels or the linguistic role of y. A broader language-aware version needs a chosen normalization and alphabet policy.",
    "codeOrArtifact": "const solution = (function solution(text) { return (text.match(/[aeiou]/gi) || []).length; });",
    "architectureNotes": "Follow-up: Return counts per vowel and compare Unicode decomposition with a language-specific definition.\nTopic reference: https://namastedev.com/practice/count-vowels\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "count-vowels-correctness",
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
    "Return counts per vowel and compare Unicode decomposition with a language-specific definition."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No vowels; all vowels; mixed case.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "count-vowels-variation",
      "question": "Return counts per vowel and compare Unicode decomposition with a language-specific definition.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Scan characters once and test membership in a small vowel set after case normalization. Count occurrences, not distinct vowels. State that the exercise uses a/e/i/o/u and does not automatically model accented vowels or the linguistic role of y. A broader language-aware version needs a chosen normalization and alphabet policy. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
