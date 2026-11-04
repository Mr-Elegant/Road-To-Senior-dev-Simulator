# Reference: What is the difference between loose equality (==) and strict equality (===)?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The loose equality operator (`==`) compares values after performing implicit type coercion if the operands are of different types. The strict equality operator (`===`) compares both the value and the type without any coercion. In modern JavaScript, `===` is almost always preferred to avoid subtle bugs caused by unexpected type conversions.",
    "example": "console.log(5 == \"5\");   // true (string \"5\" is coerced to number 5)\nconsole.log(5 === \"5\");  // false (number is not equal to string)\n\nconsole.log(0 == false); // true (both coerce to 0)\nconsole.log(0 === false);// false (different types)\nconsole.log(null == undefined); // true\nconsole.log(null === undefined); // false",
    "code": "function isStrictlyEqual(a, b) {\n  return a === b;\n}",
    "followUp": {
      "question": "Is there any common case where == is intentionally used?",
      "expectedAnswer": "A common pattern is \"value == null\", which checks if a value is either null OR undefined in a single check."
    }
  },
  "expectedConcepts": [
    "Type coercion (implicit conversion)",
    "Strict equality checking both type and value",
    "Best practice of using ==="
  ]
}
```
