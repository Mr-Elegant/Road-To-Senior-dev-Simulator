# Reference: Financial Ledger Wallet Balance Anomaly & Isolation Levels

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Under READ COMMITTED (PostgreSQL's default), each query in a transaction sees a snapshot of data committed before that specific query began. If two transactions both read balance = $100, both pass the 'balance >= $80' check, and both insert a -$80 debit, the final balance is -$60 (overdraft).\n      \nBecause 'SELECT SUM(amount) FROM ledger_entries' is an aggregate query, there is no single row to lock with 'FOR UPDATE' unless you lock the entire table (terrible for concurrency).\n      \nTwo Production Solutions:\n1. Pessimistic Parent Row Lock (Recommended for Ledgers): Maintain an 'accounts' table row. Lock that row: 'SELECT id FROM accounts WHERE id = $1 FOR UPDATE'. This serializes all debits and credits for that specific account while allowing other accounts to process in parallel.\n2. Serializable Isolation Level: Set 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE'. PostgreSQL will use SSI (Serializable Snapshot Isolation) to track predicate read/write dependencies. If two transactions conflict, one commits and the second is aborted with SQLSTATE 40001 ('could not serialize access'). The application must implement a retry loop with exponential backoff.",
    "codeOrArtifact": "async function processWithdrawalSafe(client, accountId, amount) {\n  await client.query('BEGIN');\n  try {\n    // 1. Acquire exclusive pessimistic lock on the account record\n    const accountCheck = await client.query(\n      'SELECT id, balance FROM accounts WHERE id = $1 FOR UPDATE',\n      [accountId]\n    );\n\n    if (accountCheck.rows.length === 0) {\n      throw new Error('Account not found');\n    }\n\n    const currentBalance = parseFloat(accountCheck.rows[0].balance);\n    if (currentBalance < amount) {\n      throw new Error('Insufficient balance');\n    }\n\n    // 2. Insert immutable ledger entry\n    await client.query(\n      'INSERT INTO ledger_entries (account_id, amount, created_at) VALUES ($1, $2, NOW())',\n      [accountId, -amount]\n    );\n\n    // 3. Update cached balance on parent account row\n    await client.query(\n      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',\n      [amount, accountId]\n    );\n\n    await client.query('COMMIT');\n  } catch (err) {\n    await client.query('ROLLBACK');\n    throw err;\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-isolation-levels",
      "category": "reliability",
      "label": "ACID Isolation Levels & Write Skew Analysis",
      "description": "Analyzes Read Committed, Repeatable Read, and Serializable guarantees.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Compares parent row locking (SELECT FOR UPDATE) vs SSI Serializable with 40001 retries."
        },
        {
          "score": 2,
          "description": "Fixes with parent row lock but unaware of Serializable isolation nuances."
        },
        {
          "score": 0,
          "description": "Fails to understand concurrency race condition."
        }
      ]
    }
  ],
  "alternatives": [
    "Database CHECK constraint: `CONSTRAINT balance_non_negative CHECK (balance >= 0)`.",
    "Optimistic concurrency with version column `UPDATE accounts SET balance = balance - $1, version = version + 1 WHERE id = $2 AND version = $3`."
  ],
  "commonMistakes": [
    "Assuming REPEATABLE READ prevents write skew: in Postgres, Repeatable Read prevents non-repeatable reads and phantom reads on existing rows, but still allows write skew anomalies.",
    "Not adding an application retry loop when choosing SERIALIZABLE."
  ],
  "followUps": [
    {
      "id": "db-fq-3",
      "question": "What is Write Skew and why does Repeatable Read not protect against it in PostgreSQL?",
      "expectedConcepts": [
        "Disjoint writes satisfying same constraint",
        "Each transaction reads what the other will write",
        "Requires Serializable or row lock"
      ],
      "sampleStrongAnswer": "Write Skew occurs when two concurrent transactions read overlapping data sets but write to disjoint rows, where the combined result violates an integrity constraint (classic medical on-call doctor example). In Repeatable Read, both transactions see their consistent snapshot and write without conflicting with existing row locks, allowing the constraint violation to commit."
    }
  ]
}
```
