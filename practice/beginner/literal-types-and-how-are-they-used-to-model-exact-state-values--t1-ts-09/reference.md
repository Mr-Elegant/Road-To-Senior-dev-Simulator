# Reference: What are literal types and how are they used to model exact state values?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Literal types allow you to specify exact values that a string, number, or boolean must have, rather than any arbitrary string or number. By combining string literals with union types (`type Theme = \"light\" | \"dark\" | \"system\"`), you create safe enums that provide immediate IDE autocomplete and catch typos like `\"ligth\"` at compile time.",
    "example": "type NotificationType = 'success' | 'warning' | 'error';\n\nfunction showToast(message: string, type: NotificationType) {\n  // Implementation\n}\n\nshowToast('Saved successfully', 'success'); // Valid!\n// showToast('Failed', 'danger'); // Error: Argument of type '\"danger\"' is not assignable to 'NotificationType'.",
    "followUp": {
      "question": "What is a discriminated union in TypeScript?",
      "expectedAnswer": "A pattern where multiple object types share a single common literal property (like kind: \"success\" | \"error\"), allowing TypeScript to narrow the entire object when you check that property."
    }
  },
  "expectedConcepts": [
    "String, number, and boolean literals (exact values as types)",
    "Combining literals with unions to create finite sets of allowed values",
    "Autocomplete and typo prevention over arbitrary string types"
  ]
}
```
