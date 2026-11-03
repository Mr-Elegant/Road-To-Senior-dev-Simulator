# Reference: Frontend: Compress String with Limited Repetition

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Scan a maximal equal-character run, then split its count into chunks no larger than the positive integer cap. Emit a documented unambiguous token format rather than concatenating counts and arbitrary input characters without escaping. Keep character-unit semantics explicit and reject nonpositive caps before the loop. Work is linear in input plus emitted output.",
    "codeOrArtifact": "const solution = (function solution({ text, limit }) { if (!Number.isInteger(limit) || limit < 1)\n        throw new Error('Invalid limit'); const out = []; for (const char of Array.from(text)) {\n        const last = out[out.length - 1];\n        if (last && last[0] === char && last[1] < limit)\n            last[1]++;\n        else\n            out.push([char, 1]);\n    } return out; });",
    "architectureNotes": "Follow-up: Add a decoder and verify round trips for characters that resemble count delimiters.\nTopic reference: https://namastedev.com/practice/compress-string-with-limited-repetition\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "compress-string-with-limited-repetition-correctness",
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
    "Add a decoder and verify round trips for characters that resemble count delimiters."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Long run above cap; exact cap; alternating text.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "compress-string-with-limited-repetition-variation",
      "question": "Add a decoder and verify round trips for characters that resemble count delimiters.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Scan a maximal equal-character run, then split its count into chunks no larger than the positive integer cap. Emit a documented unambiguous token format rather than concatenating counts and arbitrary input characters without escaping. Keep character-unit semantics explicit and reject nonpositive caps before the loop. Work is linear in input plus emitted output. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
