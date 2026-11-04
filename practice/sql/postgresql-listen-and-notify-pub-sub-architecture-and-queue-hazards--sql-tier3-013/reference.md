# Reference: PostgreSQL LISTEN and NOTIFY: Pub/Sub Architecture and Queue Hazards

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Internal Architecture:**\n- PostgreSQL implements `LISTEN / NOTIFY` via an in-memory ring buffer (default 8GB or 8MB depending on version, managed in shared memory) and the `pg_notify` SLRU (Simple Least Recently Used) cache.\n- When a backend runs `NOTIFY channel, payload;`, the notification is buffered in backend private memory until the transaction **commits**. If the transaction rolls back, nothing is sent.\n- At commit, the message is written into the global notification queue and a signal is sent to listening client backends.\n\n**2. Constraints and Limitations:**\n- **Payload Limit**: Exactly 8000 bytes per notification string.\n- **Queue Overflow**: If listening clients disconnect, stall, or read too slowly, unconsumed notifications accumulate in the queue. If the queue reaches 50% capacity, Postgres logs warnings. If it fills 100%, PostgreSQL **aborts all transactions that attempt to send NOTIFY** with an error: `queue is full`.\n- **Ephemeral Delivery**: Notifications are not persisted to tables. A subscriber that is disconnected while a message is sent will never receive it.\n\n**3. Best Practice vs External Brokers:**\n- *Use LISTEN/NOTIFY*: Low-throughput cache invalidation signals, UI notifications, or triggering an asynchronous worker when a table changes.\n- *Use Kafka / RabbitMQ*: High-throughput event streams, durable message persistence, guaranteed at-least-once delivery, horizontal consumer group scaling.",
    "followUp": {
      "question": "How can an application combine PostgreSQL tables with LISTEN/NOTIFY to achieve durable, at-least-once message processing without losing notifications?",
      "expectedAnswer": "The Transactional Outbox pattern: write the event payload into an `outbox` table in the exact same ACID transaction as the business entity update, then issue an empty `NOTIFY outbox_channel;` signal. Workers wake up on NOTIFY and query the `outbox` table for unprocessed rows. If workers are offline or the queue drops notifications, workers poll the outbox table on startup, guaranteeing zero message loss."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Explains commit-bound transactional delivery semantics",
      "Identifies 8000-byte limit and SLRU queue architecture",
      "Details queue overflow failure mode (aborts committing transactions)",
      "Synthesizes Transactional Outbox pattern to overcome ephemeral limitation"
    ]
  },
  "expectedConcepts": [
    "Transactional guarantees (NOTIFY is sent only upon commit)",
    "8000 byte payload ceiling",
    "Shared memory SLRU queue and queue overflow aborting transactions",
    "Ephemeral nature (no message durability for offline listeners)",
    "Appropriate use cases vs external message queues"
  ]
}
```
