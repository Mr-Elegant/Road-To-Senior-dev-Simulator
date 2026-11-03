# Reference: Frontend: Implement Promise Race

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Return a promise and attach fulfillment/rejection handlers through Promise.resolve for each iterable item. The first resolve/reject wins naturally through promise settlement rules; later settlements are ignored. An empty iterable leaves the result pending. Iteration errors must reject the aggregate. This is a focused implementation model, not a full recreation of subclass and species behavior.",
    "codeOrArtifact": "const solution = (async function solution(entries) { if (!entries.length)\n        return { status: 'pending' }; const result = await new Promise(resolve => { for (const entry of entries)\n        Promise.resolve(new Promise((ok, fail) => setTimeout(() => entry.reject ? fail(entry.value) : ok(entry.value), entry.delay))).then(value => resolve({ status: 'fulfilled', value }), value => resolve({ status: 'rejected', value })); }); return result; });",
    "architectureNotes": "Follow-up: Contrast race with any and explain why winning a race does not cancel losing operations.\nTopic reference: https://namastedev.com/practice/implement-promise-race\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-promise-race-correctness",
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
    "Contrast race with any and explain why winning a race does not cancel losing operations."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Immediate value; first rejection; empty iterable.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-promise-race-variation",
      "question": "Contrast race with any and explain why winning a race does not cancel losing operations.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Return a promise and attach fulfillment/rejection handlers through Promise.resolve for each iterable item. The first resolve/reject wins naturally through promise settlement rules; later settlements are ignored. An empty iterable leaves the result pending. Iteration errors must reject the aggregate. This is a focused implementation model, not a full recreation of subclass and species behavior. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
