# Reference: How do map, filter, and find work on JavaScript arrays?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`map()` runs a callback on every element and returns a new array of the transformed results. `filter()` tests each element against a boolean condition and returns a new array containing only items that passed. `find()` returns the very first element that matches the condition, stopping further iteration, or `undefined` if no match is found. All three leave the original array untouched.",
    "example": "const users = [\n  { id: 1, name: 'Alice', active: true },\n  { id: 2, name: 'Bob', active: false },\n  { id: 3, name: 'Charlie', active: true }\n];\n\nconst names = users.map(u => u.name); // ['Alice', 'Bob', 'Charlie']\nconst activeUsers = users.filter(u => u.active); // Alice & Charlie\nconst bob = users.find(u => u.id === 2); // { id: 2, name: 'Bob', active: false }",
    "code": "function getEvenNumbers(numbers) {\n  return numbers.filter((num) => num % 2 === 0);\n}",
    "followUp": {
      "question": "What is the difference between find and filter when you are looking for one item?",
      "expectedAnswer": "find returns the single element directly (or undefined), whereas filter always returns an array (which might be empty or contain one item)."
    }
  },
  "expectedConcepts": [
    "map transforms every element and returns a new array of same length",
    "filter tests elements with a predicate and returns a subset array",
    "find returns the first matching item or undefined",
    "Immutability (none of these mutate the original array)"
  ]
}
```
