# Reference: Frontend: Longest Valid Parentheses

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a stack of indices seeded with -1 as the boundary before a candidate segment. Push opening indices; on a closing symbol pop, then either reset the boundary if the stack is empty or measure the span from the current index to the stack top. This is O(n) time and O(n) worst-case stack space. The goal is a substring, not a subsequence.",
    "codeOrArtifact": "const solution = (function solution(text) { const stack = [-1]; let best = 0; for (let i = 0; i < text.length; i++) {\n        if (text[i] === '(')\n            stack.push(i);\n        else {\n            stack.pop();\n            if (!stack.length)\n                stack.push(i);\n            else\n                best = Math.max(best, i - stack[stack.length - 1]);\n        }\n    } return best; });",
    "architectureNotes": "Follow-up: Compare the stack solution with a two-pass counter method and explain why both directions are needed there.\nTopic reference: https://namastedev.com/practice/longest-valid-parentheses\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "longest-valid-parentheses-correctness",
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
    "Compare the stack solution with a two-pass counter method and explain why both directions are needed there."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All opens; all closes; nested valid block.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "longest-valid-parentheses-variation",
      "question": "Compare the stack solution with a two-pass counter method and explain why both directions are needed there.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a stack of indices seeded with -1 as the boundary before a candidate segment. Push opening indices; on a closing symbol pop, then either reset the boundary if the stack is empty or measure the span from the current index to the stack top. This is O(n) time and O(n) worst-case stack space. The goal is a substring, not a subsequence. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
