# Reference: Frontend: Implement a Queue using Stack

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Push new values onto an incoming stack. When the outgoing stack is empty, transfer every incoming value to it, reversing order once; then pop or peek outgoing. Each item moves at most once between stacks, giving amortized O(1) operations although one transfer costs O(n). Define underflow separately from a stored undefined value.",
    "codeOrArtifact": "const solution = (function solution(commands) { const incoming = [], outgoing = []; return commands.map(c => { if (c.type === 'enqueue') {\n        incoming.push(c.value);\n        return incoming.length + outgoing.length;\n    } if (c.type === 'size')\n        return incoming.length + outgoing.length; if (!outgoing.length)\n        while (incoming.length)\n            outgoing.push(incoming.pop()); if (c.type === 'peek')\n        return outgoing.length ? outgoing[outgoing.length - 1] : null; return outgoing.length ? outgoing.pop() : null; }); });",
    "architectureNotes": "Follow-up: Explain amortized analysis using a potential function and contrast it with worst-case per-operation latency.\nTopic reference: https://namastedev.com/practice/implement-a-queue-using-stack\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-a-queue-using-stack-correctness",
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
    "Explain amortized analysis using a potential function and contrast it with worst-case per-operation latency."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Interleaved operations; transfer boundary; empty queue.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-a-queue-using-stack-variation",
      "question": "Explain amortized analysis using a potential function and contrast it with worst-case per-operation latency.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Push new values onto an incoming stack. When the outgoing stack is empty, transfer every incoming value to it, reversing order once; then pop or peek outgoing. Each item moves at most once between stacks, giving amortized O(1) operations although one transfer costs O(n). Define underflow separately from a stored undefined value. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
