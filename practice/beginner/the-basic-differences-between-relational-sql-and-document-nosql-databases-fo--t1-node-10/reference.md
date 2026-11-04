# Reference: What are the basic differences between Relational (SQL) and Document (NoSQL) databases for beginners?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**Relational (SQL) databases** (e.g. PostgreSQL, MySQL) store data in structured **tables** with defined columns, data types, and rows. They use SQL for queries, enforce schemas strictly, and link entities using **Primary Keys** and **Foreign Keys**, making them ideal for financial ledgers and relational data. **Document (NoSQL) databases** (e.g. MongoDB) store data in flexible, JSON-like **documents** grouped into collections, allowing fields to vary per document, making them ideal for rapidly evolving unstructured data.",
    "example": "// SQL Relational Table Model:\n// Table \"Users\": (id INT PRIMARY KEY, name VARCHAR, email VARCHAR UNIQUE)\n// Table \"Orders\": (id INT PRIMARY KEY, user_id INT REFERENCES Users(id), total DECIMAL)\n\n// NoSQL Document Model (MongoDB):\n// Collection \"orders\":\n{\n  \"_id\": \"64bf10...\",\n  \"total\": 129.50,\n  \"user\": {\n    \"name\": \"Jordan\",\n    \"email\": \"jordan@example.com\"\n  },\n  \"items\": [\n    { \"product\": \"Mouse\", \"qty\": 1, \"price\": 29.50 },\n    { \"product\": \"Keyboard\", \"qty\": 1, \"price\": 100.00 }\n  ]\n}",
    "followUp": {
      "question": "What is a Primary Key in a relational database table?",
      "expectedAnswer": "A Primary Key is a column (or set of columns) that uniquely identifies each individual record/row in a table, ensuring no duplicate rows exist."
    }
  },
  "expectedConcepts": [
    "SQL / Relational: Tables with fixed schemas (columns/rows), primary keys, foreign key relationships, ACID transactions (e.g. PostgreSQL, MySQL)",
    "NoSQL / Document: Flexible JSON-like documents, dynamic schemas, collections (e.g. MongoDB)",
    "When to choose SQL (structured data, financial transactions, clear relations) vs NoSQL (unstructured or rapidly evolving schema)"
  ]
}
```
