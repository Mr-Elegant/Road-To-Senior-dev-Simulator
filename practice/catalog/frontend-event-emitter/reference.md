# Reference: Frontend: Event Emitter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store listeners per event and return an idempotent unsubscribe function. For emission, iterate a snapshot if listeners added or removed mid-emission should not change that emission. Decide whether one throwing listener stops later listeners or is collected/reported. A once listener should be removed before invocation to avoid reentrant double execution.",
    "codeOrArtifact": "const solution = (function solution(commands) { const listeners = new Map(), log = []; for (const c of commands) {\n        if (c.type === 'on')\n            listeners.set(c.id, { ...c });\n        if (c.type === 'off')\n            listeners.delete(c.id);\n        if (c.type === 'emit') {\n            const snapshot = [...listeners.values()].filter(l => l.event === c.event);\n            for (const l of snapshot) {\n                if (l.once)\n                    listeners.delete(l.id);\n                log.push([l.id, c.value]);\n            }\n        }\n    } return log; });",
    "architectureNotes": "Follow-up: Add an async emit mode with a deliberate sequential versus parallel error policy.\nTopic reference: https://namastedev.com/practice/event-emitter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "event-emitter-correctness",
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
    "Add an async emit mode with a deliberate sequential versus parallel error policy."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Unsubscribe twice; add/remove during emit; reentrant emit.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "event-emitter-variation",
      "question": "Add an async emit mode with a deliberate sequential versus parallel error policy.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store listeners per event and return an idempotent unsubscribe function. For emission, iterate a snapshot if listeners added or removed mid-emission should not change that emission. Decide whether one throwing listener stops later listeners or is collected/reported. A once listener should be removed before invocation to avoid reentrant double execution. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
