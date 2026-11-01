import { Scenario } from '@/types/scenario';

export const systemDesignScenarios: Scenario[] = [
  {
    id: 'sysdesign-scalable-notification-engine',
    title: 'Global Multi-Channel Notification Platform (50M Events/Day)',
    type: 'system_design',
    topic: 'System Design',
    subtopic: 'Notification services',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 45,
    businessContext:
      'A global social and banking super-app needs to send 50,000,000 notifications per day across Email (SendGrid), Mobile Push (APNs / FCM), SMS (Twilio), and In-App WebSockets. Users currently complain about duplicate notifications, critical fraud alerts being delayed behind promotional marketing blasts, and lack of quiet-hour preferences.',
    problemStatement:
      'Design an end-to-end multi-channel notification engine that handles high-throughput ingestion, enforces user notification preferences and quiet hours, deduplicates rapid events, prioritizes critical transactional alerts over marketing campaigns, and handles downstream provider rate limits and failures.',
    constraints: [
      'Throughput: 50M notifications/day (~600 sustained QPS, 5,000 peak QPS).',
      'P99 Latency: < 2 seconds for High-Priority transactional alerts (OTP, fraud, payments).',
      'At-least-once delivery with deduplication window (e.g. 15 minutes for repeated identical events).',
      'Channel rate limiting per user (e.g. max 3 promotional notifications/day).',
    ],
    systemDesignReqs: {
      scale: '50 Million notifications / day, 5k peak writes / sec, 100M active mobile devices.',
      functional: [
        'Send notifications via Push (APNs/FCM), Email, SMS, In-App.',
        'Support priority tiers: P0 (Emergency / OTP), P1 (Account updates), P2 (Social/Marketing).',
        'User preference center (opt-in/opt-out per channel, quiet hours per timezone).',
        'Deduplication and rate limiting per user/channel.',
      ],
      nonFunctional: [
        'High availability (99.99%).',
        'Fault-tolerant: provider outages must not lose messages.',
        'Scalable queue workers with backpressure.',
      ],
      assumptions: [
        'User devices and push tokens are registered in a Device Store.',
        'Downstream vendors (SendGrid, Twilio, APNs) have varying rate limits and occasional latency spikes.',
      ],
    },
    candidateTasks: [
      'Architect the system components: API Gateway, Ingestion Service, Message Broker (Kafka / RabbitMQ), Notification Worker Pools, Cache/State Store (Redis), Database (Postgres / DynamoDB).',
      'Define the API contract: `POST /v1/notifications/send` with payload schema.',
      'Explain the Priority Queue design: why separate queues (High / Normal / Low) are needed instead of a single FIFO queue.',
      'Detail the Deduplication strategy: using Redis key with TTL `dedup:{userId}:{hash(template,params)}`.',
      'Address failure recovery, dead-letter queues (DLQ), and retry exponential backoff.',
    ],
    hints: [
      'If marketing notifications and OTPs share the same Kafka topic/queue, a marketing blast of 10M emails will back up the queue, delaying 2FA OTP codes for hours.',
      'Store user preferences and device tokens in a low-latency cache (Redis) with write-through / cache-aside to database.',
    ],
    rubric: [
      {
        id: 'rb-arch-queues',
        category: 'tradeoffs',
        label: 'Priority Queueing & Ingestion Decoupling',
        description: 'Separates traffic into dedicated priority queues to protect transactional SLAs.',
        weight: 5,
        levels: [
          { score: 3, description: 'Dedicated priority queues (P0/P1/P2), worker auto-scaling, backpressure handling.' },
          { score: 2, description: 'Single queue with priority flags (causes head-of-line blocking).' },
          { score: 0, description: 'Synchronous API calls without message queue.' },
        ],
      },
      {
        id: 'rb-arch-dedup',
        category: 'reliability',
        label: 'Deduplication & Rate Limiting Strategy',
        description: 'Implements atomic Redis key checks and token bucket per user.',
        weight: 4,
        levels: [
          { score: 3, description: 'Redis SET NX EX deduplication, sliding window rate limits, quiet-hour timezone evaluation.' },
          { score: 2, description: 'Mentions rate limiting without concrete caching mechanism.' },
          { score: 0, description: 'No deduplication.' },
        ],
      },
      {
        id: 'rb-arch-security',
        category: 'security',
        label: 'Data Privacy & Token Management',
        description: 'Protects PII in notification templates, handles expired push tokens from APNs/FCM feedback.',
        weight: 4,
        levels: [
          { score: 3, description: 'Masks PII, strips credentials, handles APNs BadDeviceToken feedback loops to clean DB.' },
          { score: 1, description: 'Stores tokens without cleanup.' },
          { score: 0, description: 'No consideration for device token invalidation.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Architecture Blueprint:
1. Ingestion Layer:
- Clients & Microservices call 'POST /v1/notifications' via API Gateway (mTLS & API Key authentication).
- Ingestion Service validates payload, generates a unique idempotency/dedup hash, checks Redis for deduplication ('SET dedup:{userId}:{hash} 1 NX EX 900'). If key exists, return 200 OK with status "DEDUPLICATED".

2. Priority Queues (Kafka / SQS):
- NEVER use a single FIFO queue. Use separate topics:
  - Topic 'notifications.p0.transactional' (OTPs, Security Alerts, Payment Receipts)
  - Topic 'notifications.p1.account' (Password changed, shipping updates)
  - Topic 'notifications.p2.marketing' (Promotions, newsletter blasts)
- Dedicated worker pools scale independently. Even if P2 has 20M queued messages, P0 workers immediately consume transactional messages with < 100ms lag.

3. Preference & State Engine:
- Worker queries User Preference Cache (Redis) containing opt-ins, quiet hours (e.g. 22:00 - 08:00 user local time), and frequency caps.
- If in quiet hours and priority is P2: Delay delivery until morning using delayed message exchange. If P0: bypass quiet hours.

4. Channel Dispatchers:
- Push Dispatcher: APNs (HTTP/2 persistent connections) & FCM. Handles APNs feedback service to delete invalid device tokens from DB.
- Email Dispatcher: SendGrid / AWS SES with template rendering.
- SMS Dispatcher: Twilio / Infobip with fallback to AWS SNS.

5. Dead Letter Queue & Observability:
- Retries with exponential backoff and full jitter. If 3 retries fail, message routes to DLQ for engineer alert and inspection.`,
      codeOrArtifact: `API Specification:
POST /v1/notifications/send
Headers:
  Authorization: Bearer <token>
  Idempotency-Key: <uuid>
Payload:
{
  "recipientId": "user_987123",
  "priority": "P0", // P0 = Transactional, P1 = Important, P2 = Marketing
  "channels": ["PUSH", "SMS"],
  "templateId": "tmpl_otp_verification",
  "templateData": {
    "code": "482910",
    "expiresInMinutes": 5
  },
  "deduplicationWindowSeconds": 300
}

Response (202 Accepted):
{
  "notificationId": "notif_01HXYZ1234",
  "status": "QUEUED",
  "estimatedDeliveryMs": 450
}`,
    },
    alternativeApproaches: [
      'Using Temporal.io / AWS Step Functions for complex multi-step delivery workflows (e.g. "Send push; if unread after 10m, send SMS").',
    ],
    commonMistakes: [
      'Sending external emails/SMS synchronously inside the web request handler, locking client threads.',
      'Using a single queue: marketing blasts drown out password resets and payment confirmation emails.',
    ],
    followUpQuestions: [
      {
        id: 'sys-fq-1',
        question: 'How do you handle APNs (Apple Push Notification) invalid device token errors in production?',
        expectedConcepts: ['HTTP/2 410 Gone / BadDeviceToken response', 'Feedback service', 'Asynchronously prune or deactivate token in DB'],
        sampleStrongAnswer: 'APNs returns HTTP status `410 Gone` with reason `BadDeviceToken` or `Unregistered` when a user uninstalls the app. The Push Dispatcher must capture this error and publish a `device_token.deactivated` event so the user profile service removes or flags the token as inactive. Continuing to send to invalid tokens causes Apple to throttle or ban your push certificate.',
      },
    ],
  },
  {
    id: 'sysdesign-idempotent-checkout-service',
    title: 'High-Volume Idempotent Checkout & Order Processing System',
    type: 'system_design',
    topic: 'System Design',
    subtopic: 'Checkout systems',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 45,
    businessContext:
      'A global e-commerce marketplace handles \$100M/month in Gross Merchandise Value. During flash promotions, simultaneous checkouts cause race conditions in inventory reservation, duplicate credit card charges when users refresh payment screens, and inconsistent order states when payment gateways disconnect.',
    problemStatement:
      'Design a resilient checkout and payment orchestration platform. Ensure absolute idempotency across client retries, two-phase distributed inventory reservation, payment gateway integration with webhooks and reconciliation jobs, and eventual consistency using the Outbox Pattern.',
    constraints: [
      'Zero double-charges under any network failure or user retry.',
      'Zero overselling of limited inventory items.',
      'Sustain 2,500 checkouts/second at peak with P99 latency < 1.5 seconds.',
    ],
    systemDesignReqs: {
      scale: '2,500 checkouts/sec peak, \$100M GMV/month, 5M catalog items.',
      functional: [
        'Idempotent checkout initiation and payment authorization.',
        'Temporary inventory reservation (10-minute cart hold) with auto-release.',
        'Payment gateway integration (Stripe, PayPal) with asynchronous webhook confirmation.',
        'Order state machine: CREATED -> RESERVED -> CHARGING -> COMPLETED / CANCELLED.',
      ],
      nonFunctional: [
        'Strict consistency for payments and inventory.',
        'Fault-tolerant: Network partition must not result in phantom orders.',
        'Auditable transactional ledger.',
      ],
      assumptions: [
        'Payment gateways require an Idempotency-Key header.',
        'Cart holds expire if user abandons payment.',
      ],
    },
    candidateTasks: [
      'Design the State Machine transitions and database schema for Orders, Payments, and Inventory Holds.',
      'Explain the Transactional Outbox Pattern to guarantee orders and message queue events commit atomically.',
      'Design the Idempotency Layer using Redis distributed locks and unique database constraints.',
      'Explain the Reconciliation Cron Job to detect abandoned/in-flight payment discrepancies with Stripe.',
    ],
    hints: [
      'Combine distributed locking in Redis (for fast fast-path rejection) with a relational database UNIQUE constraint on `idempotency_key` (for ACID guarantee).',
      'Use the Transactional Outbox Pattern: write order state and message to an `outbox` table in the SAME database transaction, then rely on a CDC (Debezium) or polling worker to publish to Kafka.',
    ],
    rubric: [
      {
        id: 'rb-checkout-idempotency',
        category: 'correctness',
        label: 'End-to-End Idempotency & Concurrency Guards',
        description: 'Implements client idempotency tokens, database unique keys, and gateway idempotency forwarding.',
        weight: 5,
        levels: [
          { score: 3, description: 'Comprehensive idempotency from client header to DB unique constraint to Stripe Idempotency-Key.' },
          { score: 2, description: 'Uses Redis lock but misses database unique constraint fallback.' },
          { score: 0, description: 'No idempotency mechanism.' },
        ],
      },
      {
        id: 'rb-outbox-pattern',
        category: 'reliability',
        label: 'Transactional Outbox & Dual-Write Avoidance',
        description: 'Avoids dual-write problem between database and message broker using Outbox pattern.',
        weight: 5,
        levels: [
          { score: 3, description: 'Accurately articulates dual-write failure mode and uses Transactional Outbox / CDC.' },
          { score: 1, description: 'Suggests writing to DB and then calling kafka.send() in application code.' },
          { score: 0, description: 'Unaware of dual-write problem.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `System Architecture:
1. Client Idempotency:
- Frontend generates a UUIDv4 'Idempotency-Key' when loading checkout review page.
- Sent in HTTP header: 'Idempotency-Key: 7b8f9e...'.
- Checkout Service checks Redis for active lock: 'SET lock:checkout:{idempotencyKey} 1 NX PX 15000'. If locked, returns 409 Conflict / 202 In Progress.

2. Inventory Reservation (Two-Phase):
- Reserve items with a 10-minute TTL:
  'UPDATE inventory SET available = available - $qty, reserved = reserved + $qty WHERE product_id = $id AND available >= $qty'
- Store reservation record with 'expires_at = NOW() + INTERVAL '10 minutes''.
- A background worker scans expired reservations and returns stock to 'available' if payment never completes.

3. Payment Gateway Dispatch:
- Order status set to 'PAYMENT_PENDING'.
- Dispatch request to Stripe API forwarding the same 'Idempotency-Key'. Stripe guarantees that even if our network connection drops, retrying with the same key returns the existing Charge object without charging the card again.

4. Transactional Outbox Pattern:
- Avoid the Dual-Write Bug! (If you write to Postgres then call Kafka.send(), the app can crash in between, losing the event).
- In a single SQL transaction:
  1. INSERT into 'orders'
  2. INSERT into 'payments'
  3. INSERT into 'outbox_events' (topic, payload)
- A Debezium Change-Data-Capture (CDC) connector or reliable worker reads the outbox table and streams events to Kafka reliably.

5. Webhook & Reconciliation:
- Payment webhook updates payment status to 'CONFIRMED'.
- Nightly reconciliation cron queries Stripe API for all charges in the last 24h and compares against local database ledger to catch any orphaned states.`,
      codeOrArtifact: `Checkout State Machine:
[CART] 
  │ (User clicks "Place Order")
  ▼
[RESERVING_INVENTORY] ──(Out of Stock)──► [FAILED_OUT_OF_STOCK]
  │ (Stock Locked for 10m)
  ▼
[AUTHORIZING_PAYMENT] ──(Card Declined)─► [FAILED_PAYMENT] ──► Release Inventory
  │ (Stripe Charge Succeeded)
  ▼
[ORDER_CONFIRMED] ──► Transactional Outbox ──► Kafka: order.created
  │
  ▼
[FULFILLMENT_PROCESSING]`,
    },
    alternativeApproaches: [
      'Saga Pattern (Choreography or Orchestration using Temporal) for distributed compensation transactions across microservices.',
    ],
    commonMistakes: [
      'Deducting permanent inventory before confirming payment: carts that abandon payment leave shelves empty.',
      'Performing dual writes (DB update followed by message bus publish) without Outbox pattern, leading to data loss on network partition.',
    ],
    followUpQuestions: [
      {
        id: 'sys-fq-2',
        question: 'What is the Dual-Write problem in distributed systems and how does the Outbox Pattern solve it?',
        expectedConcepts: ['Writing to DB and Kafka cannot be atomic across network', 'App crash between writes causes desynchronization', 'Outbox pattern puts events in same DB transaction'],
        sampleStrongAnswer: 'The Dual-Write problem occurs when an application updates a database and publishes an event to a message broker (like Kafka) sequentially. Because these two systems do not share an atomic distributed transaction, if the application crashes after updating the database but before publishing to Kafka, the message is permanently lost. The Outbox pattern writes the event into an `outbox` table inside the exact same local database transaction, guaranteeing atomic consistency.',
      },
    ],
  },
  {
    id: 'sysdesign-multi-tenant-crm-analytics',
    title: 'Real-Time Multi-Tenant CRM Analytics & Aggregation Engine',
    type: 'system_design',
    topic: 'System Design',
    subtopic: 'Multi-tenant applications',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 45,
    businessContext:
      'A B2B SaaS platform provides live customer pipeline analytics to 10,000 corporate tenants (from small startups with 1,000 events to Fortune 500 enterprises with 50,000,000 events). Running analytical queries (e.g. "Conversion rate by lead source over last 90 days") directly on the operational PostgreSQL OLTP database is freezing transactional tables and causing multi-tenant noisy-neighbor outages.',
    problemStatement:
      'Architect a segregated OLAP analytics pipeline that ingests real-time events, isolates tenant data, powers interactive sub-second dashboard queries, and guarantees that a massive enterprise tenant running complex queries does not degrade performance for other tenants.',
    constraints: [
      'Sub-second query response time (P95 < 500ms) for arbitrary time-range aggregations.',
      'Data freshness / lag: events visible in analytics dashboard within 10 seconds of occurrence.',
      'Tenant noisy-neighbor isolation: strict resource limits per tenant tier.',
    ],
    systemDesignReqs: {
      scale: '10,000 tenants, 100M events ingested / day, 200 concurrent analytical dashboard queries / sec.',
      functional: [
        'Real-time ingestion of CRM events (leads created, emails sent, deals won).',
        'Interactive filtering by date range, sales rep, territory, and deal stage.',
        'Role-Based multi-tenant data isolation (tenant A cannot view tenant B data).',
      ],
      nonFunctional: [
        'Sub-second analytical queries.',
        'Zero impact on OLTP database performance.',
        'Cost-effective storage tiering (hot 90 days vs cold historical).',
      ],
      assumptions: [
        'OLTP uses PostgreSQL for relational transactional integrity.',
        'OLAP needs columnar storage (ClickHouse / StarRocks / Snowflake / BigQuery).',
      ],
    },
    candidateTasks: [
      'Design the Lambda / Kappa architecture data flow from PostgreSQL OLTP -> Kafka -> Stream Processor / Columnar OLAP (ClickHouse) -> Analytics API.',
      'Design the ClickHouse table schema with sorting key `(tenant_id, event_date, event_type)` for tenant isolation and index pruning.',
      'Explain how columnar storage compression and vectorized execution achieve 100x speedup over row-oriented databases.',
      'Implement tenant rate limiting and query concurrency quotas at the Analytics Gateway.',
    ],
    hints: [
      'Row-oriented databases (Postgres) read entire 50-column rows from disk even if you only aggregate 1 column.',
      'Columnar databases (ClickHouse) only read the specific columns requested, compressed with ZSTD/LZ4, scanning millions of rows per millisecond.',
    ],
    rubric: [
      {
        id: 'rb-olap-separation',
        category: 'tradeoffs',
        label: 'OLTP vs OLAP Separation & Columnar Storage',
        description: 'Decouples analytical workloads from operational database using columnar database.',
        weight: 5,
        levels: [
          { score: 3, description: 'Selects ClickHouse/StarRocks, designs partitioning/sorting keys by tenant_id, uses CDC ingestion.' },
          { score: 2, description: 'Uses Postgres read replicas (helps read scale, but still struggles with large aggregations).' },
          { score: 0, description: 'Queries production transactional database directly.' },
        ],
      },
      {
        id: 'rb-tenant-isolation',
        category: 'security',
        label: 'Multi-Tenant Isolation & Noisy Neighbor Defense',
        description: 'Implements tenant query queuing, CPU limits, and strict WHERE tenant_id scoping.',
        weight: 5,
        levels: [
          { score: 3, description: 'Enforces tenant_id partitioning, per-tenant query concurrency quotas, and row-level security.' },
          { score: 1, description: 'Mentions tenant_id in WHERE clause without resource quotas.' },
          { score: 0, description: 'No isolation architecture.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Architecture:
1. Operational vs Analytical Decoupling:
- Never run heavy OLAP aggregate queries on your primary OLTP transactional database.
- OLTP (PostgreSQL): Optimized for high-frequency point reads and ACID writes (row-oriented).
- OLAP (ClickHouse / Snowflake): Columnar storage, vectorized query execution, massive parallel processing (MPP).

2. Ingestion Pipeline (Near Real-Time):
- CDC (Change Data Capture) via Debezium monitors PostgreSQL WAL and publishes events to Apache Kafka.
- ClickHouse consumes directly from Kafka using the ClickHouse Kafka Engine or an ingestion microservice (Vector / Go consumer) with micro-batching (batches of 10,000 rows or 2 seconds).

3. ClickHouse Table Design:
- Engine: ReplicatedReplacingMergeTree / ReplicatedSummingMergeTree
- Partition by: 'toYYYYMM(event_date)'
- Order by (Primary Sort Key): '(tenant_id, event_type, event_date, id)'
Because 'tenant_id' is the primary prefix of the sparse index, ClickHouse prunes 99.99% of data blocks instantly when querying for a specific tenant.

4. Noisy-Neighbor Protection:
- Analytics API Gateway assigns tenants into tiers: Enterprise, Pro, Free.
- Query Concurrency Limits: Enterprise tenants get up to 20 concurrent queries; Free tenants get 2.
- Query Timeouts: Hard cap at 5 seconds; queries scanning more than 10M rows are aborted.`,
      codeOrArtifact: `/* ClickHouse Table DDL */
CREATE TABLE crm_analytics_events
(
    tenant_id UUID,
    event_id UUID,
    event_type LowCardinality(String),
    event_timestamp DateTime64(3, 'UTC'),
    event_date Date DEFAULT toDate(event_timestamp),
    lead_id UUID,
    deal_amount Decimal64(2),
    stage LowCardinality(String),
    source LowCardinality(String),
    rep_id UUID,
    custom_properties Map(String, String)
)
ENGINE = ReplicatedReplacingMergeTree('/clickhouse/tables/{shard}/crm_events', '{replica}')
PARTITION BY toYYYYMM(event_date)
PRIMARY KEY (tenant_id, event_type, event_date)
ORDER BY (tenant_id, event_type, event_date, event_id)
SETTINGS index_granularity = 8192;`,
    },
    alternativeApproaches: [
      'PostgreSQL with TimescaleDB / Citus extension for smaller scale (< 50M events).',
    ],
    commonMistakes: [
      'Creating separate database tables or schemas for each of the 10,000 tenants in ClickHouse (leads to metadata explosion and file descriptor exhaustion).',
      'Ingesting events row-by-row into ClickHouse: ClickHouse requires micro-batches (e.g. 5,000+ rows per insert) to prevent part-creation thrashing.',
    ],
    followUpQuestions: [
      {
        id: 'sys-fq-3',
        question: 'Why does ClickHouse require batched inserts instead of single-row inserts?',
        expectedConcepts: ['Each INSERT creates an immutable data part on disk', 'Too many parts triggers "Too many parts in all data parts in table" error', 'Micro-batching allows efficient LSM tree compaction'],
        sampleStrongAnswer: 'Every `INSERT` in ClickHouse writes an immutable directory (a "part") on disk. Background merge threads asynchronously combine smaller parts into larger parts. If you insert single rows 1,000 times a second, parts are created faster than background merges can consolidate them, crashing the server with the dreaded "Too many parts in table" error. Batches of 5,000–50,000 rows allow optimal compression and disk I/O.',
      },
    ],
  },
  {
    id: 'sysdesign-distributed-job-scheduler',
    title: 'Distributed Cron & Delayed Job Scheduler (At-Least-Once Delivery)',
    type: 'system_design',
    topic: 'System Design',
    subtopic: 'Background job processing',
    difficulty: 'Senior',
    estimatedMinutes: 40,
    businessContext:
      'A subscription and billing platform executes millions of scheduled tasks: daily recurring billing crons, delayed subscription trial expiry emails (execute 14 days after signup), and abandoned cart nudges (execute in 2 hours). The current single-server cron daemon is a single point of failure and misses jobs during restarts.',
    problemStatement:
      'Design a horizontally scalable, fault-tolerant distributed cron and delayed task scheduling service. The system must guarantee at-least-once task execution, support dynamic schedules (run at exact timestamp T), scale worker nodes horizontally, support graceful retries with dead-letter queues, and prevent duplicate concurrent task execution.',
    constraints: [
      'Scale: 10,000,000 scheduled tasks stored, 10,000 tasks dispatched per second.',
      'Precision: Jobs must trigger within +/- 1 second of their scheduled target timestamp.',
      'High Availability: Zero dropped jobs if any scheduler node crashes.',
    ],
    systemDesignReqs: {
      scale: '10M scheduled tasks, 10k triggers/sec peak, 50 worker instances.',
      functional: [
        'Schedule one-time delayed task (run at timestamp T).',
        'Schedule recurring cron task (e.g. `0 0 * * *`).',
        'Support job cancellation, status inspection, and execution history.',
        'Configurable retry policies with dead-letter queues.',
      ],
      nonFunctional: [
        'High availability with leader election or leaderless partitioned dispatch.',
        'At-least-once execution guarantee.',
        'Horizontal worker scaling.',
      ],
      assumptions: [
        'Jobs are defined with idempotency keys so workers can safely handle at-least-once delivery.',
      ],
    },
    candidateTasks: [
      'Design the architecture: Scheduler Fleet, Time-Wheel / Redis Sorted Set / DynamoDB Time-Partitioned Storage, Dispatch Queue (SQS / Kafka / RabbitMQ), Worker Fleet.',
      'Explain how Redis Sorted Set (`ZADD scheduled_time taskId`, `ZRANGEBYSCORE 0 now`) or Hashed Time-Wheels dispatch due tasks.',
      'Explain how distributed locking or partitioned ranges prevent multiple scheduler nodes from dispatching the same due task.',
      'Detail the worker execution lease and heartbeating mechanism.',
    ],
    hints: [
      'Use Redis Sorted Sets (ZSET) where score = scheduled Unix timestamp in milliseconds.',
      'Use Lua script or `ZPOPMIN` to atomically retrieve and remove due tasks so schedulers don\'t double-dispatch.',
    ],
    rubric: [
      {
        id: 'rb-scheduler-dispatch',
        category: 'reliability',
        label: 'Due-Task Retrieval & Concurrency Safety',
        description: 'Implements atomic task polling using Redis Sorted Sets or Time-Wheel with zero duplicate dispatch.',
        weight: 5,
        levels: [
          { score: 3, description: 'Atomically retrieves due tasks via ZPOPMIN/Lua, partitions key space, pushes to worker queues.' },
          { score: 2, description: 'Uses database SELECT WHERE run_at <= NOW() with polling (scales poorly for 10M rows).' },
          { score: 0, description: 'Single node cron.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `System Architecture:
1. Storage & Indexing of Scheduled Tasks:
- Tasks stored in persistent database (PostgreSQL / DynamoDB) for audit and durability.
- Near-term active schedule index stored in Redis Sorted Sets (ZSET):
  - Key: 'scheduler:tasks' (sharded into 16 partitions by taskId: 'scheduler:tasks:{shard}')
  - Score: Unix timestamp in milliseconds when the job is due.
  - Value: JSON / taskId.

2. Atomic Dispatcher Loop (Ticks every 500ms):
- Scheduler nodes run a periodic loop.
- To avoid double dispatch without complex leader election, each scheduler polls an assigned shard using an atomic Redis Lua script:
  'local tasks = redis.call("ZRANGEBYSCORE", KEYS[1], 0, ARGV[1], "LIMIT", 0, 100)
   if #tasks > 0 then
     redis.call("ZREMRANGEBYRANK", KEYS[1], 0, #tasks - 1)
   end
   return tasks'
- The retrieved due tasks are immediately pushed into the Worker Execution Queue (RabbitMQ / SQS / Kafka).

3. Worker Fleet & Execution Leases:
- Stateless worker instances pull tasks from the execution queue.
- Worker acquires a temporary visibility lease (e.g. 60 seconds).
- If the worker succeeds, it acks the message.
- If the worker crashes or times out, the message becomes visible again in the queue for another worker to retry (At-Least-Once Delivery).

4. Cron Recurrence:
- For recurring cron expressions, when a task is dispatched, the scheduler calculates the NEXT execution timestamp using cron parser and re-inserts a new record with 'score = nextRunTimestamp'.`,
      codeOrArtifact: `Architecture Diagram:
[Client API] ──► [Job Scheduler API] ──► Write DB & Redis ZSET (score: run_at)
                                              ▲
                                              │ (Atomic ZPOPMIN Poll)
                                     [Distributed Schedulers]
                                              │
                                              ▼
                                   [Worker Queue: SQS / RabbitMQ]
                                              │
                                              ▼
                                    [Worker Fleet Pool]
                                   (Executes task & Acks)`,
    },
    alternativeApproaches: [
      'Hierarchical Hashed Timing Wheels (Kafka / Netty approach) for sub-millisecond precision.',
      'Using managed services like AWS EventBridge Scheduler or Google Cloud Tasks.',
    ],
    commonMistakes: [
      'Polling a relational database table with `SELECT * FROM tasks WHERE run_at <= NOW()`: under millions of rows and frequent polling, this causes table lock contention and index thrashing.',
      'Failing to make worker tasks idempotent: in distributed systems, at-least-once delivery guarantees that occasional duplicate deliveries WILL happen.',
    ],
    followUpQuestions: [
      {
        id: 'sys-fq-4',
        question: 'What is a Hashed Timing Wheel and why is it more CPU-efficient than polling a sorted list for timers?',
        expectedConcepts: ['O(1) insertion and expiration vs O(log N) for heap/sorted sets', 'Circular array of buckets representing time ticks', 'Used in Netty / Kafka internal timer management'],
        sampleStrongAnswer: 'A Hashed Timing Wheel is a circular array of buckets where each slot represents a time interval (e.g. 100ms tick). Adding a timer and expiring due timers are both O(1) operations, compared to O(log N) for priority heaps or Redis sorted sets. The scheduler simply advances its pointer by one slot on each tick and executes all tasks in that bucket, drastically reducing CPU overhead when managing millions of active timers.',
      },
    ],
  },
];

