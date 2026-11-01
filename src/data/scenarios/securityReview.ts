import { Scenario } from '@/types/scenario';

export const securityReviewScenarios: Scenario[] = [
  {
    id: 'review-pr-payment-split',
    title: 'Code Review PR #412: Marketplace Payout Split & Transfer Engine',
    type: 'code_review',
    topic: 'Security',
    subtopic: 'Code review',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A software engineer submitted Pull Request #412: "Implement vendor payout splitting for marketplace orders". If merged as-is, this code will cause cumulative financial discrepancies due to floating-point rounding, security bypasses permitting unauthorized vendor payouts, and unhandled promise rejections.',
    problemStatement:
      'Conduct a thorough Senior/Staff-level code review of PR #412. Identify critical issues spanning Correctness (floating point math), Security (missing IDOR authorization check on vendor recipient), Reliability (unhandled promise in async map), and Maintainability (magic numbers and lack of audit logging).',
    constraints: [
      'Identify at least 4 distinct architectural and code-level defects.',
      'Provide specific line-by-line feedback with suggested remediation.',
      'Classify findings by severity: Critical, High, Medium, Low.',
    ],
    codeReviewFiles: [
      {
        filename: 'src/services/payoutService.js',
        language: 'javascript',
        reviewPointsCount: 4,
        newCode: `const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * PR #412: Calculate vendor commission and trigger bank transfer
 */
async function processVendorPayouts(orderId, requestedByUserId) {
  const order = await db.getOrder(orderId);

  // BUG 1 (Security - IDOR / Authorization Bypass):
  // Checks that requestedByUserId exists, but DOES NOT verify that requestedByUserId
  // is actually an authorized admin or the vendor who owns this order!
  if (!requestedByUserId) {
    throw new Error('Unauthorized');
  }

  // BUG 2 (Correctness - Floating Point Rounding):
  // Performing currency calculations using IEEE 754 floating point arithmetic!
  // 0.1 + 0.2 !== 0.3. Over thousands of transactions, fractions of cents accumulate.
  const platformFeeRate = 0.15; // 15% commission
  const platformFee = order.amount * platformFeeRate; 
  const vendorPayout = order.amount - platformFee;

  // BUG 3 (Reliability - Array.map with unawaited async promises):
  // order.vendorSplits.map(async ...) returns an array of pending promises
  // that are never awaited with Promise.all! Errors reject silently.
  order.vendorSplits.map(async (split) => {
    const payoutAmount = split.percentage * vendorPayout;
    
    // Transfer funds to vendor Connected Account
    await stripe.transfers.create({
      amount: payoutAmount, // BUG: Stripe expects integer cents, not floating dollar amount!
      currency: 'usd',
      destination: split.vendorStripeAccountId,
    });
  });

  return { success: true, orderId };
}

module.exports = { processVendorPayouts };`,
      },
    ],
    candidateTasks: [
      'Identify Line 12-14: Insecure Direct Object Reference (IDOR) - missing permission check ensuring caller has admin or owner rights.',
      'Identify Line 18-20: IEEE 754 Floating point inaccuracy; money should always be represented as integer cents or using an arbitrary-precision Decimal library (e.g. `decimal.js` or `BigInt`).',
      'Identify Line 27: Stripe API expects integer cents (`Math.round(payoutAmountInCents)`), not floating dollars.',
      'Identify Line 25-33: `order.vendorSplits.map(async ...)` spawns unawaited promises that swallow errors and fail silently.',
    ],
    hints: [
      'Money calculations in JavaScript must NEVER use standard `Number` floats (`order.amount * 0.15`). Store and calculate in integer cents (e.g. 1500 cents for \$15.00).',
      'What happens if `stripe.transfers.create` throws an error inside the `order.vendorSplits.map` callback? It becomes an UnhandledPromiseRejection.',
    ],
    rubric: [
      {
        id: 'rb-cr-security',
        category: 'security',
        label: 'IDOR & Authorization Vulnerability Detection',
        description: 'Identifies missing tenant/vendor ownership check on requestedByUserId.',
        weight: 5,
        levels: [
          { score: 3, description: 'Catches IDOR authorization flaw and prescribes RBAC check (isUserVendorAdmin).' },
          { score: 1, description: 'Mentions authentication but not authorization.' },
          { score: 0, description: 'Misses security flaw.' },
        ],
      },
      {
        id: 'rb-cr-math',
        category: 'correctness',
        label: 'Financial Accuracy & Currency Integer Representation',
        description: 'Flags IEEE 754 float precision loss and Stripe integer cents requirement.',
        weight: 5,
        levels: [
          { score: 3, description: 'Identifies float math error, demands integer cents / Decimal.js, notes Stripe expects integer cents.' },
          { score: 2, description: 'Flags rounding but unaware of Stripe integer cent API contract.' },
          { score: 0, description: 'Misses financial calculation error.' },
        ],
      },
      {
        id: 'rb-cr-async',
        category: 'reliability',
        label: 'Async Promise Array Execution Flaw',
        description: 'Catches unawaited async map and recommends Promise.all / for-of.',
        weight: 4,
        levels: [
          { score: 3, description: 'Highlights unawaited promises in map, mandates Promise.all or serial for-of with error containment.' },
          { score: 0, description: 'Misses async map bug.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Code Review Findings Summary:
1. [CRITICAL SECURITY] Insecure Direct Object Reference (IDOR) / Missing Authorization Check (Lines 12-14)
The function checks 'if (!requestedByUserId)', which only verifies that a string was passed. It never checks if 'requestedByUserId' is an authorized billing administrator or the merchant owning this order. Any authenticated user can call this endpoint with any orderId and trigger unauthorized payouts.
Fix: Query user permissions: 'if (!user.roles.includes("BILLING_ADMIN") && order.merchantId !== user.id) throw new ForbiddenError()'.

2. [CRITICAL CORRECTNESS] Floating Point Arithmetic in Financial Calculations (Lines 18-20)
JavaScript numbers are 64-bit IEEE 754 floats. Multiplying floats (e.g. 19.99 * 0.15) produces rounding errors like 2.9984999999999996. Over millions of transactions, these fractional errors result in regulatory ledger mismatches.
Fix: Represent all monetary values in integer cents (e.g. 1999 cents) and use integer math or a high-precision library like 'dinero.js' or 'decimal.js'.

3. [CRITICAL RELIABILITY] Stripe API Expects Integer Cents (Line 28)
Stripe's 'stripe.transfers.create({ amount })' expects an integer in the currency's smallest unit (e.g. 500 for \$5.00 USD). Passing a floating dollar number like '15.5' either causes Stripe to reject the API call with 400 Invalid Integer or truncates it to 15 cents (\$0.15 payout instead of \$15.00).

4. [HIGH RELIABILITY] Unawaited Async Function in Array.prototype.map (Lines 25-33)
'order.vendorSplits.map(async ...)' returns an array of pending promises that are discarded. The function returns '{ success: true }' immediately before transfers even contact Stripe. If any transfer fails, it triggers an UnhandledPromiseRejection and the caller never knows.
Fix: Use 'await Promise.all(order.vendorSplits.map(...))' or a sequential 'for (const split of order.vendorSplits)' loop.`,
      codeOrArtifact: `/**
 * Corrected Production-Ready Payout Service
 */
async function processVendorPayoutsRemediated(orderId, requestedByUser) {
  // 1. Authorization Guard
  const order = await db.getOrder(orderId);
  if (!order) throw new NotFoundError('Order not found');

  const isAuthorized = requestedByUser.roles.includes('ADMIN') || order.merchantId === requestedByUser.id;
  if (!isAuthorized) throw new ForbiddenError('Unauthorized to trigger payouts for this order');

  // 2. Integer Cent Math (Amount in cents: $100.00 = 10000)
  const orderAmountCents = order.amountInCents; 
  const platformFeeBps = 1500; // 15.00% in Basis Points (1 bps = 0.01%)
  const platformFeeCents = Math.round((orderAmountCents * platformFeeBps) / 10000);
  const vendorPayoutCents = orderAmountCents - platformFeeCents;

  // 3. Serialized or Promise.all execution with error containment
  const results = [];
  for (const split of order.vendorSplits) {
    const splitAmountCents = Math.round((vendorPayoutCents * split.bps) / 10000);
    
    // Idempotency key per vendor transfer
    const transfer = await stripe.transfers.create({
      amount: splitAmountCents,
      currency: 'usd',
      destination: split.vendorStripeAccountId,
    }, {
      idempotencyKey: \`payout:\${order.id}:\${split.vendorId}\`,
    });

    results.push(transfer);
  }

  return { success: true, orderId, transfers: results };
}`,
    },
    alternativeApproaches: [
      'Using Stripe Split Charges / Destination Charges natively on checkout creation to avoid custom payout logic entirely.',
    ],
    commonMistakes: [
      'Only focusing on formatting or variable naming while missing the severe financial math and security flaws.',
      'Suggesting Math.floor or Math.round without converting dollars to cents first.',
    ],
    followUpQuestions: [
      {
        id: 'sec-fq-1',
        question: 'What are Basis Points (bps) and why are they standard for financial commission calculations?',
        expectedConcepts: ['1 basis point = 0.01% = 0.0001', 'Avoids floating point percentages', 'Standard in financial trading and banking systems'],
        sampleStrongAnswer: 'A basis point (bps) is one hundredth of one percent (0.01% or 0.0001). Using integer basis points (e.g. 1500 bps for 15%) allows financial calculations to remain purely in integer math (`(amountInCents * bps) / 10000`), completely avoiding floating-point percentage math like `0.15` and eliminating rounding ambiguities across accounting systems.',
      },
    ],
  },
  {
    id: 'review-pr-session-revocation',
    title: 'Code Review PR #589: Distributed Redis Session Invalidation',
    type: 'code_review',
    topic: 'Security',
    subtopic: 'Authentication and authorization',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'PR #589 replaces in-memory JWT blacklisting with a shared Redis cluster session store to allow immediate user logout and password-reset session revocation. However, subtle race conditions and missing key TTLs expose the cluster to memory exhaustion and security bypasses.',
    problemStatement:
      'Review PR #589. Detect vulnerabilities including missing TTL expiration (causing unbounded Redis RAM growth), token reuse race conditions, and improper pattern scanning with `KEYS *` (which blocks the single-threaded Redis engine in production).',
    constraints: [
      'Identify performance impact of `KEYS session:*` on production Redis clusters.',
      'Identify race condition where revoked tokens can be re-issued.',
      'Verify session key TTL alignment with JWT expiry timestamp.',
    ],
    codeReviewFiles: [
      {
        filename: 'src/auth/sessionStore.js',
        language: 'javascript',
        reviewPointsCount: 3,
        newCode: `const redis = require('../redis');

class SessionStore {
  // PR #589: Store active session tokens in Redis
  async createSession(userId, token, claims) {
    // BUG 1 (Memory Leak): No TTL (EXPIRE) set on session keys!
    // Every user login creates a permanent key that lives in RAM forever.
    await redis.set(\`session:\${userId}:\${token}\`, JSON.stringify(claims));
    return true;
  }

  async revokeAllUserSessions(userId) {
    // BUG 2 (Production Outage): Using KEYS command in production!
    // KEYS is O(N) where N is total keys in database. It runs synchronously,
    // freezing the single-threaded Redis event loop for seconds on a 5M key DB!
    const keys = await redis.keys(\`session:\${userId}:*\`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return keys.length;
  }

  async isSessionValid(userId, token) {
    const exists = await redis.get(\`session:\${userId}:\${token}\`);
    return Boolean(exists);
  }
}

module.exports = new SessionStore();`,
      },
    ],
    candidateTasks: [
      'Flag Line 8: Missing TTL on `redis.set`. Require `EX` parameter matching token expiration to prevent Redis OOM.',
      'Flag Line 16: `redis.keys()` blocks the Redis single thread. Replace with Redis Set indexing (`SADD user:sessions:{userId} token`) or `SCAN`.',
      'Explain how indexing user sessions in a Set makes revocation O(1) instead of an expensive pattern search.',
    ],
    hints: [
      'Redis is single-threaded; commands like `KEYS *` scan the entire dictionary synchronously and lock out all other commands.',
      'To revoke all sessions for a user efficiently, store all active session IDs in a Redis Set keyed by `user_sessions:{userId}`.',
    ],
    rubric: [
      {
        id: 'rb-cr-redis-keys',
        category: 'reliability',
        label: 'Redis Blocking Command Detection',
        description: 'Identifies production hazard of KEYS command and prescribes SCAN or Set indexing.',
        weight: 5,
        levels: [
          { score: 3, description: 'Calls out KEYS freezing Redis single-thread, proposes Set-based session index or SCAN.' },
          { score: 1, description: 'Notes performance but doesn\'t explain single-threaded Redis blocking.' },
          { score: 0, description: 'Approves KEYS command.' },
        ],
      },
      {
        id: 'rb-cr-ttl',
        category: 'reliability',
        label: 'TTL & Memory Bound Enforcement',
        description: 'Requires EXPIRE / SET EX to prevent unbounded memory growth.',
        weight: 4,
        levels: [
          { score: 3, description: 'Requires EX matching JWT exp claim, calculates memory savings.' },
          { score: 1, description: 'Mentions TTL without tying to token expiry.' },
          { score: 0, description: 'Misses missing TTL.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Code Review Findings:
1. [FATAL OPERATIONAL HAZARD] Synchronous 'redis.keys()' Command Freezes Production Redis (Line 16)
Redis executes commands on a single thread. The 'KEYS' command inspects every single key in the entire Redis keyspace in O(N) time. In a production database with millions of keys, 'redis.keys()' will freeze Redis for 3 to 10 seconds. During this freeze, all other health checks, cache lookups, and session validations fail, crashing the entire web platform.
Fix: Never use 'KEYS' in production. Instead, maintain an explicit index using a Redis Set: 'user_sessions:{userId}'.

2. [CRITICAL MEMORY LEAK] Missing TTL on Session Keys (Line 8)
'redis.set(\`session:\${userId}:\${token}\`, ...)' creates a key with no expiration (TTL = -1). Over months of user logins, millions of expired tokens remain in Redis RAM permanently until Redis reaches 'maxmemory' and starts evicting or crashing.
Fix: Pass 'EX' (seconds) or 'PX' matching the JWT token's lifespan (e.g. 7 days = 604800 seconds).

3. [CLEAN ARCHITECTURAL FIX] Index Sessions in a Redis Set:
When creating a session:
'MULTI'
'SET session:{token} {claims} EX 604800'
'SADD user_sessions:{userId} {token}'
'EXPIRE user_sessions:{userId} 604800'
'EXEC'
When revoking all user sessions:
Retrieve all tokens with 'SMEMBERS user_sessions:{userId}' in O(1) and delete them.`,
      codeOrArtifact: `class RobustSessionStore {
  async createSession(userId, token, claims, ttlSeconds = 604800) {
    const pipeline = redis.pipeline();
    pipeline.set(\`session:\${token}\`, JSON.stringify(claims), 'EX', ttlSeconds);
    pipeline.sadd(\`user_sessions:\${userId}\`, token);
    pipeline.expire(\`user_sessions:\${userId}\`, ttlSeconds);
    await pipeline.exec();
    return true;
  }

  async revokeAllUserSessions(userId) {
    const setKey = \`user_sessions:\${userId}\`;
    const tokens = await redis.smembers(setKey);
    if (tokens.length === 0) return 0;

    const pipeline = redis.pipeline();
    tokens.forEach((token) => pipeline.del(\`session:\${token}\`));
    pipeline.del(setKey);
    await pipeline.exec();

    return tokens.length;
  }

  async isSessionValid(token) {
    return Boolean(await redis.exists(\`session:\${token}\`));
  }
}`,
    },
    alternativeApproaches: [
      'Using a monotonic `user_token_version` column in the database/Redis: when a user logs out or resets password, increment `version = version + 1`. All tokens with older versions are immediately invalid without deleting individual keys.',
    ],
    commonMistakes: [
      'Suggesting `SCAN` without noting that `SCAN` is still a loop; Set-based indexing is O(1) and far superior for user-scoped lookup.',
    ],
    followUpQuestions: [
      {
        id: 'sec-fq-2',
        question: 'How does the "Token Version / Epoch" pattern invalidate all active user sessions with a single O(1) integer update?',
        expectedConcepts: ['Embed token_version in JWT claims', 'Store current user version in Redis/DB', 'Incrementing version invalidates all older tokens instantly'],
        sampleStrongAnswer: 'In the Token Version pattern, every user has an integer `token_version` (e.g. 1) stored in their database/Redis profile and embedded inside their JWT payload. When authenticating, the API checks `jwt.token_version === user.token_version`. When a user clicks "Logout from all devices" or changes their password, you simply increment `user.token_version = token_version + 1`. All previously issued JWTs immediately fail validation in a single O(1) write without tracking millions of individual session keys.',
      },
    ],
  },
  {
    id: 'interview-staff-architect-modernization',
    title: 'Staff Architect Interview: Legacy Monolith Modernization to Event-Driven Architecture',
    type: 'senior_interview',
    topic: 'System Design',
    subtopic: 'Scalable APIs',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 45,
    businessContext:
      'A multi-billion dollar retail and subscription enterprise runs on a 12-year-old monolithic Ruby on Rails / PostgreSQL codebase. The database is hitting hardware scaling limits (96-core server at 85% CPU during normal days). Deploying any code change takes 45 minutes and occasionally introduces regression bugs across unrelated domains.',
    problemStatement:
      'Lead an architectural discussion to decompose the monolith into domain-driven modular microservices (Identity, Catalog, Checkout, Inventory, Fulfillment). You must address data migration without downtime (Strangler Fig pattern), shared database decomposition, distributed transaction management, and team organizational alignment (Conway\'s Law).',
    constraints: [
      'Zero downtime and zero lost customer orders during multi-year migration.',
      'Must avoid "Distributed Monolith" anti-patterns.',
      'Provide clear technical trade-offs between Choreography vs Orchestration for order fulfillment.',
    ],
    candidateTasks: [
      'Question 1: How do you identify which bounded context / domain to carve out first from the monolith?',
      'Question 2: Explain how the Strangler Fig Pattern and API Gateway reverse proxies route traffic progressively.',
      'Question 3: How do you decouple the shared PostgreSQL database without breaking transactional integrity?',
      'Question 4: Compare Saga Orchestration (e.g. Temporal) vs Saga Choreography (Kafka events) for the checkout workflow.',
      'Question 5: How do you apply Conway\'s Law and Domain-Driven Design (DDD) to restructure engineering teams?',
    ],
    hints: [
      'Never extract the most complex and coupled core (Checkout) first. Start with a self-contained, high-value domain like Notifications or Inventory.',
      'Use the Strangler Fig pattern: place an API Gateway in front of the monolith and intercept specific route paths to new services.',
    ],
    rubric: [
      {
        id: 'rb-interview-strangler',
        category: 'tradeoffs',
        label: 'Strangler Fig Pattern & Progressive Migration',
        description: 'Details progressive extraction via API gateway routing, dual-reads, and CDC.',
        weight: 5,
        levels: [
          { score: 3, description: 'Mastery of Strangler Fig, API Gateway facade, CDC data sync, and incremental risk mitigation.' },
          { score: 1, description: 'Suggests big-bang total rewrite (classic anti-pattern).' },
          { score: 0, description: 'Vague migration steps.' },
        ],
      },
      {
        id: 'rb-interview-sagas',
        category: 'reliability',
        label: 'Distributed Sagas & Data Consistency',
        description: 'Compares Orchestration vs Choreography, compensation transactions, and idempotency.',
        weight: 5,
        levels: [
          { score: 3, description: 'Deep technical analysis of Choreography vs Orchestration, compensation transactions, and observability.' },
          { score: 2, description: 'Understands Sagas but unaware of orchestration trade-offs.' },
          { score: 0, description: 'Assumes two-phase commit (2PC) works across microservices.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Senior/Staff Architect Structured Response:
1. Extraction Sequence & Bounded Contexts:
- Avoid the "Big Bang Rewrite" trap (which has an 80%+ failure rate in enterprise software).
- Apply Domain-Driven Design (DDD) to map Bounded Contexts.
- First extract edge, read-heavy, or loosely coupled domains (e.g. Notification Service or Product Catalog). This validates CI/CD pipelines, observability, and networking before tackling core financial transactions.
- Extract high-contention bottlenecks next (e.g. Inventory Reservation).

2. Strangler Fig Pattern:
- Place an API Gateway (Envoy / Kong / Cloudflare) in front of the legacy monolith.
- Initially, 100% of traffic routes to the monolith.
- As the new Inventory Service is built, route '/api/v1/inventory/*' to the new service while routing the rest to the monolith.
- Run shadow traffic (dark launching / dual writing) to verify parity and latency before cutting over reads.

3. Database Decomposition:
- The #1 anti-pattern is creating microservices that all talk to the same shared database (a "Distributed Monolith").
- Each microservice must own its private data store (Database-per-Service pattern).
- Use Change Data Capture (Debezium + Kafka) to stream data from the legacy DB to the new service\'s database during the transition period.

4. Saga Pattern: Orchestration vs Choreography
- For complex multi-step workflows like Checkout -> Reserve Inventory -> Charge Card -> Generate Shipping Label:
  - Choreography (Event-Driven): Services listen to Kafka events and emit next events. Good for simple flows (2-3 steps), but becomes an un-debuggable "spaghetti graph" with cyclical failure loops when flows grow complex.
  - Orchestration (Workflow Engine like Temporal / AWS Step Functions): A centralized workflow orchestrator explicitly coordinates step execution, handles retries, and executes compensating transactions if a step fails. Highly recommended for enterprise financial workflows.`,
      codeOrArtifact: `Architecture Transformation:
Phase 1: Facade
[Client] ──► [API Gateway] ──(100% traffic)──► [Legacy Monolith] ──► [Shared DB]

Phase 2: Strangler Extraction
[Client] ──► [API Gateway] ──(90% traffic)───► [Legacy Monolith]
                    │
                    └───(/inventory/*)──────► [Inventory Service] ──► [Inventory DB]
                                                    ▲
                                                    │ (CDC Sync: Debezium)
                                            [Shared Monolith DB]`,
    },
    alternativeApproaches: [
      'Modular Monolith architecture first: refactoring code into strict in-process modules before splitting into physical network services.',
    ],
    commonMistakes: [
      'Recommending a complete ground-up rewrite from scratch: business features stall for 2 years and the rewrite frequently fails.',
      'Allowing new microservices to directly query tables in the monolith database.',
    ],
    followUpQuestions: [
      {
        id: 'staff-fq-1',
        question: 'Why is a Modular Monolith often a superior intermediate step before microservices?',
        expectedConcepts: ['Enforces domain boundaries without network latency or distributed transaction complexity', 'Allows fast refactoring before committing to network serialization'],
        sampleStrongAnswer: 'A Modular Monolith enforces strict domain boundaries, module encapsulation, and clean API interfaces within a single deployable unit. It eliminates the operational overhead of distributed microservices (network latency, distributed tracing, partial failures, Sagas) while providing the architectural clarity needed to cleanly spin out services later if independent scaling or deployment velocity demands it.',
      },
    ],
  },
  {
    id: 'interview-lead-incident-postmortem',
    title: 'Lead Engineer Interview: 45-Minute Outage Facilitation & Blameless Post-Mortem',
    type: 'senior_interview',
    topic: 'Engineering Operations',
    subtopic: 'Production incident response',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 40,
    businessContext:
      'A junior developer merged a migration that dropped an active database index during peak business hours. The database locked up, web servers exhausted connection pools, and the platform suffered a total 45-minute outage costing \$350,000 in lost revenue. Company leadership is furious and demanding someone be held accountable.',
    problemStatement:
      'As the Engineering Lead / Staff Architect, step into the leadership role. Facilitate the post-mortem, steer leadership away from punitive blame toward systemic root cause analysis, conduct the 5 Whys investigation, and design automated preventative guardrails (CI/CD linting, zero-downtime migration linters, read-only replica failover) so this class of failure is structurally impossible in the future.',
    constraints: [
      'Maintain an uncompromisingly blameless culture focused on systemic safeguards.',
      'Conduct a thorough 5 Whys root cause analysis.',
      'Define actionable, prioritized Action Items (Prevent, Detect, Mitigate).',
    ],
    candidateTasks: [
      'Question 1: How do you respond to executive leadership demanding to know "which developer made the mistake"?',
      'Question 2: Walk through the "5 Whys" methodology for this incident.',
      'Question 3: Distinguish between the Proximate Cause vs Systemic Root Cause.',
      'Question 4: Present the Action Item Matrix categorized into: Preventative Guardrails, Detection/Observability, and Mitigation.',
      'Question 5: How do you foster psychological safety in an engineering organization after a major production failure?',
    ],
    hints: [
      'Blameless culture principle: You cannot "fire" your way to reliability. If a system allows a single developer to bring down production with a single command, the system is defective, not the human.',
      'Action items should include tools like `strong_migrations` or `pg-eyeballs` in CI to reject locking migrations automatically.',
    ],
    rubric: [
      {
        id: 'rb-postmortem-blameless',
        category: 'tradeoffs',
        label: 'Blameless Culture & Executive Leadership',
        description: 'Defends systemic safety over individual blame; re-frames incident to systemic resilience.',
        weight: 5,
        levels: [
          { score: 3, description: 'Articulates blameless post-mortem tenets, models psychological safety, educates executive stakeholders.' },
          { score: 1, description: 'Suggests requiring manager sign-off for all PRs (bureaucratic anti-pattern).' },
          { score: 0, description: 'Assigns blame to junior engineer.' },
        ],
      },
      {
        id: 'rb-postmortem-action-items',
        category: 'reliability',
        label: 'Action Item Quality & Defense-in-Depth',
        description: 'Implements automated CI linter guards, timeout safeguards, and runbooks.',
        weight: 5,
        levels: [
          { score: 3, description: 'Categorizes Action Items: Automated CI migration checks, lock_timeout guards, automated runbooks.' },
          { score: 2, description: 'Action items only suggest "write more tests" or "be more careful".' },
          { score: 0, description: 'No concrete technical guardrails.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Engineering Leadership Playbook:
1. Handling Punitive Leadership & Blameless Post-Mortem:
- State clearly to leadership: "If our architecture and deployment pipelines permit a single engineer to take down production with a standard pull request, our engineering safety systems have failed. Blaming or punishing the individual will only incentivize engineers to hide mistakes and slow innovation to a crawl. Our goal is to make this failure structurally impossible for anyone to repeat."

2. The 5 Whys Analysis:
- Why did the site go down? Because the database connection pool was exhausted and queries timed out.
- Why were queries timing out? Because an ALTER TABLE migration held an AccessExclusiveLock on the 'users' table.
- Why did it hold an exclusive lock? Because dropping the index was executed synchronously without lock timeouts.
- Why was it deployed during peak hours without lock timeouts? Because developers do not have automated guardrails checking migration safety in CI.
- Why were there no automated checks in CI? Because the team has treated migration review as a manual discipline rather than automated engineering policy.

3. Action Items Matrix:
- PREVENT (Engineering Guardrails):
  - Integrate 'strong_migrations' or 'sqlfluff' in CI: automatically fails PR if a migration drops indexes without CONCURRENTLY or adds columns with blocking defaults.
  - Set global database 'lock_timeout = 2s' in migration connections so migrations abort harmlessly rather than queueing behind long transactions.
- DETECT (Observability):
  - Add Prometheus alert on 'pg_stat_activity' for queries waiting on lock acquisition > 10 seconds.
- MITIGATE (Resilience):
  - Isolate web traffic from migrations: enforce migrations execute via automated pre-deployment jobs before traffic switch.`,
      codeOrArtifact: `Post-Mortem Executive Summary:
Incident Date: 2026-10-31
Duration: 45 minutes
Impact: $350k estimated revenue delay, 12,000 active sessions dropped.

Root Cause: 
An unthrottled index drop acquired an AccessExclusiveLock on the users table. Incoming web queries queued behind the lock, quickly exhausting the 200-connection pool and rendering API gateways unable to service traffic.

Preventative Fix:
1. Implemented lock_timeout = 2000ms on all migration runners.
2. Added automated CI linter blocking dangerous schema operations.
3. Created automated kill-switch runbook to terminate blocking lock queries within 30 seconds.`,
    },
    alternativeApproaches: [
      'Using blue/green database deployments with logical replication.',
    ],
    commonMistakes: [
      'Creating manual approval committees or adding 5 more people to review PRs (creates bureaucratic drag without fixing systemic issues).',
      'Failing to establish a hard lock_timeout in PostgreSQL.',
    ],
    followUpQuestions: [
      {
        id: 'lead-fq-1',
        question: 'Why is `lock_timeout` the single most critical configuration parameter when running PostgreSQL migrations in production?',
        expectedConcepts: ['Queued locks block all subsequent reads/writes behind them', 'Default lock_timeout is 0 (infinite)', 'Short lock_timeout aborts migration harmlessly'],
        sampleStrongAnswer: 'In PostgreSQL, when an ALTER TABLE requests an `AccessExclusiveLock`, it waits in the lock queue until existing active queries finish. However, once in the queue, it blocks all subsequent reads and writes behind it! If `lock_timeout` is 0 (the default, infinite), a single slow query will cause the migration to wait forever, backing up all incoming web requests and taking down production in seconds. Setting `SET lock_timeout = "2s"` ensures the migration aborts safely if it cannot acquire the lock immediately.',
      },
    ],
  },
];

