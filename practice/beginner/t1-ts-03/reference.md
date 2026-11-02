# Reference: What is the difference between an interface and a type alias in TypeScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Both `interface` and `type` can describe object shapes. The key differences: `interface` is open to **declaration merging** (declaring the same interface twice merges its fields) and can be extended with `extends`, making it ideal for object contracts and library design. A `type` alias can represent not only objects, but also primitives, unions (`type ID = string | number`), tuples, and mapped types. Modern TypeScript allows using either for objects, but `type` is required for unions.",
    "example": "// Interface (extensible object shape)\ninterface User {\n  id: string;\n  name: string;\n}\ninterface AdminUser extends User {\n  permissions: string[];\n}\n\n// Type alias (handles unions and primitives)\ntype Status = 'pending' | 'active' | 'archived';\ntype ResponseData = User | null;",
    "followUp": {
      "question": "Can an interface define a union type like string | number?",
      "expectedAnswer": "No. An interface can only define object structures; union types require the type keyword."
    }
  },
  "expectedConcepts": [
    "interface syntax (interface User { ... }) and extension via extends",
    "type alias syntax (type User = { ... }) and union/primitive capabilities",
    "Declaration merging in interfaces (adding properties to existing interfaces)",
    "General recommendation: interface for object shapes, type for unions/primitives"
  ]
}
```
