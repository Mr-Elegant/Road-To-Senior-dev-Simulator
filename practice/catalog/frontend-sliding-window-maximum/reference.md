# Reference: Frontend: Sliding Window Maximum

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Maintain a deque of candidate indices in decreasing value order. Remove indices that have left the window from the front and dominated candidates from the back before adding the new index. The front is the current maximum. Each index enters and leaves at most once, yielding O(n) time and O(k) auxiliary space. Use a head pointer or real deque rather than repeated shift.",
    "codeOrArtifact": "const solution = (function solution({ values, k }) { if (!Number.isInteger(k) || k < 1 || k > values.length)\n        throw new Error('Invalid window'); const deque = [], out = []; let head = 0; for (let i = 0; i < values.length; i++) {\n        while (head < deque.length && deque[head] <= i - k)\n            head++;\n        while (head < deque.length && values[deque[deque.length - 1]] <= values[i])\n            deque.pop();\n        deque.push(i);\n        if (i >= k - 1)\n            out.push(values[deque[head]]);\n    } return out; });",
    "architectureNotes": "Follow-up: Return maximum positions with a documented oldest-versus-newest tie policy for equal values.\nTopic reference: https://namastedev.com/practice/sliding-window-maximum\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sliding-window-maximum-correctness",
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
    "Return maximum positions with a documented oldest-versus-newest tie policy for equal values."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: k=1; k=n; duplicates.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sliding-window-maximum-variation",
      "question": "Return maximum positions with a documented oldest-versus-newest tie policy for equal values.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Maintain a deque of candidate indices in decreasing value order. Remove indices that have left the window from the front and dominated candidates from the back before adding the new index. The front is the current maximum. Each index enters and leaves at most once, yielding O(n) time and O(k) auxiliary space. Use a head pointer or real deque rather than repeated shift. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
