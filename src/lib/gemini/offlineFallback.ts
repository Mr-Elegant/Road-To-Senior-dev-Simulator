import {
  AiInterviewConfig,
  TurnFeedback,
  AiInterviewAssessment,
} from '@/types/aiInterview';

export function getOfflineQuestion(config: AiInterviewConfig): string {
  const role = config.role.toLowerCase();
  const tech = config.technology.toLowerCase();

  if (tech.includes('next') || tech.includes('react')) {
    return `### Scenario: Real-Time Financial Dashboard & SSR Cache Stampede

You are architecting a mission-critical financial trading dashboard in **Next.js (App Router)** and **React 19**.
The platform serves 50,000 active institutional traders viewing live market indices and order books.

**Business Context & Technical Problem:**
During peak market open (9:30 AM EST), thousands of concurrent users request the main dashboard simultaneously. The page performs both Server-Side Rendering (SSR) for initial SEO/metadata and establishes Server-Sent Events (SSE) for sub-second quote updates.
Under peak load, you observe:
1. A **Cache Stampede (dog-piling effect)** on your Next.js data-fetching layer (\`fetch\` cache revalidation), causing upstream microservices to brown out.
2. High client-side re-render latency (>300ms) freezing the UI thread when streaming 500 price updates per second into large order-book tables.

**Constraints:**
- Must maintain strictly zero private customer data leaks across shared SSR cache layers.
- Order-book table must render smoothly at 60fps on typical client devices without dropping price ticks.
- Gracefully handle network disconnection with automatic backoff and reconnection without duplicate subscriptions.

**Your Tasks:**
1. How do you structure the component tree between **Server Components** and **Client Components** to isolate dynamic live feeds from static cached layouts?
2. What caching strategy (e.g. stale-while-revalidate, distributed mutex locks, or single-flight request coalescing) would you implement to prevent cache stampedes?
3. How would you optimize the React client-side rendering pipeline to ingest 500 ticks/second without UI stutter?`;
  }

  if (tech.includes('node') || tech.includes('distributed') || tech.includes('database') || tech.includes('sql')) {
    return `### Scenario: Zero-Data-Loss Distributed Outbox & Idempotent Payment Processing

You are the Staff Engineer leading the backend payment integration team at an e-commerce platform processing \$20M daily in high-velocity transactions.

**Business Context & Technical Problem:**
During high-traffic flash sales, multiple third-party payment gateways (Stripe, Adyen) occasionally time out or retry webhooks out-of-order. 
A recent production outage revealed:
1. Customers were double-charged when network timeouts occurred between your payment service and the gateway, triggering blind retries without idempotency locks.
2. Orders were marked as paid in the PostgreSQL database, but inventory reservation events failed to publish to Kafka due to network partitioning, leading to oversold inventory.

**Constraints:**
- Must guarantee **Strict Idempotency** and **Zero Double Charges** under any network failure or retry loop.
- Database writes (Order record) and event publication (Kafka inventory update) must have atomic transactional consistency (no dual-write anomalies).
- Peak volume: 2,500 payment attempts/second with database CPU bounded under 65%.

**Your Tasks:**
1. Walk through your implementation of the **Transactional Outbox Pattern** with PostgreSQL and Kafka (e.g., Debezium CDC vs polling publisher). What are the specific trade-offs?
2. How do you design the idempotency key lifecycle, database schema, and distributed lock mechanism (Redis vs Postgres \`SELECT FOR UPDATE\`) to handle concurrent webhook delivery?
3. In the event of an Adyen outage lasting 15 minutes, how does your system safely queue, throttle, and replay in-flight payment reconciliation jobs?`;
  }

  return `### Scenario: High-Throughput Notification Engine & Distributed Rate Limiter

You are designing a distributed notification and alert delivery service designed to handle **50 million alerts/day** across SMS, Email, and Push Notifications for a global logistics network.

**Business Context & Technical Problem:**
A carrier partner sends massive batches of driver updates every morning at 8:00 AM.
Downstream SMS providers have strict rate limits (e.g., max 100 SMS/sec per provider account). Exceeding these limits results in immediate 429 errors and costly compliance penalties. Furthermore, urgent "Delivery Attempted" alerts must preempt low-priority promotional emails.

**Constraints:**
- Strict multi-tenant rate limiting per country and per channel provider.
- Priority queueing: High-priority operational alerts must be delivered within 3 seconds, even during a 10M message backlog of bulk marketing alerts.
- High availability: 99.99% uptime with multi-region failover.

**Your Tasks:**
1. What distributed rate-limiting algorithm would you implement (e.g. Token Bucket, Leaky Bucket, Sliding Window Log vs Sliding Window Counter), and how would you store rate-limit counters reliably across a cluster of application nodes?
2. How would you architect the queueing tier (Kafka, SQS, RabbitMQ, or Redis Sorted Sets) to handle strict priority scheduling without starvation of low-priority traffic?
3. How do you ensure idempotent delivery so customers never receive duplicate SMS messages when workers crash mid-delivery?`;
}

