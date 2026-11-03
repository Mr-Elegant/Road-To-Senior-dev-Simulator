# Reference: Frontend: implement curry()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Capture collected arguments in a new closure for each call, and invoke the original once the declared arity is satisfied. Preserve the receiver according to an explicit policy, commonly the receiver of the final invocation. Function.length is only a default hint because optional and rest parameters change its meaning. An explicit arity makes the contract clearer.",
    "codeOrArtifact": "const solution = (function solution(groups) { function curry(fn, args = []) { return (...next) => args.length + next.length >= 3 ? fn(...args, ...next) : curry(fn, [...args, ...next]); } let result = curry((a, b, c) => a + 2 * b + 3 * c); for (const group of groups)\n        result = result(...group); return result; });",
    "architectureNotes": "Follow-up: Add placeholders and explain how filling argument holes changes the collection algorithm.\nTopic reference: https://namastedev.com/practice/implement-curry\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-curry-correctness",
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
    "Add placeholders and explain how filling argument holes changes the collection algorithm."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One argument per call; grouped arguments; zero arity.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-curry-variation",
      "question": "Add placeholders and explain how filling argument holes changes the collection algorithm.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Capture collected arguments in a new closure for each call, and invoke the original once the declared arity is satisfied. Preserve the receiver according to an explicit policy, commonly the receiver of the final invocation. Function.length is only a default hint because optional and rest parameters change its meaning. An explicit arity makes the contract clearer. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
