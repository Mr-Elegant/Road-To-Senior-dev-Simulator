# Reference: How do you type arrays and objects in TypeScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Arrays can be typed using either square bracket notation (`string[]` or `number[]`) or generic syntax (`Array<string>`). For arrays of objects, you combine the object type with brackets (`User[]`). Objects are typed by defining an interface or inline object signature specifying each property key and its corresponding type.",
    "example": "// Array typing\nconst skills: string[] = ['React', 'TypeScript', 'Node.js'];\nconst scores: Array<number> = [98, 85, 92];\n\n// Object typing\ninterface Product {\n  id: number;\n  title: string;\n  price: number;\n  tags: string[];\n}\n\nconst laptop: Product = {\n  id: 101,\n  title: 'Pro Laptop',\n  price: 1299,\n  tags: ['electronics', 'computers']\n};",
    "code": "interface Movie {\n  id: number;\n  title: string;\n  genres: string[];\n}",
    "followUp": {
      "question": "What is a TypeScript tuple and how does it differ from a regular array?",
      "expectedAnswer": "A tuple is an array with a fixed number of elements where each position has a specific, defined type (e.g. type Coordinate = [number, number])."
    }
  },
  "expectedConcepts": [
    "Array syntax: type[] or Array<type>",
    "Readonly arrays (readonly string[] or ReadonlyArray<string>)",
    "Object type annotations specifying keys and values",
    "Nested object structures"
  ]
}
```