export function getOfflineEvaluation(
  currentQuestion: string,
  candidateAnswer: string,
  turnNumber: number,
  maxTurns: number
): { turnFeedback: TurnFeedback; nextQuestion: string } {
  const answerLower = candidateAnswer.toLowerCase();
  const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;

  let correctness: TurnFeedback['technicalCorrectness'] = 'Competent';
  let score = 7;
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (wordCount < 40) {
    correctness = 'Partially Flawed';
    score = 5;
    gaps.push('Response is too brief; lacks concrete architectural specifics, failure modes, and trade-off justification.');
    strengths.push('Identified the core concept but did not expand into production edge cases.');
  } else {
    if (answerLower.includes('outbox') || answerLower.includes('idempot') || answerLower.includes('cdc') || answerLower.includes('debezium')) {
      strengths.push('Strong grasp of distributed data consistency (Transactional Outbox / Idempotency patterns).');
      score += 1;
    }
    if (answerLower.includes('cache') || answerLower.includes('redis') || answerLower.includes('virtual') || answerLower.includes('debounce') || answerLower.includes('lock')) {
      strengths.push('Thoughtful consideration of caching layers, concurrency safeguards, and performance bottlenecks.');
      score += 1;
    }
    if (answerLower.includes('fail') || answerLower.includes('retry') || answerLower.includes('backoff') || answerLower.includes('circuit')) {
      strengths.push('Proactively considered resiliency (circuit breakers, exponential backoff, dead-letter queues).');
      score += 1;
    }

    if (strengths.length === 0) {
      strengths.push('Articulated an initial baseline design.');
    }

    if (!answerLower.includes('trade') && !answerLower.includes('cost') && !answerLower.includes('latency')) {
      gaps.push('Did not deeply articulate architectural trade-offs or operational resource costs.');
    }
    if (!answerLower.includes('monitor') && !answerLower.includes('metric') && !answerLower.includes('alert')) {
      gaps.push('Lacked observability considerations (distributed tracing, SLOs, and alert threshold configuration).');
    }

    if (score >= 9) correctness = 'Exemplary';
    else if (score >= 7) correctness = 'Competent';
    else if (score >= 5) correctness = 'Partially Flawed';
    else correctness = 'Deficient';
  }

  score = Math.min(10, Math.max(3, score));

  let nextQuestion = '';
  if (turnNumber >= maxTurns) {
    nextQuestion = 'Thank you for your detailed technical responses. We have completed all interview rounds and are ready to generate your comprehensive Hiring Committee Scorecard.';
  } else if (turnNumber === 1) {
    nextQuestion = `That provides a solid architectural foundation. Let's drill into the production failure modes:

Suppose your primary data store experiences a network partition lasting 45 seconds, during which 20% of worker nodes can reach the cache but cannot reach the primary database.
How does your design prevent split-brain updates and cascading connection pool exhaustion? Walk me through your fallback and recovery mechanics.`;
  } else {
    nextQuestion = `Good reasoning on the partition behavior. Now let's discuss operational scale and observability:

How would you define your Service Level Objectives (SLOs) for this architecture? Specifically, what telemetry (metrics, traces, logs) would you alert on to detect anomalies *before* end users notice latency degradation?`;
  }

  return {
    turnFeedback: {
      technicalCorrectness: correctness,
      strengths,
      gapsOrMisconceptions: gaps.length > 0 ? gaps : ['Consider specifying exact metric thresholds and automated remediation runbooks.'],
      scoreOutOf10: score,
    },
    nextQuestion,
  };
}

