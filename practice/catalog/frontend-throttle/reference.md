# Reference: Frontend: Throttle

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track the last invocation time, pending timer, and latest receiver/arguments. A leading call may run immediately; a trailing call uses the newest suppressed arguments at the allowed boundary. Define the single-call behavior and cleanup semantics carefully so one interaction does not fire twice unexpectedly. Use an injected monotonic clock in tests instead of relying on wall-clock timing luck.",
    "codeOrArtifact": "const solution = (function solution({ wait, calls, end }) { const out = []; let last = -Infinity, pending = null, due = Infinity; function flush(t) { if (due <= t) {\n        last = due;\n        out.push([due, pending]);\n        pending = null;\n        due = Infinity;\n    } } for (const [t, value] of calls) {\n        flush(t);\n        if (t - last >= wait) {\n            last = t;\n            out.push([t, value]);\n        }\n        else {\n            pending = value;\n            due = last + wait;\n        }\n    } flush(end); return out; });",
    "architectureNotes": "Follow-up: Add flush and define whether it changes the next allowed invocation deadline.\nTopic reference: https://namastedev.com/practice/throttle\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "throttle-correctness",
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
    "Add flush and define whether it changes the next allowed invocation deadline."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Single call; burst; boundary time.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "throttle-variation",
      "question": "Add flush and define whether it changes the next allowed invocation deadline.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track the last invocation time, pending timer, and latest receiver/arguments. A leading call may run immediately; a trailing call uses the newest suppressed arguments at the allowed boundary. Define the single-call behavior and cleanup semantics carefully so one interaction does not fire twice unexpectedly. Use an injected monotonic clock in tests instead of relying on wall-clock timing luck. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
