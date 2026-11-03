# Reference: Frontend: Fibonacci Series

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate n as a nonnegative count, then iteratively update a pair of consecutive values and emit the requested count. This is O(n) additions and O(n) output storage; retaining only the nth value needs constant auxiliary storage. A naive recursive implementation repeats work exponentially. Use BigInt when exact values outgrow safe Number precision.",
    "codeOrArtifact": "const solution = (function solution(n) { if (!Number.isInteger(n) || n < 0 || n > 100)\n        throw new Error('Invalid n'); let a = 0n, b = 1n; const values = []; for (let i = 0; i < n; i++) {\n        values.push(a.toString());\n        [a, b] = [b, a + b];\n    } return values; });",
    "architectureNotes": "Follow-up: Compute the nth term with fast doubling in logarithmic recursion depth.\nTopic reference: https://namastedev.com/practice/fibonacci-series\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "fibonacci-series-correctness",
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
    "Compute the nth term with fast doubling in logarithmic recursion depth."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: n=0; n=1; n=2.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "fibonacci-series-variation",
      "question": "Compute the nth term with fast doubling in logarithmic recursion depth.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate n as a nonnegative count, then iteratively update a pair of consecutive values and emit the requested count. This is O(n) additions and O(n) output storage; retaining only the nth value needs constant auxiliary storage. A naive recursive implementation repeats work exponentially. Use BigInt when exact values outgrow safe Number precision. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
