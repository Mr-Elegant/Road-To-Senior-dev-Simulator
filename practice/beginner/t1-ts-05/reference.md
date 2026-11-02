# Reference: How do you type function parameters, return values, and functions that return nothing (void)?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Function parameters are typed with colon annotations (`(x: number, y: number)`), and return types are annotated after the closing parenthesis (`): number`). If a function performs an action (such as logging or updating state) without returning any value, its return type is `void`. You can also define standalone function signatures using arrow notation (`type OnClick = () => void`).",
    "example": "// Explicit parameter and return type\nfunction formatPrice(amount: number, currency: string): string {\n  return `${currency}${amount.toFixed(2)}`;\n}\n\n// Function returning nothing (void)\nfunction logError(message: string): void {\n  console.error('[App Error]:', message);\n}\n\n// Typing a callback prop in React:\ninterface ButtonProps {\n  label: string;\n  onClick: (event: React.MouseEvent) => void;\n}",
    "followUp": {
      "question": "What is the difference between void and undefined as a function return type?",
      "expectedAnswer": "A function with return type undefined MUST explicitly have \"return undefined;\" or \"return;\", whereas a void function does not need to return anything."
    }
  },
  "expectedConcepts": [
    "Parameter typing (a: string, b: number)",
    "Return type annotation after parentheses: function foo(): string",
    "The void return type for functions that do not return a value",
    "Function type expressions: (id: string) => void"
  ]
}
```
