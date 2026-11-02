# Reference: Bi-Directional CRM Sync Out-of-Order Customer Data Rollback

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In distributed systems, the internet is an asynchronous network. A packet sent at 10:00 can be delayed by network routing or provider retry queues and arrive at 10:15, after an event sent at 10:05 has already arrived and committed.\nIf an application executes blind SQL updates, an old snapshot will overwrite a newer snapshot, causing data regression.\n      \nFix:\nUse Monotonic Optimistic Guarding directly in the SQL statement:\n'UPDATE customers SET email = $1, tier = $2, updated_at = $3 WHERE id = $4 AND updated_at < $3'\nIf a newer or equal timestamp already exists, the database updates 0 rows. The application detects 'rowCount === 0', recognizes this as a superseded out-of-order event, and discards it safely.",
    "codeOrArtifact": "async function syncCustomerFromCrmSafe(db, crmEvent) {\n  const { customerId, email, tier, eventTimestamp } = crmEvent;\n  const eventDate = new Date(eventTimestamp);\n\n  const result = await db.query(\n    `UPDATE customers \n     SET email = $1, tier = $2, updated_at = $3 \n     WHERE id = $4 AND updated_at < $3`,\n    [email, tier, eventDate, customerId]\n  );\n\n  if (result.rowCount === 0) {\n    // Either customer does not exist, or record has already been updated with newer data\n    const existing = await db.query('SELECT updated_at FROM customers WHERE id = $1', [customerId]);\n    if (existing.rows.length > 0) {\n      console.log(`Stale event for customer ${customerId} ignored (Current: ${existing.rows[0].updated_at}, Event: ${eventDate})`);\n      return { status: 'IGNORED_STALE' };\n    } else {\n      // First-time insert\n      await db.query(\n        'INSERT INTO customers (id, email, tier, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',\n        [customerId, email, tier, eventDate]\n      );\n      return { status: 'INSERTED' };\n    }\n  }\n\n  return { status: 'UPDATED' };\n}"
  },
  "rubric": [
    {
      "id": "rb-out-of-order",
      "category": "correctness",
      "label": "Out-of-Order Event Handling & Monotonic Guards",
      "description": "Implements conditional timestamp/version guard in SQL UPDATE.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Uses conditional WHERE updated_at < eventTimestamp, handles rowCount check, logs discard."
        },
        {
          "score": 2,
          "description": "Checks timestamp in JavaScript memory instead of SQL (vulnerable to race conditions)."
        },
        {
          "score": 0,
          "description": "Blindly overwrites data."
        }
      ]
    }
  ],
  "alternatives": [
    "Using an Event Sourcing model (Kafka / EventStore) with consumer partition ordering by CustomerId.",
    "Vector Clocks / Lamport Timestamps across multiple distributed writing systems."
  ],
  "commonMistakes": [
    "Doing `SELECT updated_at` in JavaScript, checking `if (eventTime > dbTime)`, and then executing `UPDATE`: this creates a race condition between concurrent webhook workers.",
    "Relying on server wall-clock arrival time instead of the event payload generation timestamp."
  ],
  "followUps": [
    {
      "id": "integ-fq-3",
      "question": "Why can Kafka guarantee event ordering within a partition, but not across multiple partitions?",
      "expectedConcepts": [
        "Partition is an append-only commit log",
        "Total order is only preserved within a single partition",
        "Partition key ensures same entity routes to same partition"
      ],
      "sampleStrongAnswer": "A Kafka partition is an immutable, append-only commit log consumed sequentially by a single consumer thread in a consumer group, guaranteeing strict FIFO order. Across different partitions, logs are consumed independently by different workers at different speeds, so ordering across partitions cannot be guaranteed. Using `customerId` as the partition key ensures all events for that specific customer land on the exact same partition."
    }
  ]
}
```
