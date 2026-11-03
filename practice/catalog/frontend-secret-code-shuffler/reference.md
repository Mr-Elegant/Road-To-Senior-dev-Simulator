# Reference: Frontend: Secret Code Shuffler

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Treat this original exercise as a Caesar-style shift, not encryption: normalize the shift modulo the alphabet size, map only supported letters, and preserve other characters according to the contract. The inverse subtracts the same normalized shift. Negative modulo in JavaScript needs normalization with ((x % m)+m)%m to keep indices nonnegative.",
    "codeOrArtifact": "const solution = (function solution({ text, shift }) { return text.replace(/[A-Za-z]/g, (c) => { const start = c >= 'a' && c <= 'z' ? 97 : 65; return String.fromCharCode(start + ((c.charCodeAt(0) - start + shift) % 26 + 26) % 26); }); });",
    "architectureNotes": "Follow-up: Distinguish this toy substitution from authenticated encryption and avoid presenting obfuscation as security.\nTopic reference: https://namastedev.com/practice/secret-code-shuffler\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "secret-code-shuffler-correctness",
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
    "Distinguish this toy substitution from authenticated encryption and avoid presenting obfuscation as security."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Shift zero; wrap at Z; negative shift.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "secret-code-shuffler-variation",
      "question": "Distinguish this toy substitution from authenticated encryption and avoid presenting obfuscation as security.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Treat this original exercise as a Caesar-style shift, not encryption: normalize the shift modulo the alphabet size, map only supported letters, and preserve other characters according to the contract. The inverse subtracts the same normalized shift. Negative modulo in JavaScript needs normalization with ((x % m)+m)%m to keep indices nonnegative. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
