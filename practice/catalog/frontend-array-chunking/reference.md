# Reference: Frontend: Array Chunking

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate the size before looping so zero or negative values cannot cause an infinite loop. Iterate start positions by size and slice each segment, allowing the final chunk to be shorter. This is O(n) copied output with O(n) total output storage. An iterator variant can yield chunks incrementally for a large source.",
    "codeOrArtifact": "const solution = (function solution({ values, size }) { if (!Number.isInteger(size) || size < 1)\n        throw new Error('Invalid size'); const chunks = []; for (let i = 0; i < values.length; i += size)\n        chunks.push(values.slice(i, i + size)); return chunks; });",
    "architectureNotes": "Follow-up: Implement lazy chunking over an iterable and define whether the final partial chunk is emitted.\nTopic reference: https://namastedev.com/practice/array-chunking\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "array-chunking-correctness",
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
    "Implement lazy chunking over an iterable and define whether the final partial chunk is emitted."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty array; size one; size larger than input.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "array-chunking-variation",
      "question": "Implement lazy chunking over an iterable and define whether the final partial chunk is emitted.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate the size before looping so zero or negative values cannot cause an infinite loop. Iterate start positions by size and slice each segment, allowing the final chunk to be shorter. This is O(n) copied output with O(n) total output storage. An iterator variant can yield chunks incrementally for a large source. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
