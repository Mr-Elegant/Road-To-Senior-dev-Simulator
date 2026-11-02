# Reference: What are environment variables, process.env, and why must secret keys never be committed to Git?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Environment variables are external key-value pairs provided by the operating system or deployment platform that configure an application without altering its source code. In Node.js, they are accessed via `process.env.VARIABLE_NAME`. Keeping configuration (like database connection strings, JWT secrets, and API keys) in environment variables and `.env` files ensures that sensitive credentials are never committed to version control repositories (Git), protecting them from theft and leaks.",
    "example": "// .env file (Added to .gitignore):\n// PORT=5000\n// DATABASE_URL=postgresql://user:secretpass@localhost:5432/mydb\n// STRIPE_API_KEY=sk_test_12345\n\n// server.js\nrequire('dotenv').config(); // Loads .env into process.env\n\nconst port = process.env.PORT || 3000;\nconst dbUrl = process.env.DATABASE_URL;\n\nif (!process.env.STRIPE_API_KEY) {\n  console.error('Missing required STRIPE_API_KEY environment variable!');\n  process.exit(1);\n}",
    "followUp": {
      "question": "What is a .env.example file and why is it helpful for teams?",
      "expectedAnswer": "A .env.example file is committed to Git and lists all required environment variable names with dummy placeholder values so team members know what configuration keys they need to set locally."
    }
  },
  "expectedConcepts": [
    "Operating system environment variables accessible via process.env",
    "Separating code from configuration (Twelve-Factor App methodology)",
    ".env files and the dotenv package",
    "Security risks of committing API keys, tokens, or database passwords to public repositories",
    ".gitignore file to exclude .env and credentials"
  ]
}
```
