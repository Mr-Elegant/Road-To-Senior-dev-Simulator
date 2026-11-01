import { Tier1Question } from '@/types/tier1';

export const typescriptQuestions: Tier1Question[] = [
  {
    id: 't1-ts-01',
    title: 'What is TypeScript and what primary advantages does it offer over vanilla JavaScript?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'Typed superset of JavaScript compiling to plain JavaScript',
      'Compile-time error detection (catching bugs before running code)',
      'Rich IDE auto-completion and intelligent refactoring',
      'Self-documenting code with clear contracts and interfaces',
    ],
    shortReferenceAnswer:
      'TypeScript is a statically typed superset of JavaScript developed by Microsoft that adds optional static typing. It compiles into standard JavaScript that any browser or Node runtime can execute. Its primary advantages are: catching type errors during development before code runs in production, providing rich IDE code completion and instant refactoring, and acting as living self-documentation for function signatures and API responses.',
    practicalExample: `// Vanilla JS: Silently fails or concatenates strings unexpectedly
// function add(a, b) { return a + b; }
// add(5, "10") -> "510" (Bug!)

// TypeScript: Catches error immediately in editor
function add(a: number, b: number): number {
  return a + b;
}
// add(5, "10"); // TS2345: Argument of type 'string' is not assignable to 'number'`,
    optionalFollowUp: {
      question: 'Do TypeScript types exist at runtime in the browser?',
      expectedAnswer:
        'No. TypeScript types are completely erased during compilation. At runtime, the browser executes only pure JavaScript.',
    },
    hints: [
      'Does TypeScript run directly in browsers, or does it need to compile?',
      'When are TypeScript type errors caught: at compile time or at runtime?',
    ],
  },
  {
    id: 't1-ts-02',
    title: 'What are the basic primitive types in TypeScript and how do type annotations work?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'string, number, boolean, null, undefined, symbol, bigint',
      'Type annotations using colon syntax (let name: string = "Alice")',
      'Type inference (TypeScript automatically inferring types without explicit annotations)',
    ],
    shortReferenceAnswer:
      'TypeScript’s primitive types mirror JavaScript primitives: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`. You provide explicit type annotations using the colon syntax (`let age: number = 25`). However, TypeScript has powerful **type inference**, meaning if you assign a value immediately, TypeScript automatically infers the correct type without requiring redundant annotations.',
    practicalExample: `let username: string = 'Alex';
let score: number = 95.5;
let isCompleted: boolean = false;

// Type Inference (explicit annotation is optional here)
let city = 'Seattle'; // Inferred as string
// city = 42; // Error: Type 'number' is not assignable to type 'string'.`,
    optionalFollowUp: {
      question: 'Does TypeScript differentiate between integers and floating point numbers?',
      expectedAnswer:
        'No, just like JavaScript, all numbers in TypeScript are of type number (double-precision 64-bit float).',
    },
    hints: [
      'What symbol is used to annotate a variable with a type?',
      'Do you always need to write : string if you initialize let name = "Alex"?',
    ],
    codingExercise: {
      instruction:
        'Add type annotations to a function calculateTotal(price, quantity) that accepts two numbers and returns a number.',
      starterCode: `function calculateTotal(price, quantity) {
  return price * quantity;
}`,
      solutionCode: `function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}`,
      language: 'typescript',
      expectedOutput: 'calculateTotal(price: number, quantity: number): number',
    },
  },
  {
    id: 't1-ts-03',
    title: 'What is the difference between an interface and a type alias in TypeScript?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'interface syntax (interface User { ... }) and extension via extends',
      'type alias syntax (type User = { ... }) and union/primitive capabilities',
      'Declaration merging in interfaces (adding properties to existing interfaces)',
      'General recommendation: interface for object shapes, type for unions/primitives',
    ],
    shortReferenceAnswer:
      'Both `interface` and `type` can describe object shapes. The key differences: `interface` is open to **declaration merging** (declaring the same interface twice merges its fields) and can be extended with `extends`, making it ideal for object contracts and library design. A `type` alias can represent not only objects, but also primitives, unions (`type ID = string | number`), tuples, and mapped types. Modern TypeScript allows using either for objects, but `type` is required for unions.',
    practicalExample: `// Interface (extensible object shape)
interface User {
  id: string;
  name: string;
}
interface AdminUser extends User {
  permissions: string[];
}

// Type alias (handles unions and primitives)
type Status = 'pending' | 'active' | 'archived';
type ResponseData = User | null;`,
    optionalFollowUp: {
      question: 'Can an interface define a union type like string | number?',
      expectedAnswer:
        'No. An interface can only define object structures; union types require the type keyword.',
    },
    hints: [
      'Which keyword is required when defining a union like type Status = "open" | "closed"?',
      'Which keyword uses the extends keyword for inheritance?',
    ],
  },
  {
    id: 't1-ts-04',
    title: 'How do you type arrays and objects in TypeScript?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'Array syntax: type[] or Array<type>',
      'Readonly arrays (readonly string[] or ReadonlyArray<string>)',
      'Object type annotations specifying keys and values',
      'Nested object structures',
    ],
    shortReferenceAnswer:
      'Arrays can be typed using either square bracket notation (`string[]` or `number[]`) or generic syntax (`Array<string>`). For arrays of objects, you combine the object type with brackets (`User[]`). Objects are typed by defining an interface or inline object signature specifying each property key and its corresponding type.',
    practicalExample: `// Array typing
const skills: string[] = ['React', 'TypeScript', 'Node.js'];
const scores: Array<number> = [98, 85, 92];

// Object typing
interface Product {
  id: number;
  title: string;
  price: number;
  tags: string[];
}

const laptop: Product = {
  id: 101,
  title: 'Pro Laptop',
  price: 1299,
  tags: ['electronics', 'computers']
};`,
    optionalFollowUp: {
      question: 'What is a TypeScript tuple and how does it differ from a regular array?',
      expectedAnswer:
        'A tuple is an array with a fixed number of elements where each position has a specific, defined type (e.g. type Coordinate = [number, number]).',
    },
    hints: [
      'How do you say "an array of numbers" in TypeScript?',
      'What error occurs if you try to put a string into a number[] array?',
    ],
    codingExercise: {
      instruction:
        'Define an interface Movie with id (number), title (string), and genres (array of strings).',
      starterCode: `// Define interface Movie here
`,
      solutionCode: `interface Movie {
  id: number;
  title: string;
  genres: string[];
}`,
      language: 'typescript',
      expectedOutput: 'interface Movie with id: number; title: string; genres: string[];',
    },
  },
  {
    id: 't1-ts-05',
    title: 'How do you type function parameters, return values, and functions that return nothing (void)?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      'Parameter typing (a: string, b: number)',
      'Return type annotation after parentheses: function foo(): string',
      'The void return type for functions that do not return a value',
      'Function type expressions: (id: string) => void',
    ],
    shortReferenceAnswer:
      'Function parameters are typed with colon annotations (`(x: number, y: number)`), and return types are annotated after the closing parenthesis (`): number`). If a function performs an action (such as logging or updating state) without returning any value, its return type is `void`. You can also define standalone function signatures using arrow notation (`type OnClick = () => void`).',
    practicalExample: `// Explicit parameter and return type
function formatPrice(amount: number, currency: string): string {
  return \`\${currency}\${amount.toFixed(2)}\`;
}

// Function returning nothing (void)
function logError(message: string): void {
  console.error('[App Error]:', message);
}

// Typing a callback prop in React:
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent) => void;
}`,
    optionalFollowUp: {
      question: 'What is the difference between void and undefined as a function return type?',
      expectedAnswer:
        'A function with return type undefined MUST explicitly have "return undefined;" or "return;", whereas a void function does not need to return anything.',
    },
    hints: [
      'What type represents "returns nothing"?',
      'Where do you place the return type in a function declaration?',
    ],
  },
  {
    id: 't1-ts-06',
    title: 'How do optional properties (?) and optional chaining (?.) work in TypeScript?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'Optional property syntax (property?: type in interfaces)',
      'How optional properties equate to type | undefined',
      'Optional chaining operator (?.) preventing "cannot read property of undefined" errors at runtime',
      'Nullish coalescing operator (??) for default fallbacks',
    ],
    shortReferenceAnswer:
      'An optional property is marked with a question mark (`?`) in an interface or type (`email?: string`), meaning objects are allowed to omit that property; its type becomes `string | undefined`. When accessing deeply nested properties that might be undefined, the **optional chaining operator** (`?.`) safely stops evaluation and returns `undefined` if the reference is nullish, preventing runtime crashes.',
    practicalExample: `interface UserProfile {
  id: string;
  name: string;
  bio?: string; // Optional property
  address?: {
    city?: string;
  };
}

const user: UserProfile = { id: 'u1', name: 'Alex' }; // Valid! bio and address omitted

// Optional chaining safely evaluates without throwing errors:
const city = user.address?.city ?? 'Unknown City';
console.log(city); // 'Unknown City'`,
    optionalFollowUp: {
      question: 'Can you use optional chaining with function calls?',
      expectedAnswer:
        'Yes! You can write onComplete?.() which will only call the function if onComplete is not null or undefined.',
    },
    hints: [
      'What character indicates a field in an interface is optional?',
      'How does obj?.user?.name prevent runtime crashes?',
    ],
  },
  {
    id: 't1-ts-07',
    title: 'What are union types and how do you narrow them using typeof guards?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'Union operator (|) allowing a value to be one of several types',
      'Type narrowing: TypeScript refining a broad type into a specific type based on runtime checks',
      'typeof type guards for primitives (typeof val === "string")',
      'Compile-time safety preventing invalid operations on unions',
    ],
    shortReferenceAnswer:
      'A union type uses the pipe operator (`|`) to allow a variable to hold values of several different types (e.g. `string | number`). Because a union could be either type, TypeScript only allows operations common to all members. To safely use type-specific methods, you perform **type narrowing** using runtime checks like `typeof`. Inside the `if` block, TypeScript automatically narrows the type.',
    practicalExample: `function printId(id: string | number) {
  // id.toUpperCase(); // Error! number does not have toUpperCase

  // Type narrowing using typeof:
  if (typeof id === 'string') {
    console.log('String ID:', id.toUpperCase()); // In this block, id is string!
  } else {
    console.log('Numeric ID:', id.toFixed(0));   // In this block, id is number!
  }
}`,
    optionalFollowUp: {
      question: 'How do you narrow between two different object types in a union?',
      expectedAnswer:
        'You can use the "in" operator (e.g. if ("role" in user)), instanceof for classes, or a discriminated union with a shared literal tag like kind: "circle".',
    },
    hints: [
      'What symbol means "or" in TypeScript types?',
      'How does an if (typeof x === "string") statement help TypeScript understand the type?',
    ],
    codingExercise: {
      instruction:
        'Write a function formatInput(val: string | number): string that converts numbers to string with .toFixed(2) and trims strings.',
      starterCode: `function formatInput(val: string | number): string {
  // Use typeof to narrow and format
}`,
      solutionCode: `function formatInput(val: string | number): string {
  if (typeof val === 'number') {
    return val.toFixed(2);
  }
  return val.trim();
}`,
      language: 'typescript',
      expectedOutput: 'Narrowed string or number handling',
    },
  },
  {
    id: 't1-ts-08',
    title: 'What is the difference between any and unknown in TypeScript and why is unknown safer?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'any disables all type checking (escape hatch back to unchecked JavaScript)',
      'unknown represents any value but forbids operations until narrowed',
      'Type-safety: unknown forces developers to verify the type before accessing methods or properties',
    ],
    shortReferenceAnswer:
      '`any` turns off TypeScript’s type checking completely; you can access any property, call it as a function, and assign it anywhere, losing all type safety. In contrast, `unknown` represents a value whose type is not yet known (such as an API response). Unlike `any`, TypeScript strictly forbids you from accessing properties or calling an `unknown` variable until you explicitly narrow its type using runtime checks (`typeof`, `instanceof`), ensuring type safety.',
    practicalExample: `let valAny: any = "hello";
valAny.nonExistentMethod(); // Compiles fine, crashes at runtime!

let valUnknown: unknown = "hello";
// valUnknown.toUpperCase(); // Error: 'valUnknown' is of type 'unknown'.

// Must narrow first:
if (typeof valUnknown === 'string') {
  console.log(valUnknown.toUpperCase()); // Safe and allowed!
}`,
    optionalFollowUp: {
      question: 'When should you use unknown instead of any?',
      expectedAnswer:
        'Whenever handling external, unvalidated data like JSON.parse() results or third-party API payloads, use unknown so your code is forced to validate fields before use.',
    },
    hints: [
      'Which one completely shuts down TypeScript’s compiler checks?',
      'Which one requires you to check if (typeof x === ...) before using it?',
    ],
  },
  {
    id: 't1-ts-09',
    title: 'What are literal types and how are they used to model exact state values?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'String, number, and boolean literals (exact values as types)',
      'Combining literals with unions to create finite sets of allowed values',
      'Autocomplete and typo prevention over arbitrary string types',
    ],
    shortReferenceAnswer:
      'Literal types allow you to specify exact values that a string, number, or boolean must have, rather than any arbitrary string or number. By combining string literals with union types (`type Theme = "light" | "dark" | "system"`), you create safe enums that provide immediate IDE autocomplete and catch typos like `"ligth"` at compile time.',
    practicalExample: `type NotificationType = 'success' | 'warning' | 'error';

function showToast(message: string, type: NotificationType) {
  // Implementation
}

showToast('Saved successfully', 'success'); // Valid!
// showToast('Failed', 'danger'); // Error: Argument of type '"danger"' is not assignable to 'NotificationType'.`,
    optionalFollowUp: {
      question: 'What is a discriminated union in TypeScript?',
      expectedAnswer:
        'A pattern where multiple object types share a single common literal property (like kind: "success" | "error"), allowing TypeScript to narrow the entire object when you check that property.',
    },
    hints: [
      'Instead of allowing any string, how can you limit a variable to only "paid" or "unpaid"?',
      'What happens if you type a misspelled string when literal types are used?',
    ],
  },
  {
    id: 't1-ts-10',
    title: 'What are basic Generics in TypeScript and why are they useful?',
    category: 'TypeScript Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'Generics as type variables (<T>) that preserve type relationships',
      'Reusable components and functions that work across multiple types without using any',
      'Generic interfaces (interface ApiResponse<T> { data: T })',
      'Common built-in generics (Array<T>, Promise<T>)',
    ],
    shortReferenceAnswer:
      'Generics allow you to write reusable functions, classes, and interfaces that work with different data types while preserving full type safety. Instead of using `any` (which loses type info), a generic uses a type variable like `<T>`. When the function is called, TypeScript captures the exact argument type into `T` and guarantees that the return value matches that same type.',
    practicalExample: `// Generic function: preserves the exact type passed in
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const numbers = [10, 20, 30];
const firstNumber = getFirstItem(numbers); // Inferred as number | undefined

const names = ['Alice', 'Bob'];
const firstName = getFirstItem(names);     // Inferred as string | undefined

// Generic API response container:
interface ApiResponse<T> {
  status: number;
  data: T;
}`,
    optionalFollowUp: {
      question: 'What does the letter T stand for in <T>?',
      expectedAnswer:
        'T conventionally stands for "Type". You can name generic type parameters anything (e.g. <ItemType>), but single uppercase letters like T, U, and V are standard conventions.',
    },
    hints: [
      'Think of generics as passing arguments to types, just like functions receive arguments.',
      'Why is <T>(arg: T): T better than (arg: any): any?',
    ],
    codingExercise: {
      instruction:
        'Create a generic function wrapInArray<T>(item: T): T[] that takes any single item and returns an array containing it.',
      starterCode: `function wrapInArray(item) {
  return [item];
}`,
      solutionCode: `function wrapInArray<T>(item: T): T[] {
  return [item];
}`,
      language: 'typescript',
      expectedOutput: 'function wrapInArray<T>(item: T): T[]',
    },
  },
];

