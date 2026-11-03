# Reference: Frontend: Largest number formed

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Sort strings using the order of a+b versus b+a rather than ordinary numeric value or first digit alone. Concatenations have equal lengths for each pair, so lexicographic comparison is appropriate without converting huge strings to Number. Join the result and normalize an all-zero result to a single zero. State input validity and leading-zero policy.",
    "codeOrArtifact": "const solution = (function solution(values) { const sorted = [...values].sort((a, b) => (b + a).localeCompare(a + b)); const s = sorted.join(''); return s && /^0+$/.test(s) ? '0' : s; });",
    "architectureNotes": "Follow-up: Explain why the pairwise concatenation comparator establishes the required ordering and keep arithmetic precision out of the comparison.\nTopic reference: https://namastedev.com/practice/largest-number-formed\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "largest-number-formed-correctness",
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
    "Explain why the pairwise concatenation comparator establishes the required ordering and keep arithmetic precision out of the comparison."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All zeros; 3 vs 30; common prefixes.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "largest-number-formed-variation",
      "question": "Explain why the pairwise concatenation comparator establishes the required ordering and keep arithmetic precision out of the comparison.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Sort strings using the order of a+b versus b+a rather than ordinary numeric value or first digit alone. Concatenations have equal lengths for each pair, so lexicographic comparison is appropriate without converting huge strings to Number. Join the result and normalize an all-zero result to a single zero. State input validity and leading-zero policy. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
