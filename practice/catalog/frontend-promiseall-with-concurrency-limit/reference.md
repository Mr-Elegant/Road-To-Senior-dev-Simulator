# Reference: Frontend: PromiseAll With Concurrency Limit

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Promises already created may already be running, so accept factories. Maintain the next input index and a fixed number of worker loops. Each worker claims an index, awaits its factory, and writes the result into that index. On rejection, stop launching new work under a fail-fast contract; already running tasks need cooperative cancellation and may still finish.",
    "codeOrArtifact": "const solution = (async function solution({ values, limit }) { if (!Number.isInteger(limit) || limit < 1)\n        throw new Error('Invalid limit'); let next = 0, active = 0, peak = 0; const result = new Array(values.length); async function worker() { while (next < values.length) {\n        const i = next++;\n        active++;\n        peak = Math.max(peak, active);\n        try {\n            result[i] = await new Promise(resolve => setTimeout(() => resolve(values[i]), 0));\n        }\n        finally {\n            active--;\n        }\n    } } await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker)); return { values: result, peak }; });",
    "architectureNotes": "Follow-up: Propagate an AbortSignal and distinguish rejecting the aggregate promise from undoing work already sent to a server.\nTopic reference: https://namastedev.com/practice/promiseall-with-concurrency-limit\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "promiseall-with-concurrency-limit-correctness",
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
    "Propagate an AbortSignal and distinguish rejecting the aggregate promise from undoing work already sent to a server."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty tasks; limit one; limit above count.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "promiseall-with-concurrency-limit-variation",
      "question": "Propagate an AbortSignal and distinguish rejecting the aggregate promise from undoing work already sent to a server.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Promises already created may already be running, so accept factories. Maintain the next input index and a fixed number of worker loops. Each worker claims an index, awaits its factory, and writes the result into that index. On rejection, stop launching new work under a fail-fast contract; already running tasks need cooperative cancellation and may still finish. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
