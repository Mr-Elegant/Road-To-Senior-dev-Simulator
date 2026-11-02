# Reference: How do you access, update, and destructure JavaScript object properties?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Object properties can be accessed using dot notation (`obj.name`) when the key is known and valid identifier syntax, or bracket notation (`obj[key]`) when the key is stored in a variable or contains spaces/dashes. ES6 Object destructuring allows extracting properties into standalone variables (`const { name, age = 18 } = user`).",
    "example": "const person = { name: 'Sarah', age: 28, 'home-city': 'Seattle' };\n\n// Dot vs bracket\nconsole.log(person.name); // 'Sarah'\nconsole.log(person['home-city']); // 'Seattle'\nconst field = 'age';\nconsole.log(person[field]); // 28\n\n// Destructuring with rename & default\nconst { name, role = 'Developer' } = person;\nconsole.log(name, role); // 'Sarah', 'Developer'",
    "code": "function getFullName(user) {\n  const { firstName, lastName } = user;\n  return `${firstName} ${lastName}`;\n}",
    "followUp": {
      "question": "What is the difference between Object.keys(), Object.values(), and Object.entries()?",
      "expectedAnswer": "Object.keys() returns an array of property names; Object.values() returns an array of property values; Object.entries() returns an array of [key, value] pairs."
    }
  },
  "expectedConcepts": [
    "Dot notation vs Bracket notation for dynamic keys",
    "Object destructuring syntax with default values",
    "Adding and updating properties"
  ]
}
```
