import { Tier1Question } from '@/types/tier1';

export const nodeApiQuestions: Tier1Question[] = [
  {
    id: 't1-node-01',
    title: 'What is Node.js and how does running JavaScript in Node differ from running it in a web browser?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'V8 JavaScript engine executing outside the browser',
      'No browser DOM, window, or document objects',
      'Access to server-side operating system APIs (file system fs, networking http, process)',
      'Global object (global instead of window)',
    ],
    shortReferenceAnswer:
      'Node.js is an open-source, cross-platform JavaScript runtime built on Google Chrome’s V8 engine that allows JavaScript to be executed on a server or computer outside of a browser. In a browser, JavaScript is sandboxed to manipulate web pages (via `window`, `document`, and the DOM) without direct file system access. In Node.js, there is no DOM or `window` object; instead, Node provides APIs to interact directly with the operating system, access files (`fs`), create web servers (`http`), and manage system processes (`process`).',
    practicalExample: `// Browser JavaScript:
// document.getElementById('btn').addEventListener('click', ...);

// Node.js Server JavaScript:
const fs = require('fs');
const http = require('http');

// Read a file from the server's hard drive:
const serverConfig = fs.readFileSync('config.json', 'utf8');

// Create an HTTP server listening on port 8080:
const server = http.createServer((req, res) => {
  res.end('Hello from Node.js server!');
});
server.listen(8080);`,
    optionalFollowUp: {
      question: 'What is npm in the Node.js ecosystem?',
      expectedAnswer:
        'npm (Node Package Manager) is the default package manager for Node.js, used to install, share, and manage open-source third-party libraries and project dependencies.',
    },
    hints: [
      'Can you access document.querySelector in Node.js?',
      'What can Node.js do with your computer hard drive that browsers cannot?',
    ],
  },
  {
    id: 't1-node-02',
    title: 'What is meant by the "non-blocking, event-driven I/O" model in Node.js?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'Single-threaded execution for JavaScript code',
      'Non-blocking I/O (Input/Output like disk reading or network requests do not pause the server)',
      'Callbacks and Promises when background operations finish',
      'Efficiency in handling many concurrent connections with low memory footprint',
    ],
    shortReferenceAnswer:
      'In traditional multi-threaded servers, each client connection spawns a new thread that blocks (pauses) while waiting for disk or database operations to finish. Node.js uses a single main thread with **non-blocking asynchronous I/O**. When Node performs a file read or database query, it sends the task to the underlying operating system and immediately continues processing other incoming requests. When the I/O task completes, Node is notified via an event and triggers the callback or resolves the Promise.',
    practicalExample: `console.log('1. Server ready to accept requests');

// Asynchronous / Non-blocking file read
fs.readFile('large_dataset.csv', 'utf8', (err, data) => {
  console.log('3. File finished reading in background');
});

console.log('2. Server can handle user login while file is still reading!');
// Output order: 1, 2, 3`,
    optionalFollowUp: {
      question: 'What happens if you execute a heavy CPU calculation (like a loop with 10 billion cycles) in Node.js?',
      expectedAnswer:
        'Because the main thread is single-threaded, heavy synchronous CPU work blocks the event loop, freezing the server and preventing all other users from receiving responses until it finishes.',
    },
    hints: [
      'Does Node.js wait idle while a database query is running?',
      'How does non-blocking I/O allow one server thread to handle thousands of simultaneous user connections?',
    ],
  },
  {
    id: 't1-node-03',
    title: 'What is a REST API and what are its core architectural principles?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'Representational State Transfer',
      'Client-Server separation of concerns',
      'Statelessness (each request contains all information needed, no server session reliance)',
      'Resource-oriented URLs (/api/users, /api/orders/123)',
      'Standard HTTP methods (GET, POST, PUT, DELETE) and JSON data format',
    ],
    shortReferenceAnswer:
      'A **REST API** (Representational State Transfer) is an architectural style for web services that enables clients (like a React frontend or mobile app) to communicate with a backend server over HTTP. Key principles include: 1) **Statelessness** (every request must contain all credentials and parameters needed; the server stores no client session context), 2) **Resource-based URLs** representing nouns (e.g. `/api/articles`), and 3) Using standard **HTTP methods** and returning structured data formats (almost universally JSON).',
    practicalExample: `// Good RESTful URL design (nouns, clear hierarchy):
// GET    /api/products          -> Fetch list of products
// GET    /api/products/42       -> Fetch specific product by ID
// POST   /api/products          -> Create a new product (data in body)
// PUT    /api/products/42       -> Update existing product completely
// DELETE /api/products/42       -> Delete product

// Anti-pattern (verbs in URL):
// /api/getProducts, /api/deleteProductById`,
    optionalFollowUp: {
      question: 'Why should REST endpoints use plural nouns (/api/users) rather than verbs (/api/getAllUsers)?',
      expectedAnswer:
        'Because the HTTP method itself already represents the verb (GET, POST, DELETE), keeping the URL clean and focused purely on the resource name.',
    },
    hints: [
      'What does "stateless" mean in terms of server memory between requests?',
      'Should URLs contain verbs like /create or nouns like /items?',
    ],
  },
  {
    id: 't1-node-04',
    title: 'What are the main HTTP methods and how do their purposes differ?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'GET: Retrieve resource data (safe, read-only, idempotent)',
      'POST: Create a new resource (non-idempotent)',
      'PUT: Replace an entire resource',
      'PATCH: Partially update specific fields of a resource',
      'DELETE: Remove a resource',
      'Idempotency concept in simple terms',
    ],
    shortReferenceAnswer:
      'HTTP methods define the desired action to be performed on a resource: **GET** retrieves data without modifying server state (safe and idempotent); **POST** sends data in the request body to create a new record; **PUT** replaces an existing resource in its entirety; **PATCH** applies a partial update modifying only the specified fields; and **DELETE** removes the specified resource. An operation is *idempotent* if making the same request multiple times produces the exact same end result (like GET, PUT, and DELETE).',
    practicalExample: `// 1. GET: Read profile
fetch('/api/users/12');

// 2. POST: Create new user
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Sam', email: 'sam@example.com' }),
});

// 3. PATCH: Update only the email
fetch('/api/users/12', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'new_sam@example.com' }),
});`,
    optionalFollowUp: {
      question: 'What is the practical difference between PUT and PATCH?',
      expectedAnswer:
        'PUT expects you to send the complete updated resource (overwriting missing fields with null or defaults), while PATCH modifies only the specific fields sent in the payload.',
    },
    hints: [
      'Which method is strictly for reading data without changing anything?',
      'Which method creates a new resource?',
      'What is the difference between replacing everything (PUT) vs updating one field (PATCH)?',
    ],
  },
  {
    id: 't1-node-05',
    title: 'What are the most common HTTP status code ranges and their specific meanings?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      '2xx Success: 200 OK, 201 Created',
      '3xx Redirection: 301 Moved Permanently, 304 Not Modified',
      '4xx Client Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found',
      '5xx Server Errors: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable',
      'Difference between 401 (Authentication required) and 403 (Permission denied)',
    ],
    shortReferenceAnswer:
      'HTTP status codes indicate the result of a request: **2xx (Success)** like `200 OK` (successful retrieval) and `201 Created` (new resource made via POST). **4xx (Client Error)** means the client made an invalid request, including `400 Bad Request` (invalid input/schema), `401 Unauthorized` (missing or invalid credentials), `403 Forbidden` (authenticated, but lacking permission), and `404 Not Found` (resource does not exist). **5xx (Server Error)** like `500 Internal Server Error` means an unhandled exception crashed on the backend.',
    practicalExample: `// In an Express route:
app.post('/api/tasks', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' }); // 400 Client Error
  }
  
  const newTask = database.insert(req.body);
  return res.status(201).json(newTask); // 201 Created
});`,
    optionalFollowUp: {
      question: 'How do you explain the difference between 401 Unauthorized and 403 Forbidden?',
      expectedAnswer:
        '401 means "Who are you? Please log in first." 403 means "I know who you are, but you do not have permission to view or modify this resource."',
    },
    hints: [
      'What status code indicates a new item was successfully created?',
      'Which status code means a page or resource is missing?',
      'What status code indicates an unhandled server crash?',
    ],
  },
  {
    id: 't1-node-06',
    title: 'How do you build a basic web server and define routes using Express.js?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'Importing express and instantiating app = express()',
      'express.json() middleware for parsing JSON request bodies',
      'Defining route handlers (app.get, app.post)',
      'Starting the server with app.listen(port, callback)',
    ],
    shortReferenceAnswer:
      'Express.js is a minimalist web framework for Node.js. To build a server: 1) Instantiate the application with `const app = express()`, 2) Register body parsing middleware with `app.use(express.json())`, 3) Define route handlers using `app.get(\'/path\', (req, res) => { ... })` and `app.post(...)`, and 4) Start listening for incoming network requests by calling `app.listen(port)`.',
    practicalExample: `const express = require('express');
const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// GET Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// POST Route
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

// Start listening
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    optionalFollowUp: {
      question: 'What happens if you do not include app.use(express.json()) when handling a POST request with a JSON body?',
      expectedAnswer:
        'req.body will be undefined, and attempting to read properties from req.body will throw an error.',
    },
    hints: [
      'What function starts the server on a port?',
      'What middleware is required so Express can understand JSON request bodies?',
    ],
    codingExercise: {
      instruction:
        'Write an Express route app.get("/api/ping") that returns a JSON response { message: "pong" } with status 200.',
      starterCode: `const express = require('express');
