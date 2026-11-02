# Reference: Flash Sale Cart Reservation PostgreSQL Transaction Deadlock

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A deadlock occurs when two or more transactions hold locks that each other need, creating a circular wait graph:\nTransaction 1 holds exclusive lock on Product 101 and waits for Product 205.\nTransaction 2 holds exclusive lock on Product 205 and waits for Product 101.\nPostgreSQL deadlock detector wakes up (after deadlock_timeout, default 1s) and aborts one transaction with error 40P01.\n      \nFix:\nBreak the Circular Wait condition. If every transaction in the entire application locks rows in the exact same global deterministic order (e.g. sorted by product_id ASC), Transaction 2 will wait for Transaction 1 to finish with Product 101 before even attempting to touch Product 205. A cycle can never form.",
    "codeOrArtifact": "async function reserveInventoryDeterministic(client, itemsToReserve) {\n  // Sort items deterministically by product_id ascending\n  const sortedItems = [...itemsToReserve].sort((a, b) => a.productId - b.productId);\n\n  await client.query('BEGIN');\n  try {\n    for (const item of sortedItems) {\n      const res = await client.query(\n        'SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE',\n        [item.productId]\n      );\n\n      if (!res.rows[0] || res.rows[0].stock < item.qty) {\n        throw new Error(`Insufficient stock for product ${item.productId}`);\n      }\n\n      await client.query(\n        'UPDATE inventory SET stock = stock - $1 WHERE product_id = $2',\n        [item.qty, item.productId]\n      );\n    }\n\n    await client.query('COMMIT');\n  } catch (err) {\n    await client.query('ROLLBACK');\n    throw err;\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-deadlock-ordering",
      "category": "root_cause",
      "label": "Deadlock Formation & Coffman Conditions",
      "description": "Explains circular wait condition and deterministic lock ordering solution.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Details circular wait condition, sorts IDs before locking, explains SELECT FOR UPDATE semantics."
        },
        {
          "score": 2,
          "description": "Sorts array but misses single-query lock optimization."
        },
        {
          "score": 0,
          "description": "Suggests retry logic as only solution without eliminating deadlock root cause."
        }
      ]
    }
  ],
  "alternatives": [
    "Single SQL statement batch update: UPDATE inventory SET stock = stock - updates.qty FROM ...",
    "Using Redis distributed locks with Redlock algorithm ordered by key."
  ],
  "commonMistakes": [
    "Relying solely on retry logic: retries without ordering can cause repeated lock thrashing under high concurrency.",
    "Using `SELECT ... FOR SHARE` which permits read sharing but escalates to exclusive write locks, actually increasing deadlocks."
  ],
  "followUps": [
    {
      "id": "db-fq-1",
      "question": "What is the purpose of `SELECT ... FOR UPDATE SKIP LOCKED` and where is it used?",
      "expectedConcepts": [
        "Job queues / worker polling",
        "Skips locked rows instead of waiting",
        "Prevents worker lock contention"
      ],
      "sampleStrongAnswer": "`SKIP LOCKED` instructs the database to ignore rows that are currently locked by other concurrent transactions and return only available, unlocked rows. It is the gold standard for building high-concurrency database-backed job queues (like Celery, Graphile Worker, or BullMQ on Postgres) because workers never block each other."
    }
  ]
}
```
