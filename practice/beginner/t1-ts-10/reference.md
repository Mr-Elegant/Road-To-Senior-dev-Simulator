# Reference: What are basic Generics in TypeScript and why are they useful?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Generics allow you to write reusable functions, classes, and interfaces that work with different data types while preserving full type safety. Instead of using `any` (which loses type info), a generic uses a type variable like `<T>`. When the function is called, TypeScript captures the exact argument type into `T` and guarantees that the return value matches that same type.",
    "example": "// Generic function: preserves the exact type passed in\nfunction getFirstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst numbers = [10, 20, 30];\nconst firstNumber = getFirstItem(numbers); // Inferred as number | undefined\n\nconst names = ['Alice', 'Bob'];\nconst firstName = getFirstItem(names);     // Inferred as string | undefined\n\n// Generic API response container:\ninterface ApiResponse<T> {\n  status: number;\n  data: T;\n}",
    "code": "function wrapInArray<T>(item: T): T[] {\n  return [item];\n}",
    "followUp": {
      "question": "What does the letter T stand for in <T>?",
      "expectedAnswer": "T conventionally stands for \"Type\". You can name generic type parameters anything (e.g. <ItemType>), but single uppercase letters like T, U, and V are standard conventions."
    }
  },
  "expectedConcepts": [
    "Generics as type variables (<T>) that preserve type relationships",
    "Reusable components and functions that work across multiple types without using any",
    "Generic interfaces (interface ApiResponse<T> { data: T })",
    "Common built-in generics (Array<T>, Promise<T>)"
  ]
}
```
