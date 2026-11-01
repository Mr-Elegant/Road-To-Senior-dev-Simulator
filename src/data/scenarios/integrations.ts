import { Scenario } from '@/types/scenario';

export const integrationScenarios: Scenario[] = [
  {
    id: 'integ-webhook-idempotency-replay',
    title: 'Stripe Payment Webhook Replay & Duplicate Credit Crediting',
    type: 'debugging',
    topic: 'Integrations',
    subtopic: 'Payment webhooks',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A digital media platform charges users \$20 to buy 200 credits. Due to a temporary 4-second database latency spike, our webhook handler took 6 seconds to respond with 200 OK. Stripe considered the request timed out and retried the webhook 3 times over the next 10 minutes. Because the handler lacked idempotency checking, the user received 800 credits for a single \$20 purchase.',
    problemStatement:
      'Webhooks use "at-least-once" delivery semantics; retries, duplicate deliveries, and out-of-order deliveries are normal. Refactor the webhook receiver to use an atomic Idempotency Key record in PostgreSQL or Redis, verify cryptographic webhook signatures, and return immediate 200 OK for previously processed event IDs.',
    constraints: [
      'Must guarantee exactly-once business side effects (granting credits).',
      'Must verify Stripe HMAC-SHA256 signature against webhook secret.',
      'Must return 200 OK on duplicate deliveries without re-executing credit grants.',
    ],
    starterCode: `/**
 * Vulnerable Webhook Handler: No Idempotency or Signature Verification
 */
async function handleStripeWebhook(req, res, db) {
  const event = req.body;

  // BUG 1: No Stripe-Signature cryptographic header check! Anyone can spoof events.
  // BUG 2: No idempotency check on event.id! Retried webhooks double-credit the customer.
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const customerId = paymentIntent.customer;
    const creditsToGrant = paymentIntent.amount / 10;

    await db.query(
      'UPDATE users SET credit_balance = credit_balance + $1 WHERE stripe_customer_id = $2',
      [creditsToGrant, customerId]
    );
  }

  res.status(200).json({ received: true });
}

function solution(input) {
  return "idempotent_webhook_with_signature";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Verify the `stripe-signature` header using `stripe.webhooks.constructEvent(rawBody, sig, secret)`.',
      'Implement an `idempotency_keys` table or transactional `INSERT ... ON CONFLICT DO NOTHING` on `event.id`.',
      'Ensure duplicate retries immediately return `200 OK` without throwing or re-crediting balance.',
    ],
    hints: [
      'Store `event.id` in a dedicated `processed_events` table with a UNIQUE constraint.',
      'Wrap event insertion and credit update in a single database transaction. If the event ID already exists, commit/exit early with 200 OK.',
    ],
    testCases: [
      {
        id: 'tc-hook-1',
        name: 'Prevents duplicate processing of identical event IDs',
        inputDescription: 'null',
        expectedOutput: '"idempotent_webhook_with_signature"',
        explanation: 'Enforces idempotency and cryptographic signature validation.',
      },
    ],
    rubric: [
      {
        id: 'rb-webhook-idempotency',
        category: 'security',
        label: 'Signature Verification & Idempotency Key Tracking',
        description: 'Implements cryptographic signature validation and transactional idempotency check.',
        weight: 5,
        levels: [
          { score: 3, description: 'Validates raw body HMAC signature, uses atomic DB transaction on event ID, returns 200 for duplicates.' },
          { score: 2, description: 'Checks event ID in Redis or DB, but forgets HMAC signature verification.' },
          { score: 0, description: 'Leaves handler open to duplicate execution.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Payment providers like Stripe, Adyen, and PayPal operate on at-least-once delivery guarantees. If your server takes longer than their timeout (typically 3-5 seconds), or if a transient network packet drops, the webhook is retried repeatedly with exponential backoff for up to 3 days.
      
Two Requirements for Safe Webhook Receivers:
1. Signature Verification: Verify 'stripe-signature' using 'stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)'. This uses HMAC-SHA256 and timestamps to prevent webhook spoofing and replay attacks.
2. Idempotency Key Store: Insert 'event.id' into a 'processed_webhook_events' table. If the row already exists (duplicate delivery), immediately return 200 OK and abort further processing. Wrap the insertion and the credit ledger mutation in a single atomic database transaction.`,
      codeOrArtifact: `const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function handleStripeWebhookSafe(req, res, db) {
  const sig = req.headers['stripe-signature'];
  let event;

  // 1. Cryptographic HMAC Signature Verification
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  const client = await db.getClient();
  await client.query('BEGIN');

  try {
    // 2. Atomic Idempotency Check with row insertion
    const insertRes = await client.query(
      'INSERT INTO processed_events (event_id, event_type, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING event_id',
      [event.id, event.type]
    );

    // If row was NOT inserted, this event was already processed!
    if (insertRes.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log(\`Event \${event.id} already processed. Returning 200 OK.\`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // 3. Process business logic
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const credits = paymentIntent.amount / 10;
      await client.query(
        'UPDATE users SET credit_balance = credit_balance + $1 WHERE stripe_customer_id = $2',
        [credits, paymentIntent.customer]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ received: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  } finally {
    client.release();
  }
}`,
    },
    alternativeApproaches: [
      'Ingesting raw webhooks into an SQS / Kafka queue immediately and returning 200 OK, delegating idempotency and processing to background workers.',
    ],
    commonMistakes: [
      'Returning 500 when a duplicate webhook arrives: this causes Stripe to keep retrying the webhook indefinitely.',
      'Checking if the event exists in Redis with GET then SET (non-atomic race condition under simultaneous retries).',
    ],
    followUpQuestions: [
      {
        id: 'integ-fq-1',
        question: 'Why does Stripe require the raw unparsed HTTP request body for signature verification?',
        expectedConcepts: ['HMAC hash is sensitive to whitespace and JSON property ordering', 'Body parsers alter the raw byte sequence'],
        sampleStrongAnswer: 'The HMAC signature is calculated by Stripe over the exact byte stream sent across the wire. If Express or Next.js parses the body into a JSON object and then re-stringifies it, differences in whitespace, indentation, or key serialization will produce a different hash, causing signature verification to fail.',
      },
    ],
  },
  {
    id: 'integ-whatsapp-sms-fallback',
    title: 'Resilient Multi-Provider WhatsApp & SMS Fallback Orchestrator',
    type: 'coding',
    topic: 'Integrations',
    subtopic: 'WhatsApp and SMS delivery',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A global fintech sends high-security One-Time Passwords (OTPs) for 2FA login. During an outage of the primary SMS gateway (Twilio), users in Brazil and India were blocked from logging in for 45 minutes, leading to customer attrition.',
    problemStatement:
      'Build a resilient multi-provider notification orchestrator with Circuit Breaker and cascading fallback: Attempt WhatsApp via Meta Cloud API first (cheaper & faster); if delivery fails or times out (after 3s), fallback to Twilio SMS; if Twilio fails or its circuit breaker is OPEN, fallback to AWS SNS. Maintain delivery status telemetry.',
    constraints: [
      'Total end-to-end delivery timeout must not exceed 6 seconds.',
      'Circuit breaker must trip to OPEN if a provider experiences 5 consecutive failures.',
      'Providers in OPEN state must be bypassed automatically until cooldown period expires.',
    ],
    starterCode: `/**
 * Multi-Provider Resilient Notification Engine
 */
class NotificationOrchestrator {
  constructor(providers) {
    this.providers = providers; // [WhatsAppProvider, TwilioProvider, AwsSnsProvider]
  }

  async sendOtp(phoneNumber, code) {
    // TODO: Implement cascading fallback with circuit breaker
    return { status: "SENT", provider: "none" };
  }
}

function solution(input) {
  return "circuit_breaker_fallback_orchestrated";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Implement Circuit Breaker states (`CLOSED`, `OPEN`, `HALF-OPEN`) for each messaging provider.',
      'Attempt providers in priority order (WhatsApp -> Twilio -> AWS SNS).',
      'Implement per-provider timeouts using `AbortController` or `Promise.race()`.',
    ],
    hints: [
      'If provider circuit breaker is OPEN, skip it immediately without wasting time on network calls.',
      'Wrap each external API call in a 2500ms timeout so a hanging gateway does not block user login.',
    ],
    testCases: [
      {
        id: 'tc-otp-1',
        name: 'Falls back gracefully when primary gateway fails',
        inputDescription: 'null',
        expectedOutput: '"circuit_breaker_fallback_orchestrated"',
        explanation: 'Maintains OTP delivery through alternate provider channels.',
      },
    ],
    rubric: [
      {
        id: 'rb-circuit-breaker',
        category: 'reliability',
        label: 'Circuit Breaker & Fallback Architecture',
        description: 'Implements circuit breaker states and per-attempt timeouts.',
        weight: 5,
        levels: [
          { score: 3, description: 'Circuit breaker state machine, cascading fallback, timeout protection, telemetry logging.' },
          { score: 2, description: 'Implements try/catch fallback but missing circuit breaker or timeout.' },
          { score: 0, description: 'Single provider only.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In critical delivery systems like 2FA OTP, relying on a single third-party vendor creates a single point of failure (SPOF).
To achieve five-nines (99.999%) delivery reliability:
1. Multi-Provider Cascade: Try preferred provider (WhatsApp Meta API). If it fails, cascade to Secondary (Twilio SMS), then Tertiary (AWS SNS).
2. Per-Call Timeout: Wrap every external HTTP request in a strict 2-3 second timeout. Without this, a degraded provider that hangs for 30 seconds will cause the user's login session to time out.
3. Circuit Breaker: If a provider fails 5 times consecutively, trip the circuit to OPEN for 60 seconds. During this window, all requests skip the broken provider immediately without attempting network I/O.`,
      codeOrArtifact: `class ProviderCircuitBreaker {
  constructor(name, providerFn, failureThreshold = 5, resetTimeoutMs = 60000) {
    this.name = name;
    this.providerFn = providerFn;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error(\`Circuit breaker for \${this.name} is OPEN\`);
      }
    }

    try {
      const result = await Promise.race([
        this.providerFn(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(\`Timeout contacting \${this.name}\`)), 2500)
        ),
      ]);

      this.failureCount = 0;
      this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeoutMs;
      }
      throw err;
    }
  }
}`,
    },
    alternativeApproaches: [
      'Sending via message broker (RabbitMQ / SQS) with dead-letter exchange retry policies.',
    ],
    commonMistakes: [
      'Not putting a timeout on external provider calls: if Twilio takes 25 seconds to fail, user gives up and closes app.',
      'Tripping the circuit breaker on invalid phone numbers (400 Client Error) instead of 5xx Server Errors / Network Timeouts.',
    ],
    followUpQuestions: [
      {
        id: 'integ-fq-2',
        question: 'Why should 4xx HTTP responses NOT trip a provider circuit breaker?',
        expectedConcepts: ['4xx indicates client error (e.g. invalid phone number format)', '5xx/timeouts indicate provider infrastructure failure'],
        sampleStrongAnswer: 'A circuit breaker protects against provider infrastructure degradation (5xx errors, socket timeouts, TCP connection drops). A 4xx error (like 400 Bad Request or 422 Invalid Phone Number) is a client-side validation mistake. Tripping the circuit breaker on 4xx errors would cause a single user with an invalid phone number to shut down the provider for all other valid users.',
      },
    ],
  },
  {
    id: 'integ-crm-sync-out-of-order',
    title: 'Bi-Directional CRM Sync Out-of-Order Customer Data Rollback',
    type: 'debugging',
    topic: 'Integrations',
    subtopic: 'Out-of-order events',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'An enterprise SaaS platform syncs customer data bi-directionally with HubSpot and Salesforce. Sales reps noticed that customer email addresses and subscription tiers were mysteriously reverting to old values.',
    problemStatement:
      'Because webhooks travel over asynchronous public internet networks, network delays can cause Event #2 (User upgraded to Enterprise at 10:05) to arrive BEFORE Event #1 (User updated profile email at 10:01). The sync handler blind-updates the database whenever an event arrives, causing the older Event #1 to overwrite newer data from Event #2. Implement monotonic versioning or Lamport timestamps to reject out-of-order writes.',
    constraints: [
      'Must guarantee stale older events can never overwrite newer state.',
      'Must handle events arriving out-of-order or duplicate deliveries.',
      'Update database only if `event.version > record.version` or `event.timestamp > record.updated_at`.',
    ],
    starterCode: `/**
 * Fragile CRM Ingestion: Blind Overwrites
 */
async function syncCustomerFromCrm(db, crmEvent) {
  // crmEvent = { customerId: 'c-100', email: 'alice@acme.com', tier: 'PRO', eventTimestamp: 1672531200000 }
  
  // BUG: Blindly overwrites the database row with whatever payload arrives,
  // even if this event is 10 minutes older than the data already in the database!
  await db.query(
    'UPDATE customers SET email = $1, tier = $2 WHERE id = $3',
    [crmEvent.email, crmEvent.tier, crmEvent.customerId]
  );
}

function solution(input) {
  return "monotonic_version_guard_applied";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain why network delivery order cannot be assumed in distributed webhooks.',
      'Implement conditional SQL updates: `UPDATE customers SET ... WHERE id = $1 AND updated_at < $2`.',
      'Explain how Distributed Tracing and event versioning prevent split-brain updates.',
    ],
    hints: [
      'Add a condition to the UPDATE query: `WHERE id = $1 AND updated_at < $eventTimestamp`.',
      'If `rowCount === 0`, check if the row exists; if it exists with a higher timestamp, discard the event as a stale out-of-order event.',
    ],
    testCases: [
      {
        id: 'tc-crm-1',
        name: 'Rejects stale out-of-order updates',
        inputDescription: 'null',
        expectedOutput: '"monotonic_version_guard_applied"',
        explanation: 'Enforces strict monotonic state progression.',
      },
    ],
    rubric: [
      {
        id: 'rb-out-of-order',
        category: 'correctness',
        label: 'Out-of-Order Event Handling & Monotonic Guards',
        description: 'Implements conditional timestamp/version guard in SQL UPDATE.',
        weight: 5,
        levels: [
          { score: 3, description: 'Uses conditional WHERE updated_at < eventTimestamp, handles rowCount check, logs discard.' },
          { score: 2, description: 'Checks timestamp in JavaScript memory instead of SQL (vulnerable to race conditions).' },
          { score: 0, description: 'Blindly overwrites data.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In distributed systems, the internet is an asynchronous network. A packet sent at 10:00 can be delayed by network routing or provider retry queues and arrive at 10:15, after an event sent at 10:05 has already arrived and committed.
If an application executes blind SQL updates, an old snapshot will overwrite a newer snapshot, causing data regression.
      
Fix:
Use Monotonic Optimistic Guarding directly in the SQL statement:
'UPDATE customers SET email = $1, tier = $2, updated_at = $3 WHERE id = $4 AND updated_at < $3'
If a newer or equal timestamp already exists, the database updates 0 rows. The application detects 'rowCount === 0', recognizes this as a superseded out-of-order event, and discards it safely.`,
      codeOrArtifact: `async function syncCustomerFromCrmSafe(db, crmEvent) {
  const { customerId, email, tier, eventTimestamp } = crmEvent;
  const eventDate = new Date(eventTimestamp);

  const result = await db.query(
    \`UPDATE customers 
     SET email = $1, tier = $2, updated_at = $3 
     WHERE id = $4 AND updated_at < $3\`,
    [email, tier, eventDate, customerId]
  );

  if (result.rowCount === 0) {
    // Either customer does not exist, or record has already been updated with newer data
    const existing = await db.query('SELECT updated_at FROM customers WHERE id = $1', [customerId]);
    if (existing.rows.length > 0) {
      console.log(\`Stale event for customer \${customerId} ignored (Current: \${existing.rows[0].updated_at}, Event: \${eventDate})\`);
      return { status: 'IGNORED_STALE' };
    } else {
      // First-time insert
      await db.query(
        'INSERT INTO customers (id, email, tier, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [customerId, email, tier, eventDate]
      );
      return { status: 'INSERTED' };
    }
  }

  return { status: 'UPDATED' };
}`,
    },
    alternativeApproaches: [
      'Using an Event Sourcing model (Kafka / EventStore) with consumer partition ordering by CustomerId.',
      'Vector Clocks / Lamport Timestamps across multiple distributed writing systems.',
    ],
    commonMistakes: [
      'Doing `SELECT updated_at` in JavaScript, checking `if (eventTime > dbTime)`, and then executing `UPDATE`: this creates a race condition between concurrent webhook workers.',
      'Relying on server wall-clock arrival time instead of the event payload generation timestamp.',
    ],
    followUpQuestions: [
      {
        id: 'integ-fq-3',
        question: 'Why can Kafka guarantee event ordering within a partition, but not across multiple partitions?',
        expectedConcepts: ['Partition is an append-only commit log', 'Total order is only preserved within a single partition', 'Partition key ensures same entity routes to same partition'],
        sampleStrongAnswer: 'A Kafka partition is an immutable, append-only commit log consumed sequentially by a single consumer thread in a consumer group, guaranteeing strict FIFO order. Across different partitions, logs are consumed independently by different workers at different speeds, so ordering across partitions cannot be guaranteed. Using `customerId` as the partition key ensures all events for that specific customer land on the exact same partition.',
      },
    ],
  },
  {
    id: 'integ-exponential-backoff-jitter',
    title: 'Third-Party Shipping API Retry Storm & Thundering Herd Incident',
    type: 'debugging',
    topic: 'Integrations',
    subtopic: 'Retries and exponential backoff',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'During warehouse shipping label generation, FedEx API experienced a 2-minute rate limit hiccup (HTTP 429). When FedEx recovered, 5,000 backend retry workers fired simultaneous requests at the exact same second, immediately knocking FedEx back down with another 429 rate limit error in a perpetual thundering herd retry loop.',
    problemStatement:
      'The retry utility used fixed linear backoff (`setTimeout(retry, 2000)`). Every failing worker woke up at the exact same 2,000ms mark, creating synchronized spikes of traffic (Thundering Herd / Retry Storm). Implement Exponential Backoff with Full Jitter (Decorrelated Jitter) to randomize retry distributions.',
    constraints: [
      'Must implement Exponential Backoff formula: `min(maxWait, baseWait * 2^attempt)`.',
      'Must inject Full Jitter (random uniform distribution between 0 and calculated backoff).',
      'Must respect `Retry-After` HTTP header if provided by external API.',
    ],
    starterCode: `/**
 * Flawed Linear Retry: Causes Retry Storms
 */
async function fetchShippingLabelWithRetry(orderId, maxRetries = 5) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await shippingApi.createLabel(orderId);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;

      // BUG: Fixed linear delay without jitter causes all 5,000 workers
      // to hit the API at the exact same millisecond!
      const delayMs = 2000;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

function solution(input) {
  return "exponential_backoff_full_jitter_applied";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the mathematical cause of Thundering Herd in distributed retries.',
      'Implement Exponential Backoff with Full Jitter: `delay = Math.random() * Math.min(maxWait, baseWait * Math.pow(2, attempt))`.',
      'Read and prioritize the `Retry-After` header when HTTP 429 is encountered.',
    ],
    hints: [
      'AWS Architecture blog proves "Full Jitter" provides the lowest request collision rate and fastest recovery time.',
      'Formula: `const temp = Math.min(cap, base * 2 ** attempt); const sleep = Math.random() * temp;`.',
    ],
    testCases: [
      {
        id: 'tc-jitter-1',
        name: 'Scatters retries evenly using exponential backoff with full jitter',
        inputDescription: 'null',
        expectedOutput: '"exponential_backoff_full_jitter_applied"',
        explanation: 'Smoothes retry traffic and eliminates synchronized traffic spikes.',
      },
    ],
    rubric: [
      {
        id: 'rb-jitter',
        category: 'reliability',
        label: 'Exponential Backoff & Jitter Mathematics',
        description: 'Implements full jitter algorithm and respects Retry-After headers.',
        weight: 5,
        levels: [
          { score: 3, description: 'Implements full jitter formula, parses Retry-After header, sets max cap.' },
          { score: 2, description: 'Uses exponential backoff but forgets random jitter.' },
          { score: 0, description: 'Linear fixed retry.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `When hundreds or thousands of clients encounter an API outage or rate limit (HTTP 429 / 503), retrying after a fixed duration (e.g. 2s) causes all clients to hammer the destination API at the exact same millisecond. This creates a synchronized periodic wave of traffic known as a Retry Storm or Thundering Herd.
      
Fix: Exponential Backoff with Full Jitter (AWS Best Practice):
1. Base Backoff: Exponentially increase wait time with each attempt: base * (2 ^ attempt).
2. Cap: Bound the maximum wait time (e.g. max 30 seconds).
3. Full Jitter: Sleep for a uniform random duration between 0 and the exponential cap:
   'sleep = Math.random() * Math.min(cap, base * (2 ** attempt))'
This spreads the retries across a smooth continuous time interval, allowing the upstream service to recover gradually.
4. Retry-After Header: If the API returns a 'Retry-After: 30' header, always honor the upstream service's explicit request.`,
      codeOrArtifact: `async function fetchWithFullJitter(fetchFn, maxRetries = 5, baseMs = 500, capMs = 20000) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fetchFn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;

      // Check for upstream Retry-After header (seconds)
      const retryAfterHeader = err.response?.headers?.['retry-after'];
      let delayMs;

      if (retryAfterHeader) {
        const seconds = parseInt(retryAfterHeader, 10);
        delayMs = (!isNaN(seconds) ? seconds * 1000 : baseMs) + Math.random() * 500;
      } else {
        // Exponential Backoff with Full Jitter
        const exponentialMax = Math.min(capMs, baseMs * Math.pow(2, attempt));
        delayMs = Math.floor(Math.random() * exponentialMax);
      }

      console.warn(\`Attempt \${attempt} failed. Retrying in \${delayMs}ms...\`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}`,
    },
    alternativeApproaches: [
      'Decorrelated Jitter: `sleep = Math.min(cap, Math.random() * (sleep * 3 - base) + base)`.',
    ],
    commonMistakes: [
      'Equal Jitter: `delay = half + Math.random() * half` still maintains a synchronized lower bound.',
      'Retrying non-retryable 4xx client errors (e.g. 401 Unauthorized, 404 Not Found), wasting requests.',
    ],
    followUpQuestions: [
      {
        id: 'integ-fq-4',
        question: 'Which HTTP status codes should you retry, and which should you NEVER retry?',
        expectedConcepts: ['Retry: 429 (Rate Limit), 503 (Service Unavailable), 504 (Gateway Timeout), Network errors', 'Do NOT retry: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422'],
        sampleStrongAnswer: 'You should only retry transient errors: HTTP 429 (Too Many Requests), 502/503/504 (Gateway and Service Unavailable), and socket timeouts. You should never retry deterministic client errors: 400, 401, 403, 404, or 422, because repeating an invalid request with bad data will produce the exact same failure and waste server resources.',
      },
    ],
  },
];

