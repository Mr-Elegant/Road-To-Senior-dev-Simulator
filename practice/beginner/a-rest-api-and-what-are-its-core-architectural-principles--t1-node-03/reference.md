# Reference: What is a REST API and what are its core architectural principles?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A **REST API** (Representational State Transfer) is an architectural style for web services that enables clients (like a React frontend or mobile app) to communicate with a backend server over HTTP. Key principles include: 1) **Statelessness** (every request must contain all credentials and parameters needed; the server stores no client session context), 2) **Resource-based URLs** representing nouns (e.g. `/api/articles`), and 3) Using standard **HTTP methods** and returning structured data formats (almost universally JSON).",
    "example": "// Good RESTful URL design (nouns, clear hierarchy):\n// GET    /api/products          -> Fetch list of products\n// GET    /api/products/42       -> Fetch specific product by ID\n// POST   /api/products          -> Create a new product (data in body)\n// PUT    /api/products/42       -> Update existing product completely\n// DELETE /api/products/42       -> Delete product\n\n// Anti-pattern (verbs in URL):\n// /api/getProducts, /api/deleteProductById",
    "followUp": {
      "question": "Why should REST endpoints use plural nouns (/api/users) rather than verbs (/api/getAllUsers)?",
      "expectedAnswer": "Because the HTTP method itself already represents the verb (GET, POST, DELETE), keeping the URL clean and focused purely on the resource name."
    }
  },
  "expectedConcepts": [
    "Representational State Transfer",
    "Client-Server separation of concerns",
    "Statelessness (each request contains all information needed, no server session reliance)",
    "Resource-oriented URLs (/api/users, /api/orders/123)",
    "Standard HTTP methods (GET, POST, PUT, DELETE) and JSON data format"
  ]
}
```
