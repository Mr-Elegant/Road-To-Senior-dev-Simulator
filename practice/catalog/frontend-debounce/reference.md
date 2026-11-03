# Reference: Frontend: Debounce

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep a timer handle and clear/restart it on every call. At expiry invoke with the last receiver/arguments and clear retained references. Add cancel to discard pending work and define flush if included. Leading/trailing options require explicit semantics rather than bolting on an extra immediate call. Test using fake time to avoid flaky sleeps.",
    "codeOrArtifact": "const solution = (function solution({ wait, calls, end }) { const out = []; let due = Infinity, value; for (const [t, v] of calls) {\n        if (due <= t)\n            out.push([due, value]);\n        due = t + wait;\n        value = v;\n    } if (due <= end)\n        out.push([due, value]); return out; });",
    "architectureNotes": "Follow-up: Add leading/trailing options and prove that a single leading call does not accidentally trigger an unwanted trailing duplicate.\nTopic reference: https://namastedev.com/practice/debounce\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "debounce-correctness",
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
    "Add leading/trailing options and prove that a single leading call does not accidentally trigger an unwanted trailing duplicate."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One call; burst; latest arguments.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "debounce-variation",
      "question": "Add leading/trailing options and prove that a single leading call does not accidentally trigger an unwanted trailing duplicate.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep a timer handle and clear/restart it on every call. At expiry invoke with the last receiver/arguments and clear retained references. Add cancel to discard pending work and define flush if included. Leading/trailing options require explicit semantics rather than bolting on an extra immediate call. Test using fake time to avoid flaky sleeps. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
