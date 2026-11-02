# Reference: How do you extract data from req.params, req.query, and req.body in Express?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`req.params` contains route parameters defined in the path with a colon (e.g. `/users/:userId` gives `req.params.userId`), used to identify a specific resource. `req.query` contains key-value pairs parsed from the URL query string after `?` (e.g. `/items?sort=price&limit=10` gives `req.query.sort`), used for filtering, pagination, and sorting. `req.body` contains the structured JSON payload sent in the request body of `POST`, `PUT`, or `PATCH` requests.",
    "example": "// 1. Path param: /api/orders/order-99\napp.get('/api/orders/:orderId', (req, res) => {\n  const { orderId } = req.params; // \"order-99\"\n  res.json({ id: orderId });\n});\n\n// 2. Query param: /api/search?q=javascript&page=1\napp.get('/api/search', (req, res) => {\n  const { q, page } = req.query; // q: \"javascript\", page: \"1\"\n  res.json({ search: q, page: Number(page) });\n});\n\n// 3. Request body: POST /api/orders\napp.post('/api/orders', (req, res) => {\n  const { item, quantity } = req.body; // Parsed JSON\n  res.status(201).json({ created: item, qty: quantity });\n});",
    "followUp": {
      "question": "What data type are query parameters when read from req.query?",
      "expectedAnswer": "They are always strings (or arrays of strings if repeated). You must parse numbers explicitly using Number() or parseInt()."
    }
  },
  "expectedConcepts": [
    "req.params: URL path parameters defined with colons (/api/users/:id)",
    "req.query: URL query string parameters after the question mark (?page=2&search=cat)",
    "req.body: The parsed payload sent in POST/PUT request bodies",
    "Use cases for each data source"
  ]
}
```
