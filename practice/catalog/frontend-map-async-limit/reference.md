# Reference: Frontend: Map Async Limit

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Assign each input a fixed result index and let a bounded worker pool claim the next index. Await each mapper before the worker takes another item. A mapper may throw synchronously or reject, and both must follow the aggregate error policy. Validate the limit before starting. This bounds active work, not necessarily output memory, which remains proportional to input.",
    "codeOrArtifact": "const solution = (async function solution({ values, limit }) { if (!Number.isInteger(limit) || limit < 1)\n        throw new Error('Invalid limit'); let next = 0, active = 0, peak = 0; const out = new Array(values.length); async function worker() { while (next < values.length) {\n        const i = next++;\n        active++;\n        peak = Math.max(peak, active);\n        try {\n            out[i] = await new Promise(resolve => setTimeout(() => resolve(values[i] * 2), 0));\n        }\n        finally {\n            active--;\n        }\n    } } await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker)); return { values: out, peak }; });",
    "architectureNotes": "Follow-up: Return an async iterator for streaming output and compare input-order buffering with completion-order delivery.\nTopic reference: https://namastedev.com/practice/map-async-limit\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "map-async-limit-correctness",
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
    "Return an async iterator for streaming output and compare input-order buffering with completion-order delivery."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty input; out-of-order completion; limit one.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "map-async-limit-variation",
      "question": "Return an async iterator for streaming output and compare input-order buffering with completion-order delivery.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Assign each input a fixed result index and let a bounded worker pool claim the next index. Await each mapper before the worker takes another item. A mapper may throw synchronously or reject, and both must follow the aggregate error policy. Validate the limit before starting. This bounds active work, not necessarily output memory, which remains proportional to input. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
