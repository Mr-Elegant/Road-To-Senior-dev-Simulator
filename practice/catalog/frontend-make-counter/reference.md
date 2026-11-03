# Reference: Frontend: Make Counter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Capture the current count and initial value inside a factory invocation. Return methods that update that private binding; each factory call receives its own environment. State whether methods return the new value or the previous one and keep the API consistent. A closure encapsulates state from ordinary callers but does not create persistence or shared server coordination.",
    "codeOrArtifact": "const solution = (function solution({ initial = 0, commands }) { let value = initial; return commands.map(c => { if (c === 'increment')\n        value++; if (c === 'decrement')\n        value--; if (c === 'reset')\n        value = initial; return value; }); });",
    "architectureNotes": "Follow-up: Add a bounded variant that reports rejected transitions without letting count and error state diverge.\nTopic reference: https://namastedev.com/practice/make-counter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "make-counter-correctness",
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
    "Add a bounded variant that reports rejected transitions without letting count and error state diverge."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Independent instances; repeated reset; negative values.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "make-counter-variation",
      "question": "Add a bounded variant that reports rejected transitions without letting count and error state diverge.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Capture the current count and initial value inside a factory invocation. Return methods that update that private binding; each factory call receives its own environment. State whether methods return the new value or the previous one and keep the API consistent. A closure encapsulates state from ordinary callers but does not create persistence or shared server coordination. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
