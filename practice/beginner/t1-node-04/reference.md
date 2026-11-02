# Reference: What are the main HTTP methods and how do their purposes differ?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "HTTP methods define the desired action to be performed on a resource: **GET** retrieves data without modifying server state (safe and idempotent); **POST** sends data in the request body to create a new record; **PUT** replaces an existing resource in its entirety; **PATCH** applies a partial update modifying only the specified fields; and **DELETE** removes the specified resource. An operation is *idempotent* if making the same request multiple times produces the exact same end result (like GET, PUT, and DELETE).",
    "example": "// 1. GET: Read profile\nfetch('/api/users/12');\n\n// 2. POST: Create new user\nfetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Sam', email: 'sam@example.com' }),\n});\n\n// 3. PATCH: Update only the email\nfetch('/api/users/12', {\n  method: 'PATCH',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ email: 'new_sam@example.com' }),\n});",
    "followUp": {
      "question": "What is the practical difference between PUT and PATCH?",
      "expectedAnswer": "PUT expects you to send the complete updated resource (overwriting missing fields with null or defaults), while PATCH modifies only the specific fields sent in the payload."
    }
  },
  "expectedConcepts": [
    "GET: Retrieve resource data (safe, read-only, idempotent)",
    "POST: Create a new resource (non-idempotent)",
    "PUT: Replace an entire resource",
    "PATCH: Partially update specific fields of a resource",
    "DELETE: Remove a resource",
    "Idempotency concept in simple terms"
  ]
}
```
