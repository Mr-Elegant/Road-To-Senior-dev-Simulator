# Reference: Frontend: pyramid pattern

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For row i starting at zero, emit height-i-1 leading spaces and 2*i+1 fill symbols under a one-column-symbol contract. Return joined lines rather than mixing generation with console output. The output itself has O(height squared) size, so that cost cannot be optimized away if the full pyramid is required. Define trailing-space and final-newline behavior explicitly.",
    "codeOrArtifact": "const solution = (function solution(height) { if (!Number.isInteger(height) || height < 0 || height > 50)\n        throw new Error('Invalid height'); return Array.from({ length: height }, (_, i) => ' '.repeat(height - i - 1) + '*'.repeat(2 * i + 1)); });",
    "architectureNotes": "Follow-up: Support a hollow pyramid and define how multi-column Unicode symbols affect visual alignment.\nTopic reference: https://namastedev.com/practice/pyramid-pattern\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "pyramid-pattern-correctness",
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
    "Support a hollow pyramid and define how multi-column Unicode symbols affect visual alignment."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Zero rows; one row; ordinary height.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "pyramid-pattern-variation",
      "question": "Support a hollow pyramid and define how multi-column Unicode symbols affect visual alignment.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For row i starting at zero, emit height-i-1 leading spaces and 2*i+1 fill symbols under a one-column-symbol contract. Return joined lines rather than mixing generation with console output. The output itself has O(height squared) size, so that cost cannot be optimized away if the full pyramid is required. Define trailing-space and final-newline behavior explicitly. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
