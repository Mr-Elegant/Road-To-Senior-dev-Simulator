# Reference: Frontend: Combination Sum

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Sort validated positive candidates and backtrack from a start index. Recurse with the same index to allow reuse, and move the loop index forward to avoid permutation duplicates. Stop when the remaining target is zero and prune candidates larger than it. Zero or negative candidates would invalidate this termination argument and need a different contract.",
    "codeOrArtifact": "const solution = (function solution({ candidates, target }) { const nums = [...candidates].sort((a, b) => a - b), out = []; function dfs(start, left, path) { if (left === 0) {\n        out.push([...path]);\n        return;\n    } for (let i = start; i < nums.length; i++) {\n        if (nums[i] > left)\n            break;\n        path.push(nums[i]);\n        dfs(i, left - nums[i], path);\n        path.pop();\n    } } dfs(0, target, []); return out; });",
    "architectureNotes": "Follow-up: Implement a single-use variant and explain how advancing the recursive start index changes the search space.\nTopic reference: https://namastedev.com/practice/combination-sum\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "combination-sum-correctness",
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
    "Implement a single-use variant and explain how advancing the recursive start index changes the search space."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Target zero; no solution; repeated use.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "combination-sum-variation",
      "question": "Implement a single-use variant and explain how advancing the recursive start index changes the search space.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Sort validated positive candidates and backtrack from a start index. Recurse with the same index to allow reuse, and move the loop index forward to avoid permutation duplicates. Stop when the remaining target is zero and prune candidates larger than it. Zero or negative candidates would invalidate this termination argument and need a different contract. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
