# Reference: What are the most common HTTP status code ranges and their specific meanings?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "HTTP status codes indicate the result of a request: **2xx (Success)** like `200 OK` (successful retrieval) and `201 Created` (new resource made via POST). **4xx (Client Error)** means the client made an invalid request, including `400 Bad Request` (invalid input/schema), `401 Unauthorized` (missing or invalid credentials), `403 Forbidden` (authenticated, but lacking permission), and `404 Not Found` (resource does not exist). **5xx (Server Error)** like `500 Internal Server Error` means an unhandled exception crashed on the backend.",
    "example": "// In an Express route:\napp.post('/api/tasks', (req, res) => {\n  if (!req.body.title) {\n    return res.status(400).json({ error: 'Title is required' }); // 400 Client Error\n  }\n  \n  const newTask = database.insert(req.body);\n  return res.status(201).json(newTask); // 201 Created\n});",
    "followUp": {
      "question": "How do you explain the difference between 401 Unauthorized and 403 Forbidden?",
      "expectedAnswer": "401 means \"Who are you? Please log in first.\" 403 means \"I know who you are, but you do not have permission to view or modify this resource.\""
    }
  },
  "expectedConcepts": [
    "2xx Success: 200 OK, 201 Created",
    "3xx Redirection: 301 Moved Permanently, 304 Not Modified",
    "4xx Client Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found",
    "5xx Server Errors: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable",
    "Difference between 401 (Authentication required) and 403 (Permission denied)"
  ]
}
```