const app = express();

// Define app.get("/api/ping") here
`,
      solutionCode: `const express = require('express');
const app = express();

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});`,
      language: 'javascript',
      expectedOutput: 'app.get("/api/ping", (req, res) => res.status(200).json({ message: "pong" }))',
    },
  },
  {
    id: 't1-node-07',
    title: 'How do you extract data from req.params, req.query, and req.body in Express?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'req.params: URL path parameters defined with colons (/api/users/:id)',
      'req.query: URL query string parameters after the question mark (?page=2&search=cat)',
      'req.body: The parsed payload sent in POST/PUT request bodies',
      'Use cases for each data source',
    ],
    shortReferenceAnswer:
      '`req.params` contains route parameters defined in the path with a colon (e.g. `/users/:userId` gives `req.params.userId`), used to identify a specific resource. `req.query` contains key-value pairs parsed from the URL query string after `?` (e.g. `/items?sort=price&limit=10` gives `req.query.sort`), used for filtering, pagination, and sorting. `req.body` contains the structured JSON payload sent in the request body of `POST`, `PUT`, or `PATCH` requests.',
    practicalExample: `// 1. Path param: /api/orders/order-99
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params; // "order-99"
  res.json({ id: orderId });
});

// 2. Query param: /api/search?q=javascript&page=1
app.get('/api/search', (req, res) => {
  const { q, page } = req.query; // q: "javascript", page: "1"
  res.json({ search: q, page: Number(page) });
});

