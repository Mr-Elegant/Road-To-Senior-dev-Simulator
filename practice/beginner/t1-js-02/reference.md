# Reference: What are JavaScript data types and how does primitive vs reference comparison work?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "JavaScript has 7 primitive types (string, number, boolean, null, undefined, symbol, bigint) and Reference types (Objects, Arrays, Functions). Primitives are immutable and compared by value. Objects and arrays are stored in heap memory and compared by reference (memory address); two distinct objects with identical properties evaluate to `false` when compared with `===`.",
    "example": "let a = \"hello\";\nlet b = \"hello\";\nconsole.log(a === b); // true (compared by value)\n\nlet obj1 = { id: 1 };\nlet obj2 = { id: 1 };\nconsole.log(obj1 === obj2); // false (different memory references)\nlet obj3 = obj1;\nconsole.log(obj1 === obj3); // true (same reference)",
    "followUp": {
      "question": "What is typeof null and why does it return that?",
      "expectedAnswer": "typeof null returns \"object\". This is a historical bug in JavaScript from its first version where type tags in memory marked null as an object, preserved for backwards compatibility."
    }
  },
  "expectedConcepts": [
    "Primitives (string, number, boolean, null, undefined, symbol, bigint)",
    "Reference types (Object, Array, Function)",
    "Comparison by value vs comparison by memory reference"
  ]
}
```
