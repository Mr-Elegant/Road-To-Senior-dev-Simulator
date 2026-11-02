# Reference: Distributed Cron & Delayed Job Scheduler (At-Least-Once Delivery)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "System Architecture:\n1. Storage & Indexing of Scheduled Tasks:\n- Tasks stored in persistent database (PostgreSQL / DynamoDB) for audit and durability.\n- Near-term active schedule index stored in Redis Sorted Sets (ZSET):\n  - Key: 'scheduler:tasks' (sharded into 16 partitions by taskId: 'scheduler:tasks:{shard}')\n  - Score: Unix timestamp in milliseconds when the job is due.\n  - Value: JSON / taskId.\n\n2. Atomic Dispatcher Loop (Ticks every 500ms):\n- Scheduler nodes run a periodic loop.\n- To avoid double dispatch without complex leader election, each scheduler polls an assigned shard using an atomic Redis Lua script:\n  'local tasks = redis.call(\"ZRANGEBYSCORE\", KEYS[1], 0, ARGV[1], \"LIMIT\", 0, 100)\n   if #tasks > 0 then\n     redis.call(\"ZREMRANGEBYRANK\", KEYS[1], 0, #tasks - 1)\n   end\n   return tasks'\n- The retrieved due tasks are immediately pushed into the Worker Execution Queue (RabbitMQ / SQS / Kafka).\n\n3. Worker Fleet & Execution Leases:\n- Stateless worker instances pull tasks from the execution queue.\n- Worker acquires a temporary visibility lease (e.g. 60 seconds).\n- If the worker succeeds, it acks the message.\n- If the worker crashes or times out, the message becomes visible again in the queue for another worker to retry (At-Least-Once Delivery).\n\n4. Cron Recurrence:\n- For recurring cron expressions, when a task is dispatched, the scheduler calculates the NEXT execution timestamp using cron parser and re-inserts a new record with 'score = nextRunTimestamp'.",
    "codeOrArtifact": "Architecture Diagram:\n[Client API] ──► [Job Scheduler API] ──► Write DB & Redis ZSET (score: run_at)\n                                              ▲\n                                              │ (Atomic ZPOPMIN Poll)\n                                     [Distributed Schedulers]\n                                              │\n                                              ▼\n                                   [Worker Queue: SQS / RabbitMQ]\n                                              │\n                                              ▼\n                                    [Worker Fleet Pool]\n                                   (Executes task & Acks)"
  },
  "rubric": [
    {
      "id": "rb-scheduler-dispatch",
      "category": "reliability",
      "label": "Due-Task Retrieval & Concurrency Safety",
      "description": "Implements atomic task polling using Redis Sorted Sets or Time-Wheel with zero duplicate dispatch.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Atomically retrieves due tasks via ZPOPMIN/Lua, partitions key space, pushes to worker queues."
        },
        {
          "score": 2,
          "description": "Uses database SELECT WHERE run_at <= NOW() with polling (scales poorly for 10M rows)."
        },
        {
          "score": 0,
          "description": "Single node cron."
        }
      ]
    }
  ],
  "alternatives": [
    "Hierarchical Hashed Timing Wheels (Kafka / Netty approach) for sub-millisecond precision.",
    "Using managed services like AWS EventBridge Scheduler or Google Cloud Tasks."
  ],
  "commonMistakes": [
    "Polling a relational database table with `SELECT * FROM tasks WHERE run_at <= NOW()`: under millions of rows and frequent polling, this causes table lock contention and index thrashing.",
    "Failing to make worker tasks idempotent: in distributed systems, at-least-once delivery guarantees that occasional duplicate deliveries WILL happen."
  ],
  "followUps": [
    {
      "id": "sys-fq-4",
      "question": "What is a Hashed Timing Wheel and why is it more CPU-efficient than polling a sorted list for timers?",
      "expectedConcepts": [
        "O(1) insertion and expiration vs O(log N) for heap/sorted sets",
        "Circular array of buckets representing time ticks",
        "Used in Netty / Kafka internal timer management"
      ],
      "sampleStrongAnswer": "A Hashed Timing Wheel is a circular array of buckets where each slot represents a time interval (e.g. 100ms tick). Adding a timer and expiring due timers are both O(1) operations, compared to O(log N) for priority heaps or Redis sorted sets. The scheduler simply advances its pointer by one slot on each tick and executes all tasks in that bucket, drastically reducing CPU overhead when managing millions of active timers."
    }
  ]
}
```