// 3. Request body: POST /api/orders
app.post('/api/orders', (req, res) => {
  const { item, quantity } = req.body; // Parsed JSON
  res.status(201).json({ created: item, qty: quantity });
});`,
    optionalFollowUp: {
      question: 'What data type are query parameters when read from req.query?',
      expectedAnswer:
        'They are always strings (or arrays of strings if repeated). You must parse numbers explicitly using Number() or parseInt().',
    },
    hints: [
      'Which one reads from the path like /users/:id?',
      'Which one reads from after the ? in the URL?',
      'Which one reads data sent in the body of a POST request?',
    ],
  },
  {
    id: 't1-node-08',
    title: 'What is Express middleware and what is the role of the next() function?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'Middleware function signature (req, res, next)',
      'Pipeline execution order in Express',
      'Calling next() to pass control to the subsequent middleware or route handler',
      'Ending the request-response cycle (sending response or returning error)',
      'Common uses: Logging, authentication checks, request validation, CORS',
    ],
    shortReferenceAnswer:
      'Middleware functions in Express are functions that have access to the `req` (request) object, the `res` (response) object, and the `next` function in the application’s request-response cycle. Middleware can run code, modify request/response objects, end the request by sending a response, or call `next()` to pass control to the next middleware in line. If a middleware neither ends the response nor calls `next()`, the client request will hang indefinitely.',
    practicalExample: `// Custom logging middleware:
const loggerMiddleware = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Hands off control to the next handler
};

app.use(loggerMiddleware);

// Authentication guard middleware:
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access token required' }); // Halts pipeline
  }
  next(); // User is authenticated, proceed to route
};