export function getOfflineHint(currentQuestion: string): string {
  if (currentQuestion.toLowerCase().includes('next') || currentQuestion.toLowerCase().includes('react')) {
    return 'Hint: Consider separating static layout shells from dynamic leaf nodes using React Server Components, and evaluate request deduplication / single-flight cache patterns to avoid database thundering herds.';
  }
  if (currentQuestion.toLowerCase().includes('outbox') || currentQuestion.toLowerCase().includes('payment')) {
    return 'Hint: Think about how atomic database transactions can write both the domain entity and an outbound event row to the same database engine in a single ACID commit before any network I/O occurs.';
  }
  return 'Hint: Focus on decoupling synchronous ingress from asynchronous processing using a durable messaging buffer, and identify which component holds the source of truth for rate limits.';
}

export function getOfflineFinalAssessment(
  config: AiInterviewConfig,
  history: { role: string; content: string }[]
): AiInterviewAssessment {
  const candidateTurns = history.filter((h) => h.role === 'candidate');
  const totalWords = candidateTurns.reduce((acc, t) => acc + t.content.split(/\s+/).filter(Boolean).length, 0);

  const isDeep = totalWords > 150;
  const overallScore = isDeep ? 84 : 72;
  const verdict = isDeep ? 'Hire' : 'Leaning Hire';

  return {
    overallScore,
    hiringVerdict: verdict,
    targetLevelAchieved: config.difficulty,
    executiveSummary: `Candidate demonstrated solid senior-level architectural intuition for ${config.role} (${config.technology}). Demonstrated strong technical principles around decoupled architectures and failure tolerance, with minor areas for growth in explicit observability definitions.`,
    topStrengths: [
      'Strong architectural clarity and structured problem decomposition.',
      'Sound understanding of production failure modes and data integrity constraints.',
      'Clear communication of technical decisions and component boundaries.',
    ],
    criticalWeaknesses: [
      'Could provide deeper quantitative metrics (exact latency budgets, IOPS, cache hit ratios).',
      'Should emphasize distributed observability (SLOs, distributed trace waterfalls) earlier in the design.',
    ],
    competencyBreakdown: {
      systemArchitecture: {
        score: isDeep ? 86 : 74,
        comment: 'Clean domain boundaries and appropriate selection of distributed patterns.',
      },
      correctnessAndEdgeCases: {
        score: isDeep ? 83 : 70,
        comment: 'Good awareness of concurrency, race conditions, and network partitions.',
      },
      productionReadiness: {
        score: isDeep ? 82 : 72,
        comment: 'Appropriate focus on idempotency, graceful recovery, and connection management.',
      },
      tradeoffAnalysis: {
        score: isDeep ? 85 : 72,
        comment: 'Articulated trade-offs between simplicity and operational scalability.',
      },
    },
    actionableRoadmap: [
      'Practice framing solutions with explicit quantitative capacity calculations (QPS, storage growth, network bandwidth).',
      'Deepen knowledge of OpenTelemetry trace context propagation across distributed asynchronous queues.',
      'Review formal consensus protocols (Raft, Paxos) for high-availability multi-region active-active clusters.',
    ],
    disclaimer:
      'Simulated AI assessment powered by the Full Stack Interview Lab evaluation framework. Performance scores represent structured skill growth and do not guarantee an employment offer.',
  };
}
