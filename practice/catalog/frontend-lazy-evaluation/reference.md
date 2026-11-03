# Reference: Frontend: Lazy Evaluation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent the pipeline as iterable adapters or generator functions for map/filter/take. Each consumer pull advances only enough upstream work to produce the next result. Do not materialize intermediate arrays if laziness is the goal. Define one-shot versus reusable sources and propagate iterator return/cleanup when a downstream consumer stops early.",
    "codeOrArtifact": "const solution = (function solution({ values, take, minimum }) { let visited = 0; function* source() { for (const n of values) {\n        visited++;\n        if (n >= minimum)\n            yield n * 2;\n    } } const output = []; if (take > 0) {\n        for (const n of source()) {\n            output.push(n);\n            if (output.length === take)\n                break;\n        }\n    } return { values: output, visited }; });",
    "architectureNotes": "Follow-up: Add async iterables with cancellation and bounded prefetch rather than launching every task eagerly.\nTopic reference: https://namastedev.com/practice/lazy-evaluation\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "lazy-evaluation-correctness",
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
    "Add async iterables with cancellation and bounded prefetch rather than launching every task eagerly."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No consumption; take zero; short-circuit.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "lazy-evaluation-variation",
      "question": "Add async iterables with cancellation and bounded prefetch rather than launching every task eagerly.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent the pipeline as iterable adapters or generator functions for map/filter/take. Each consumer pull advances only enough upstream work to produce the next result. Do not materialize intermediate arrays if laziness is the goal. Define one-shot versus reusable sources and propagate iterator return/cleanup when a downstream consumer stops early. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
