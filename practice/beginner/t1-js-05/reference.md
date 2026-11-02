# Reference: What are the differences between for, while, and for...of loops?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A traditional `for` loop uses an explicit index/counter (`for (let i = 0; i < len; i++)`), ideal when index access is needed. A `while` loop runs repeatedly as long as a condition is true, ideal when the number of iterations is unknown in advance. A `for...of` loop is a clean ES6 syntax that directly iterates over the values of any iterable collection (Arrays, Strings, Sets) without managing an index.",
    "example": "const fruits = ['Apple', 'Banana', 'Cherry'];\n\n// for...of accesses values directly\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// traditional for when index is needed\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(i, fruits[i]);\n}",
    "code": "function sumArray(numbers) {\n  let total = 0;\n  for (const num of numbers) {\n    total += num;\n  }\n  return total;\n}",
    "followUp": {
      "question": "Why should you avoid using for...in when iterating over array items?",
      "expectedAnswer": "for...in iterates over enumerable property keys (including prototype properties) as strings, not values, and does not guarantee index order."
    }
  },
  "expectedConcepts": [
    "Standard for loop with counter (init, condition, increment)",
    "while loop executing as long as a condition holds",
    "for...of loop iterating over values of an iterable (Arrays, Strings, Maps)",
    "Difference between for...of (values) and for...in (keys/properties)"
  ]
}
```
