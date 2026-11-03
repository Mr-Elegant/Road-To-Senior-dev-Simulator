# Reference: Frontend: Rate Limiter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep capacity, refill rate, current tokens, and the last update instant. Before each acquisition, refill by elapsed time and clamp to capacity, then deduct only when enough tokens remain. Time should be monotonic; handle a backwards clock according to the contract. An in-memory instance limits one process only, not a fleet of application servers.",
    "codeOrArtifact": "const solution = (function solution({ capacity, refillPerSecond, events }) { let tokens = capacity, last = 0; return events.map(({ time, cost }) => { tokens = Math.min(capacity, tokens + (time - last) * refillPerSecond / 1000); last = time; if (cost > tokens)\n        return false; tokens -= cost; return true; }); });",
    "architectureNotes": "Follow-up: Design an atomic shared-store update for multiple servers and state how fail-open versus fail-closed affects the product.\nTopic reference: https://namastedev.com/practice/rate-limiter\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "rate-limiter-correctness",
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
    "Design an atomic shared-store update for multiple servers and state how fail-open versus fail-closed affects the product."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Initial burst; exact boundary; partial refill.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "rate-limiter-variation",
      "question": "Design an atomic shared-store update for multiple servers and state how fail-open versus fail-closed affects the product.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep capacity, refill rate, current tokens, and the last update instant. Before each acquisition, refill by elapsed time and clamp to capacity, then deduct only when enough tokens remain. Time should be monotonic; handle a backwards clock according to the contract. An in-memory instance limits one process only, not a fleet of application servers. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
