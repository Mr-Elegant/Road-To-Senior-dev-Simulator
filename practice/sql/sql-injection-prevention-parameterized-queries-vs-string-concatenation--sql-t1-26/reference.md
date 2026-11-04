# Reference: SQL Injection Prevention: Parameterized Queries vs String Concatenation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "String concatenation mixes untrusted user input directly with SQL command syntax. An attacker can submit: `' OR '1'='1' --`. The query becomes `SELECT * FROM users WHERE email = '' OR '1'='1' --';`, bypassing authentication and leaking all rows. Parameterized queries (e.g. `SELECT * FROM users WHERE email = $1;`) send the query structure and parameters in separate protocol messages. The database engine treats `$1` strictly as literal data, making it syntactically impossible for input to alter query execution structure.",
    "followUp": {
      "question": "Can ORMs like Prisma or TypeORM still be vulnerable to SQL injection?",
      "expectedAnswer": "Yes, if developers bypass the ORM's query builder and use raw unparameterized query methods like prisma.$queryRawUnsafe(`SELECT ... ${userInput}`)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains injection mechanism",
      "Demonstrates sample attack",
      "Explains parameterization solution"
    ]
  },
  "expectedConcepts": [
    "SQL Injection vulnerability through string concatenation",
    "Attack payload demonstration",
    "Separation of code and data in Prepared Statements ($1 / ?)"
  ]
}
```