app.get('/api/dashboard', requireAuth, (req, res) => {
  res.json({ secretData: 'Confidential stats' });
});`,
    optionalFollowUp: {
      question: 'What happens if you pass an argument to next(err)?',
      expectedAnswer:
        'Express recognizes any argument passed to next() as an error and skips all remaining normal routes to jump straight to the designated error-handling middleware.',
    },
    hints: [
      'What happens if your middleware does not call next() and does not call res.send()?',
      'What are the 3 parameters every standard Express middleware receives?',
    ],
  },
  {
    id: 't1-node-09',
    title: 'What are environment variables, process.env, and why must secret keys never be committed to Git?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'Operating system environment variables accessible via process.env',
      'Separating code from configuration (Twelve-Factor App methodology)',
      '.env files and the dotenv package',
      'Security risks of committing API keys, tokens, or database passwords to public repositories',
      '.gitignore file to exclude .env and credentials',
    ],
    shortReferenceAnswer:
      'Environment variables are external key-value pairs provided by the operating system or deployment platform that configure an application without altering its source code. In Node.js, they are accessed via `process.env.VARIABLE_NAME`. Keeping configuration (like database connection strings, JWT secrets, and API keys) in environment variables and `.env` files ensures that sensitive credentials are never committed to version control repositories (Git), protecting them from theft and leaks.',
    practicalExample: `// .env file (Added to .gitignore):
// PORT=5000
// DATABASE_URL=postgresql://user:secretpass@localhost:5432/mydb
// STRIPE_API_KEY=sk_test_12345

// server.js
require('dotenv').config(); // Loads .env into process.env

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!process.env.STRIPE_API_KEY) {
  console.error('Missing required STRIPE_API_KEY environment variable!');
  process.exit(1);
}`,
    optionalFollowUp: {
      question: 'What is a .env.example file and why is it helpful for teams?',
      expectedAnswer:
        'A .env.example file is committed to Git and lists all required environment variable names with dummy placeholder values so team members know what configuration keys they need to set locally.',
    },
    hints: [
      'What Node.js global object holds environment variables?',
      'Which file tells Git not to commit your secret .env file?',
    ],
  },
  {
    id: 't1-node-10',
    title: 'What are the basic differences between Relational (SQL) and Document (NoSQL) databases for beginners?',
    category: 'Node.js and API Fundamentals',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'SQL / Relational: Tables with fixed schemas (columns/rows), primary keys, foreign key relationships, ACID transactions (e.g. PostgreSQL, MySQL)',
      'NoSQL / Document: Flexible JSON-like documents, dynamic schemas, collections (e.g. MongoDB)',
      'When to choose SQL (structured data, financial transactions, clear relations) vs NoSQL (unstructured or rapidly evolving schema)',
    ],
    shortReferenceAnswer:
      '**Relational (SQL) databases** (e.g. PostgreSQL, MySQL) store data in structured **tables** with defined columns, data types, and rows. They use SQL for queries, enforce schemas strictly, and link entities using **Primary Keys** and **Foreign Keys**, making them ideal for financial ledgers and relational data. **Document (NoSQL) databases** (e.g. MongoDB) store data in flexible, JSON-like **documents** grouped into collections, allowing fields to vary per document, making them ideal for rapidly evolving unstructured data.',
    practicalExample: `// SQL Relational Table Model:
// Table "Users": (id INT PRIMARY KEY, name VARCHAR, email VARCHAR UNIQUE)
// Table "Orders": (id INT PRIMARY KEY, user_id INT REFERENCES Users(id), total DECIMAL)

// NoSQL Document Model (MongoDB):
// Collection "orders":
{
  "_id": "64bf10...",
  "total": 129.50,
  "user": {
    "name": "Jordan",
    "email": "jordan@example.com"
  },
  "items": [
    { "product": "Mouse", "qty": 1, "price": 29.50 },
    { "product": "Keyboard", "qty": 1, "price": 100.00 }
  ]
}`,
    optionalFollowUp: {
      question: 'What is a Primary Key in a relational database table?',
      expectedAnswer:
        'A Primary Key is a column (or set of columns) that uniquely identifies each individual record/row in a table, ensuring no duplicate rows exist.',
    },
    hints: [
      'Which database type uses tables with columns and rows: SQL or NoSQL?',
      'Which database type stores data looking like nested JSON objects?',
    ],
  },
];

