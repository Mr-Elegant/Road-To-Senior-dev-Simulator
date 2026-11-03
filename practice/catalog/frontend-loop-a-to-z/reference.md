# Reference: Frontend: Loop A to Z

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Iterate over the integer code points from A through Z and convert each with String.fromCharCode or String.fromCodePoint. This works because the chosen ASCII letters form a contiguous range. It is not a general method for producing every locale’s alphabet; scripts, digraphs, and collation orders need a different model.",
    "codeOrArtifact": "const solution = (function solution({ from = 'A', to = 'Z' }) { if (!/^[A-Z]$/.test(from) || !/^[A-Z]$/.test(to) || from > to)\n        throw new Error('Invalid range'); return Array.from({ length: to.charCodeAt(0) - from.charCodeAt(0) + 1 }, (_, i) => String.fromCharCode(from.charCodeAt(0) + i)); });",
    "architectureNotes": "Follow-up: Parameterize the range and reject surrogate or invalid Unicode code points deliberately.\nTopic reference: https://namastedev.com/practice/loop-a-to-z\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "loop-a-to-z-correctness",
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
    "Parameterize the range and reject surrogate or invalid Unicode code points deliberately."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: First/last letter; exactly 26 entries; no lowercase.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "loop-a-to-z-variation",
      "question": "Parameterize the range and reject surrogate or invalid Unicode code points deliberately.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Iterate over the integer code points from A through Z and convert each with String.fromCharCode or String.fromCodePoint. This works because the chosen ASCII letters form a contiguous range. It is not a general method for producing every locale’s alphabet; scripts, digraphs, and collation orders need a different model. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
