# Reference: How do if/else statements and switch statements differ in JavaScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`if/else` evaluates arbitrary boolean conditions (comparisons, ranges, compound logic with `&&`/`||`). A `switch` statement evaluates a single expression once and matches its result against multiple discrete `case` values using strict equality (`===`). If `break` is omitted in a switch case, execution \"falls through\" into subsequent cases until a `break` or `return` is reached.",
    "example": "// if/else handles ranges well\nif (score >= 90) grade = 'A';\nelse if (score >= 80) grade = 'B';\nelse grade = 'C';\n\n// switch handles discrete status strings cleanly\nswitch (status) {\n  case 'PENDING':\n    badge = 'yellow';\n    break;\n  case 'APPROVED':\n    badge = 'green';\n    break;\n  default:\n    badge = 'gray';\n}",
    "followUp": {
      "question": "What happens if you forget to put a break statement in a case block?",
      "expectedAnswer": "The program continues executing the code in the subsequent case block regardless of whether that case matches, known as case fall-through."
    }
  },
  "expectedConcepts": [
    "Boolean expression branching vs discrete value matching",
    "switch syntax (case, break, default)",
    "Fall-through behavior when break is omitted"
  ]
}
```
