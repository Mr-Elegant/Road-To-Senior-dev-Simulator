# Reference: Frontend: Implement a Stack

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the backing array private and expose operations with documented empty behavior. Array push/pop provide amortized O(1) operations at the end; unshift/shift needlessly move entries. Return size from actual storage rather than maintaining an inconsistent second counter. If undefined can be a valid value, use an explicit result shape or size check to distinguish underflow.",
    "codeOrArtifact": "const solution = (function solution(commands) { const stack = []; return commands.map(c => { if (c.type === 'push') {\n        stack.push(c.value);\n        return stack.length;\n    } if (c.type === 'size')\n        return stack.length; if (c.type === 'peek')\n        return stack.length ? stack[stack.length - 1] : null; return stack.length ? stack.pop() : null; }); });",
    "architectureNotes": "Follow-up: Add a minimum-value operation using an auxiliary minimum stack with duplicate minima handled correctly.\nTopic reference: https://namastedev.com/practice/implement-a-stack\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "implement-a-stack-correctness",
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
    "Add a minimum-value operation using an auxiliary minimum stack with duplicate minima handled correctly."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty pop/peek; undefined value; repeated pushes/pops.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "implement-a-stack-variation",
      "question": "Add a minimum-value operation using an auxiliary minimum stack with duplicate minima handled correctly.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the backing array private and expose operations with documented empty behavior. Array push/pop provide amortized O(1) operations at the end; unshift/shift needlessly move entries. Return size from actual storage rather than maintaining an inconsistent second counter. If undefined can be a valid value, use an explicit result shape or size check to distinguish underflow. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
