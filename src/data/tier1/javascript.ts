import { Tier1Question } from '@/types/tier1';

export const javascriptQuestions: Tier1Question[] = [
  {
    id: 't1-js-01',
    title: 'What is the difference between var, let, and const in JavaScript?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'Scope (function-scoped vs block-scoped)',
      'Reassignment and mutability',
      'Hoisting and Temporal Dead Zone (TDZ)',
    ],
    shortReferenceAnswer:
      '`var` is function-scoped and can be re-declared and updated; it is hoisted with an initial value of `undefined`. `let` is block-scoped (lives only within `{ }`) and can be reassigned, but not re-declared in the same scope. `const` is also block-scoped, but cannot be reassigned after initialization. Both `let` and `const` are hoisted into a Temporal Dead Zone (TDZ), meaning accessing them before declaration throws a `ReferenceError`.',
    practicalExample: `// var leaks out of blocks
if (true) {
  var x = 10;
  let y = 20;
}
console.log(x); // 10
// console.log(y); // ReferenceError: y is not defined

const user = { name: 'Alex' };
user.name = 'Sam'; // Allowed! Object properties can still be modified.
// user = {}; // TypeError: Assignment to constant variable.`,
    optionalFollowUp: {
      question: 'Does const make an array or object completely immutable?',
      expectedAnswer:
        'No. const only prevents reassigning the variable identifier to a new memory reference. The contents or properties of the array or object can still be mutated unless Object.freeze() is used.',
    },
    hints: [
      'Think about where each variable can be accessed (inside a function vs inside an if-block).',
      'Consider whether you are allowed to change the value after creating it.',
    ],
    codingExercise: {
      instruction:
        'Declare a block-scoped variable named count initialized to 0 that can be updated, and a constant named MAX_LIMIT set to 10.',
      starterCode: `function initializeCounters() {
  // Declare count and MAX_LIMIT here
  return { count, MAX_LIMIT };
}`,
      solutionCode: `function initializeCounters() {
  let count = 0;
  const MAX_LIMIT = 10;
  return { count, MAX_LIMIT };
}`,
      language: 'javascript',
      expectedOutput: 'count: 0, MAX_LIMIT: 10',
    },
  },
  {
    id: 't1-js-02',
    title: 'What are JavaScript data types and how does primitive vs reference comparison work?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'Primitives (string, number, boolean, null, undefined, symbol, bigint)',
      'Reference types (Object, Array, Function)',
      'Comparison by value vs comparison by memory reference',
    ],
    shortReferenceAnswer:
      'JavaScript has 7 primitive types (string, number, boolean, null, undefined, symbol, bigint) and Reference types (Objects, Arrays, Functions). Primitives are immutable and compared by value. Objects and arrays are stored in heap memory and compared by reference (memory address); two distinct objects with identical properties evaluate to `false` when compared with `===`.',
    practicalExample: `let a = "hello";
let b = "hello";
console.log(a === b); // true (compared by value)

let obj1 = { id: 1 };
let obj2 = { id: 1 };
console.log(obj1 === obj2); // false (different memory references)
let obj3 = obj1;
console.log(obj1 === obj3); // true (same reference)`,
    optionalFollowUp: {
      question: 'What is typeof null and why does it return that?',
      expectedAnswer:
        'typeof null returns "object". This is a historical bug in JavaScript from its first version where type tags in memory marked null as an object, preserved for backwards compatibility.',
    },
    hints: [
      'Distinguish between values stored directly on the stack versus objects stored by pointer.',
      'Think about comparing two separate objects that look identical.',
    ],
  },
  {
    id: 't1-js-03',
    title: 'What is the difference between loose equality (==) and strict equality (===)?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'Type coercion (implicit conversion)',
      'Strict equality checking both type and value',
      'Best practice of using ===',
    ],
    shortReferenceAnswer:
      'The loose equality operator (`==`) compares values after performing implicit type coercion if the operands are of different types. The strict equality operator (`===`) compares both the value and the type without any coercion. In modern JavaScript, `===` is almost always preferred to avoid subtle bugs caused by unexpected type conversions.',
    practicalExample: `console.log(5 == "5");   // true (string "5" is coerced to number 5)
console.log(5 === "5");  // false (number is not equal to string)

console.log(0 == false); // true (both coerce to 0)
console.log(0 === false);// false (different types)
console.log(null == undefined); // true
console.log(null === undefined); // false`,
    optionalFollowUp: {
      question: 'Is there any common case where == is intentionally used?',
      expectedAnswer:
        'A common pattern is "value == null", which checks if a value is either null OR undefined in a single check.',
    },
    hints: [
      'Think about what JavaScript does when comparing a number to a string.',
      'Which operator checks the data type first before comparing?',
    ],
    codingExercise: {
      instruction:
        'Write a function isStrictlyEqual(a, b) that returns true only if a and b have identical types and values.',
      starterCode: `function isStrictlyEqual(a, b) {
  // Your code here
}`,
      solutionCode: `function isStrictlyEqual(a, b) {
  return a === b;
}`,
      language: 'javascript',
      sampleInput: 'isStrictlyEqual(42, "42")',
      expectedOutput: 'false',
    },
  },
  {
    id: 't1-js-04',
    title: 'How do if/else statements and switch statements differ in JavaScript?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'Boolean expression branching vs discrete value matching',
      'switch syntax (case, break, default)',
      'Fall-through behavior when break is omitted',
    ],
    shortReferenceAnswer:
      '`if/else` evaluates arbitrary boolean conditions (comparisons, ranges, compound logic with `&&`/`||`). A `switch` statement evaluates a single expression once and matches its result against multiple discrete `case` values using strict equality (`===`). If `break` is omitted in a switch case, execution "falls through" into subsequent cases until a `break` or `return` is reached.',
    practicalExample: `// if/else handles ranges well
if (score >= 90) grade = 'A';
else if (score >= 80) grade = 'B';
else grade = 'C';

// switch handles discrete status strings cleanly
switch (status) {
  case 'PENDING':
    badge = 'yellow';
    break;
  case 'APPROVED':
    badge = 'green';
    break;
  default:
    badge = 'gray';
}`,
    optionalFollowUp: {
      question: 'What happens if you forget to put a break statement in a case block?',
      expectedAnswer:
        'The program continues executing the code in the subsequent case block regardless of whether that case matches, known as case fall-through.',
    },
    hints: [
      'Which structure is better for evaluating ranges like score > 80?',
      'What keyword is required in switch to stop execution from bleeding into the next case?',
    ],
  },
  {
    id: 't1-js-05',
    title: 'What are the differences between for, while, and for...of loops?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      'Standard for loop with counter (init, condition, increment)',
      'while loop executing as long as a condition holds',
      'for...of loop iterating over values of an iterable (Arrays, Strings, Maps)',
      'Difference between for...of (values) and for...in (keys/properties)',
    ],
    shortReferenceAnswer:
      'A traditional `for` loop uses an explicit index/counter (`for (let i = 0; i < len; i++)`), ideal when index access is needed. A `while` loop runs repeatedly as long as a condition is true, ideal when the number of iterations is unknown in advance. A `for...of` loop is a clean ES6 syntax that directly iterates over the values of any iterable collection (Arrays, Strings, Sets) without managing an index.',
    practicalExample: `const fruits = ['Apple', 'Banana', 'Cherry'];

// for...of accesses values directly
for (const fruit of fruits) {
  console.log(fruit);
}

// traditional for when index is needed
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}`,
    optionalFollowUp: {
      question: 'Why should you avoid using for...in when iterating over array items?',
      expectedAnswer:
        'for...in iterates over enumerable property keys (including prototype properties) as strings, not values, and does not guarantee index order.',
    },
    hints: [
      'Which loop provides direct access to array items without fruits[i]?',
      'When would a while loop be preferred over a for loop?',
    ],
    codingExercise: {
      instruction:
        'Write a function sumArray(numbers) that uses a for...of loop to compute and return the sum of an array of numbers.',
      starterCode: `function sumArray(numbers) {
  let total = 0;
  // Use for...of to iterate over numbers
  return total;
}`,
      solutionCode: `function sumArray(numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}`,
      language: 'javascript',
      sampleInput: 'sumArray([1, 2, 3, 4, 5])',
      expectedOutput: '15',
    },
  },
  {
    id: 't1-js-06',
    title: 'What is the difference between a regular function and an arrow function?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'Syntax brevity and implicit return',
      'Lexical this binding vs dynamic this',
      'arguments object availability',
      'Constructor usage (arrow functions cannot be used with new)',
    ],
    shortReferenceAnswer:
      'Regular functions (`function foo() {}`) have their own dynamic `this` context determined by how the function is invoked, provide access to the `arguments` object, and can be used as constructors with `new`. Arrow functions (`() => {}`) have shorter syntax, implicit return for single expressions, and inherit `this` lexically from their enclosing scope. Arrow functions cannot be used with `new` and do not have their own `arguments` object.',
    practicalExample: `const timer = {
  seconds: 0,
  start() {
    // Arrow function retains 'this' pointing to timer object
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};`,
    optionalFollowUp: {
      question: 'Can you use an arrow function as an object method if it needs to access this.property?',
      expectedAnswer:
        'Usually no, because the arrow function will lexically bind this to the surrounding scope (e.g. window or module) rather than the object itself.',
    },
    hints: [
      'Think about what happens to "this" inside a callback.',
      'Notice the difference between explicit return { return x; } and implicit return (x => x * 2).',
    ],
    codingExercise: {
      instruction:
        'Convert the regular function function double(n) { return n * 2; } into a concise one-line arrow function named double.',
      starterCode: `// Convert this to a one-line arrow function:
// function double(n) { return n * 2; }
const double = null;`,
      solutionCode: `const double = (n) => n * 2;`,
      language: 'javascript',
      sampleInput: 'double(7)',
      expectedOutput: '14',
    },
  },
  {
    id: 't1-js-07',
    title: 'How do map, filter, and find work on JavaScript arrays?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'map transforms every element and returns a new array of same length',
      'filter tests elements with a predicate and returns a subset array',
      'find returns the first matching item or undefined',
      'Immutability (none of these mutate the original array)',
    ],
    shortReferenceAnswer:
      '`map()` runs a callback on every element and returns a new array of the transformed results. `filter()` tests each element against a boolean condition and returns a new array containing only items that passed. `find()` returns the very first element that matches the condition, stopping further iteration, or `undefined` if no match is found. All three leave the original array untouched.',
    practicalExample: `const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
];

const names = users.map(u => u.name); // ['Alice', 'Bob', 'Charlie']
const activeUsers = users.filter(u => u.active); // Alice & Charlie
const bob = users.find(u => u.id === 2); // { id: 2, name: 'Bob', active: false }`,
    optionalFollowUp: {
      question: 'What is the difference between find and filter when you are looking for one item?',
      expectedAnswer:
        'find returns the single element directly (or undefined), whereas filter always returns an array (which might be empty or contain one item).',
    },
    hints: [
      'Which method changes the shape or value of elements?',
      'Which method reduces the list to only items meeting a condition?',
      'Which method stops at the first match?',
    ],
    codingExercise: {
      instruction:
        'Write a function getEvenNumbers(numbers) that uses the filter method to return only even numbers.',
      starterCode: `function getEvenNumbers(numbers) {
  // Use numbers.filter() to return only even numbers
}`,
      solutionCode: `function getEvenNumbers(numbers) {
  return numbers.filter((num) => num % 2 === 0);
}`,
      language: 'javascript',
      sampleInput: 'getEvenNumbers([1, 2, 3, 4, 5, 6])',
      expectedOutput: '[2, 4, 6]',
    },
  },
  {
    id: 't1-js-08',
    title: 'How do you access, update, and destructure JavaScript object properties?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'Dot notation vs Bracket notation for dynamic keys',
      'Object destructuring syntax with default values',
      'Adding and updating properties',
    ],
    shortReferenceAnswer:
      'Object properties can be accessed using dot notation (`obj.name`) when the key is known and valid identifier syntax, or bracket notation (`obj[key]`) when the key is stored in a variable or contains spaces/dashes. ES6 Object destructuring allows extracting properties into standalone variables (`const { name, age = 18 } = user`).',
    practicalExample: `const person = { name: 'Sarah', age: 28, 'home-city': 'Seattle' };

// Dot vs bracket
console.log(person.name); // 'Sarah'
console.log(person['home-city']); // 'Seattle'
const field = 'age';
console.log(person[field]); // 28

// Destructuring with rename & default
const { name, role = 'Developer' } = person;
console.log(name, role); // 'Sarah', 'Developer'`,
    optionalFollowUp: {
      question: 'What is the difference between Object.keys(), Object.values(), and Object.entries()?',
      expectedAnswer:
        'Object.keys() returns an array of property names; Object.values() returns an array of property values; Object.entries() returns an array of [key, value] pairs.',
    },
    hints: [
      'When the property name is stored in a variable, can you use dot notation?',
      'Destructuring lets you pull out properties in one line: const { prop } = obj.',
    ],
    codingExercise: {
      instruction:
        'Write a function getFullName(user) that destructures firstName and lastName from the user object and returns a formatted string "firstName lastName".',
      starterCode: `function getFullName(user) {
  // Destructure firstName and lastName here
  return '';
}`,
      solutionCode: `function getFullName(user) {
  const { firstName, lastName } = user;
  return \`\${firstName} \${lastName}\`;
}`,
      language: 'javascript',
      sampleInput: 'getFullName({ firstName: "John", lastName: "Doe" })',
      expectedOutput: '"John Doe"',
    },
  },
  {
    id: 't1-js-09',
    title: 'What is variable scope and what is a closure in simple terms?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'Global scope, Function scope, and Block scope',
      'Lexical scoping (inner functions can see outer variables)',
      'Closure: A function that remembers the variables from its outer lexical scope even after that outer function has returned',
    ],
    shortReferenceAnswer:
      'Scope determines the accessibility of variables in your code. JavaScript has global scope, function scope, and block scope. A **closure** is created when an inner function retains access to its outer function’s variables, even after the outer function has finished executing and returned.',
    practicalExample: `function createCounter() {
  let count = 0; // Private variable enclosed by closure
  return function increment() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
// count cannot be accessed or modified directly from outside!`,
    optionalFollowUp: {
      question: 'What is a practical use case for closures in day-to-day web development?',
      expectedAnswer:
        'Data privacy (encapsulating private state), function factories, and callback handlers like event listeners or setTimeout.',
    },
    hints: [
      'Think about where a variable is born and where it can be seen.',
      'When an outer function returns an inner function, what happens to the variables in the outer function?',
    ],
    codingExercise: {
      instruction:
        'Complete the createMultiplier(factor) function so that it returns a function that multiplies any input number by the given factor.',
      starterCode: `function createMultiplier(factor) {
  // Return an inner function that accepts (num) and multiplies by factor
}`,
      solutionCode: `function createMultiplier(factor) {
  return function (num) {
    return num * factor;
  };
}`,
      language: 'javascript',
      sampleInput: 'const triple = createMultiplier(3); triple(4)',
      expectedOutput: '12',
    },
  },
  {
    id: 't1-js-10',
    title: 'What is hoisting in JavaScript?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'Compilation phase moving declarations to top of scope',
      'Function declarations being fully hoisted',
      'var hoisted with undefined',
      'let and const hoisted into the Temporal Dead Zone (TDZ)',
    ],
    shortReferenceAnswer:
      'Hoisting is JavaScript’s default behavior of moving declarations to the top of their containing scope during compilation before code executes. Function declarations are completely hoisted (callable before declaration). Variables declared with `var` are hoisted and initialized to `undefined`. Variables declared with `let` and `const` are hoisted into memory but remain uninitialized in the "Temporal Dead Zone" until their line of declaration is reached.',
    practicalExample: `greet(); // Works! Outputs: "Hello!"
function greet() {
  console.log("Hello!");
}

console.log(score); // undefined (var is hoisted without value)
var score = 100;

// console.log(points); // ReferenceError: Cannot access 'points' before initialization
let points = 50;`,
    optionalFollowUp: {
      question: 'Are function expressions (e.g. const greet = function() {}) hoisted like function declarations?',
      expectedAnswer:
        'No. Only the variable identifier is hoisted (and if declared with const/let, it stays in the TDZ); the function assignment itself occurs only when that line runs.',
    },
    hints: [
      'Why can you call a normal function before the line it is defined on?',
      'What value does var have before its assignment line?',
    ],
  },
  {
    id: 't1-js-11',
    title: 'What are Promises and how does async/await make handling them easier?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 11,
    expectedConcepts: [
      'Promise states: Pending, Fulfilled, Rejected',
      'Handling with .then() and .catch()',
      'async/await syntax for writing asynchronous code that reads synchronously',
      'Error handling with try/catch',
    ],
    shortReferenceAnswer:
      'A Promise represents the eventual result of an asynchronous operation and can be in one of three states: Pending, Fulfilled, or Rejected. While Promises can be chained using `.then()` and `.catch()`, ES2017 `async/await` syntax allows asynchronous code to be written and read like standard synchronous code, using standard `try/catch` blocks for clean error handling.',
    practicalExample: `// Using async/await
async function loadUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Network error');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to load user:', error.message);
  }
}`,
    optionalFollowUp: {
      question: 'What does an async function always return?',
      expectedAnswer:
        'An async function always returns a Promise. If a non-promise value is returned, JavaScript automatically wraps it in a resolved Promise.',
    },
    hints: [
      'What are the 3 states of a Promise?',
      'What keyword must be placed before a function to allow using the await keyword inside it?',
    ],
  },
  {
    id: 't1-js-12',
    title: 'How does the JavaScript event loop work in simple terms?',
    category: 'JavaScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 12,
    expectedConcepts: [
      'Single-threaded execution',
      'Call Stack (current execution)',
      'Web APIs / Background handlers (timers, fetch)',
      'Task Queue / Callback Queue waiting for stack to clear',
    ],
    shortReferenceAnswer:
      'JavaScript is single-threaded, meaning it can only execute one command at a time on its **Call Stack**. When asynchronous tasks like `setTimeout` or `fetch` are initiated, they are offloaded to background browser APIs. Once complete, their callbacks enter the **Task Queue**. The **Event Loop** continuously monitors the Call Stack; as soon as the Call Stack is completely empty, it pushes the first waiting callback from the Queue onto the stack.',
    practicalExample: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// Output order: 1, 3, 2
// Explanation: Even with 0ms delay, the setTimeout callback must wait in the Task Queue until synchronous code (1 and 3) finishes executing.`,
    optionalFollowUp: {
      question: 'Why does setTimeout with 0ms delay not execute immediately before the next line?',
      expectedAnswer:
        'Because setTimeout is asynchronous; its callback is queued in the task queue and the event loop will only execute queued tasks after the main call stack is cleared.',
    },
    hints: [
      'Think of the call stack as a stack of plates and the queue as a waiting line.',
      'Notice what prints first when you run console.log before and after setTimeout.',
    ],
  },
];

