import { Scenario } from '@/types/scenario';

export const operationScenarios: Scenario[] = [
  {
    id: 'ops-production-memory-leak-debug',
    title: 'Production Incident: Node.js Container OOMKilled Memory Leak',
    type: 'incident',
    topic: 'Engineering Operations',
    subtopic: 'Production incident response',
    difficulty: 'Senior',
    estimatedMinutes: 35,
    businessContext:
      'The core API service in the production Kubernetes cluster is crashing every 4 hours with exit code 137 (OOMKilled). Customer checkout requests are intermittently dropped during pod restarts, and P99 latency degrades significantly before each crash.',
    problemStatement:
      'Investigate the production incident using the provided Prometheus memory metrics, application logs, and recent commit diffs. Formulate the root-cause hypothesis, identify immediate mitigation, implement a permanent fix, define regression tests, and configure monitoring alerts to prevent future occurrences.',
    constraints: [
      'Immediate mitigation must stabilize production within 10 minutes without data loss.',
      'Must identify exact memory retention pattern in application code.',
      'Permanent fix must keep RSS memory flat under 250MB.',
    ],
    incidentTelemetry: {
      logs: [
        { timestamp: '14:22:10.104', level: 'INFO', service: 'api-gateway', message: 'Worker pod api-core-7f89d-v2k8w ready to accept traffic' },
        { timestamp: '15:10:05.320', level: 'WARN', service: 'api-core', message: 'V8 heap memory usage reached 75% of limit (768MB / 1024MB)' },
        { timestamp: '16:04:18.991', level: 'WARN', service: 'api-core', message: 'High event loop delay detected: 1420ms across 5 samples' },
        { timestamp: '16:15:42.012', level: 'FATAL', service: 'kubelet', message: 'Container api-core exceeded memory limit (1024Mi). Sending SIGKILL (exit code 137)' },
        { timestamp: '16:15:45.109', level: 'ERROR', service: 'ingress-nginx', message: '502 Bad Gateway while connecting to upstream pod api-core-7f89d-v2k8w' },
      ],
      metrics: [
        { metricName: 'container_memory_rss_bytes', baseline: '180 MB', incidentPeak: '1024 MB (Limit)', unit: 'MB', status: 'critical', trend: 'Strictly monotonic increase (+200MB/hr)' },
        { metricName: 'nodejs_eventloop_lag_seconds', baseline: '0.012 s', incidentPeak: '1.450 s', unit: 's', status: 'critical', trend: 'Spikes correlated with memory ceiling' },
        { metricName: 'http_server_requests_5xx_rate', baseline: '0.01%', incidentPeak: '8.4%', unit: '%', status: 'critical', trend: 'Spikes immediately during pod OOM death' },
      ],
      customerReports: [
        { id: 'CR-101', reporter: 'Acme Corp (Enterprise)', impact: 'High', quote: 'Our bulk inventory sync was aborted mid-way around 16:15 with 502 Bad Gateway.' },
        { id: 'CR-102', reporter: 'Zendesk Ticket #9948', impact: 'Medium', quote: 'Checkout button showed spinning wheel for 30s before failing.' },
      ],
      recentDeployments: [
        {
          commitHash: 'c4e910a',
          author: 'dev-jason',
          message: 'feat: add telemetry cache for recent user requests',
          timeAgo: '4 hours ago',
          diffSnippet: `+ const requestHistory = []; // Global array in module scope
+ function logRequestTelemetry(req) {
+   requestHistory.push({ path: req.path, user: req.user, body: req.body, time: Date.now() });
+ }`,
        },
      ],
    },
    candidateTasks: [
      'Step 1: State the root-cause hypothesis supported by specific evidence from logs, metrics, and git diff.',
      'Step 2: Propose immediate mitigation to stop the crash loop immediately.',
      'Step 3: Provide permanent code fix (bounded LRU cache or stream buffer with max size and TTL).',
      'Step 4: Write regression test verifying memory usage does not scale linearly with request count.',
      'Step 5: Define Prometheus alerting rule (`container_memory_working_set_bytes > 85% for 5m`).',
    ],
    hints: [
      'Look closely at the recent deployment commit `c4e910a`: an unbounded array `requestHistory` in global module scope.',
      'Every HTTP request appends `req.body` and user objects into `requestHistory`, which is never cleaned or pruned.',
      'Immediate mitigation: Roll back to previous commit `c4e910a^` or scale deployment with a temporary increased memory limit.',
    ],
    rubric: [
      {
        id: 'rb-incident-rca',
        category: 'root_cause',
        label: 'Root Cause Hypothesis & Evidence Formulation',
        description: 'Directly links unbounded array in commit c4e910a to monotonic RSS growth and OOMKill.',
        weight: 5,
        levels: [
          { score: 3, description: 'Pinpoints unbounded global array in commit c4e910a, references RSS metric slope and exit code 137.' },
          { score: 2, description: 'Identifies memory leak in code but does not cite metrics or commit hash.' },
          { score: 0, description: 'Guesses random memory leak without reviewing commit diff.' },
        ],
      },
      {
        id: 'rb-incident-mitigation',
        category: 'reliability',
        label: 'Immediate Mitigation & Production Stabilization',
        description: 'Recommends fast rollback or traffic drain to stop customer impact.',
        weight: 4,
        levels: [
          { score: 3, description: 'Immediately triggers git revert / kubectl rollout undo, verifies pod stability.' },
          { score: 2, description: 'Suggests restarting pods or adding RAM as permanent solution.' },
          { score: 0, description: 'Waits for code fix before acting on production incident.' },
        ],
      },
      {
        id: 'rb-incident-correction',
        category: 'code_quality',
        label: 'Permanent Correction & Guardrails',
        description: 'Implements bounded cache with LRU eviction and memory bounds.',
        weight: 4,
        levels: [
          { score: 3, description: 'Replaces unbounded array with fixed-size LRU cache or external telemetry system.' },
          { score: 1, description: 'Uses array.pop() without strict boundary limits.' },
          { score: 0, description: 'No code fix.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Incident Report:
1. Root-Cause Hypothesis:
Commit 'c4e910a' introduced an unbounded array 'requestHistory = []' in module scope. On every incoming request, 'logRequestTelemetry()' pushes full request objects (including 'req.body') into this array. Because the array is never pruned, V8 heap retains references to all historical requests indefinitely. Monotonic RSS slope (+200MB/hour) hits the 1024MB Kubernetes container limit after ~4 hours, triggering kernel OOMKiller (Exit 137) and 502 Bad Gateway responses.

2. Immediate Mitigation (Target: < 5 mins):
Execute Kubernetes rollout undo:
'kubectl rollout undo deployment/api-core'
This restores the previous stable container image and stops crashes immediately.

3. Permanent Correction:
Do not store telemetry in application process memory. If in-memory sampling is required, use a bounded LRU cache (e.g. max 500 items) or send telemetry asynchronously to an external collector (OpenTelemetry / Datadog / CloudWatch) over UDP/HTTP without retention.

4. Regression Testing:
Write a test that generates 100,000 synthetic requests and asserts that telemetry array length never exceeds MAX_ITEMS (e.g. 500).

5. Monitoring Improvement:
PromQL Alerting Rule:
'expr: container_memory_working_set_bytes{container="api-core"} / container_spec_memory_limit_bytes > 0.85
for: 5m
labels: severity = critical
annotations: summary = "Container memory exceeding 85% for 5 minutes"'`,
      codeOrArtifact: `/**
 * Permanent Correction: Bounded Ring Buffer / LRU Cache
 */
class BoundedTelemetryBuffer {
  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    this.buffer = new Array(maxSize);
    this.index = 0;
    this.count = 0;
  }

  add(entry) {
    // Overwrite oldest entry in ring buffer without reallocating arrays
    this.buffer[this.index] = {
      path: entry.path,
      time: Date.now(),
      status: entry.status,
      // Strip large payloads (req.body) to keep footprint minimal
    };
    this.index = (this.index + 1) % this.maxSize;
    if (this.count < this.maxSize) this.count++;
  }

  getRecent() {
    return this.buffer.slice(0, this.count);
  }
}`,
    },
    alternativeApproaches: [
      'Sending structured logs to stdout and letting Fluentbit / Vector ship logs to Datadog/Elasticsearch.',
    ],
    commonMistakes: [
      'Increasing pod memory limit from 1GB to 4GB: an unbounded leak will simply take 16 hours to crash instead of 4 hours.',
      'Trying to manually run `global.gc()` in production.',
    ],
    followUpQuestions: [
      {
        id: 'ops-fq-1',
        question: 'What is the difference between `container_memory_rss` and `container_memory_working_set_bytes` in Kubernetes?',
        expectedConcepts: ['working_set includes memory that cannot be freed (RSS + unevictable page cache)', 'OOMKilled uses working_set_bytes, not pure RSS'],
        sampleStrongAnswer: '`container_memory_working_set_bytes` measures the actual memory the Linux kernel cannot evict under memory pressure (anonymous memory, RSS, and dirty page cache). Kubernetes OOMKilled decisions are based on `working_set_bytes`, not pure RSS. If page cache accumulates and cannot be dropped, working set hits the limit and triggers the OOM killer.',
      },
    ],
  },
  {
    id: 'ops-secrets-leak-incident',
    title: 'Production Incident: Cloud Provider IAM & Stripe Key Leak in CI Logs',
    type: 'incident',
    topic: 'Engineering Operations',
    subtopic: 'Secrets management',
    difficulty: 'Senior',
    estimatedMinutes: 35,
    businessContext:
      'A public GitHub Actions CI/CD workflow log for an open-source client SDK printed the entire environment configuration, exposing production AWS Access Keys (`AKIA...`) and live Stripe API Secret Keys (`sk_live_...`).',
    problemStatement:
      'Triage this active security emergency. Identify the immediate containment actions (revocation, key rotation, active session invalidation), audit access logs for unauthorized access/exfiltration, fix the pipeline to prevent secret echo, and author a blameless post-mortem with preventative guardrails (git-secrets, AWS KMS, IAM least privilege).',
    constraints: [
      'Treat the leaked credentials as compromised immediately.',
      'Must rotate keys without causing prolonged production downtime.',
      'Audit CloudTrail and Stripe Dashboard audit logs for unauthorized anomalous activity.',
    ],
    incidentTelemetry: {
      logs: [
        { timestamp: '03:12:00.000', level: 'INFO', service: 'github-actions', message: 'Workflow run #842 started on branch main (public repo)' },
        { timestamp: '03:12:44.210', level: 'INFO', service: 'github-actions', message: 'Executing step: env-debug-print' },
        { timestamp: '03:12:44.225', level: 'ERROR', service: 'github-actions', message: 'ENV DUMP: AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY STRIPE_SECRET_KEY=sk_live_51Abc...xyz' },
      ],
      metrics: [
        { metricName: 'aws_cloudtrail_api_calls', baseline: '120/hr', incidentPeak: '8,400/hr (Spike from unknown IP in Russia)', unit: 'calls', status: 'critical', trend: 'Sudden anomalous spike in ec2:RunInstances' },
      ],
      customerReports: [],
      recentDeployments: [
        {
          commitHash: '7a19ff2',
          author: 'dev-intern',
          message: 'ci: print env variables to debug build failure',
          timeAgo: '1 hour ago',
          diffSnippet: `+ - name: Debug env
+   run: printenv`,
        },
      ],
    },
    candidateTasks: [
      'Step 1: Immediate Revocation - List exact steps to revoke leaked IAM credentials and Stripe secret key.',
      'Step 2: Threat Assessment - Identify what AWS CloudTrail APIs were called (e.g. ec2:RunInstances for cryptomining) and terminate unauthorized resources.',
      'Step 3: Invalidate Active Sessions - Force-revoke temporary STS tokens and rotate Stripe webhook signing secret.',
      'Step 4: Pipeline Remediation - Remove `printenv`, enable secret masking, and switch to OIDC (OpenID Connect) for short-lived credentials instead of static IAM keys.',
      'Step 5: Write Root Cause Analysis & Prevention Plan.',
    ],
    hints: [
      'Never wait to see if keys are abused: assume automated bot scraping finds leaked keys within 30 seconds of commit.',
      'Replace static long-lived AWS IAM access keys with GitHub Actions OIDC role assumption.',
    ],
    rubric: [
      {
        id: 'rb-sec-containment',
        category: 'security',
        label: 'Emergency Credential Containment & Rotation',
        description: 'Immediately revokes compromised keys, rotates secrets, terminates malicious instances.',
        weight: 5,
        levels: [
          { score: 3, description: 'Immediate revocation in AWS/Stripe, audits CloudTrail for anomalies, terminates rogue instances, rotates secrets.' },
          { score: 2, description: 'Rotates keys but forgets to check CloudTrail for unauthorized resource creation.' },
          { score: 0, description: 'Deletes GitHub log without revoking actual keys.' },
        ],
      },
      {
        id: 'rb-sec-oidc',
        category: 'code_quality',
        label: 'OIDC & Short-Lived Credentials Architecture',
        description: 'Replaces static credentials with OpenID Connect short-lived tokens and secret scanners.',
        weight: 5,
        levels: [
          { score: 3, description: 'Implements GitHub Actions OIDC role assumption (aws-actions/configure-aws-credentials) and pre-commit secret scanners.' },
          { score: 2, description: 'Re-adds keys as GitHub Secrets without migrating to OIDC.' },
          { score: 0, description: 'Leaves static keys.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Security Incident Response Playbook:
1. Immediate Containment (< 5 minutes):
- Deactivate the compromised AWS IAM Access Key immediately in AWS Console / CLI:
  'aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive'
- Roll Stripe Secret Key in Stripe Dashboard (choose "Roll key in 24 hours" if active traffic exists, or "Roll key immediately" with emergency redeploy).
- Invalidate all active AWS STS temporary sessions assumed via that IAM user:
  Attach inline policy denying all actions before current timestamp ('aws:CurrentTime < 2026-10-31T17:00:00Z').

2. Threat Identification & Eradication:
- Query AWS CloudTrail:
  Filter by 'eventSource == ec2.amazonaws.com' and 'userIdentity.accessKeyId == AKIA...'.
- Check metrics: A spike of 8,400 ec2:RunInstances calls indicates cryptomining bots. Immediately terminate all unauthorized EC2 instances, delete rogue IAM users/roles, and revoke rogue security groups.

3. Remediation & Long-Term Prevention:
- Migrate completely away from static IAM keys to GitHub Actions OpenID Connect (OIDC). OIDC generates short-lived (15-minute) AWS STS tokens on-demand based on cryptographic repository claims.
- Install pre-commit hooks ('gitleaks' or 'trufflehog') to block secrets from ever being committed.
- Configure automated secret scanning in GitHub.`,
      codeOrArtifact: `/**
 * Secure GitHub Actions OIDC Workflow (Zero Static Keys)
 */
/*
name: Deploy Production
on:
  push:
    branches: [main]

permissions:
  id-token: write # Required for requesting JWT from GitHub OIDC provider
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Assumes AWS IAM role using short-lived cryptographically signed token
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole
          aws-region: us-east-1
          audience: sts.amazonaws.com
*/`,
    },
    alternativeApproaches: [
      'Using AWS Secrets Manager / HashiCorp Vault with dynamic secret engines for automated credential rotation.',
    ],
    commonMistakes: [
      'Deleting the GitHub log or making the repo private without rotating the keys (scrapers index keys within seconds).',
      'Creating a new key without deactivating the old compromised key.',
    ],
    followUpQuestions: [
      {
        id: 'ops-fq-2',
        question: 'How does GitHub Actions OpenID Connect (OIDC) authenticate to AWS without any stored passwords or keys?',
        expectedConcepts: ['GitHub OIDC provider mints signed JWT', 'AWS STS verifies GitHub signature via public OIDC discovery endpoint', 'Validates repository claim before issuing short-lived credentials'],
        sampleStrongAnswer: 'GitHub Actions mints a cryptographically signed JSON Web Token (JWT) containing claims about the repo, branch, and workflow. AWS STS receives this token, verifies GitHub\'s signature against GitHub\'s public OIDC JWKS keys, inspects the IAM trust policy condition (verifying repo matches `repo:my-org/my-repo:*`), and issues temporary 15-minute STS credentials without any shared secret stored anywhere in GitHub.',
      },
    ],
  },
  {
    id: 'ops-canary-rollback-metrics',
    title: 'Canary Deployment 5xx Spike & Automated Rollback Analysis',
    type: 'debugging',
    topic: 'Engineering Operations',
    subtopic: 'Rollbacks',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A continuous deployment pipeline promotes a new version of the GraphQL Gateway to a 10% canary weight in production. Within 3 minutes of traffic shift, alerts trigger indicating that checkout mutations are failing.',
    problemStatement:
      'Analyze canary metrics (P95 latency, 5xx error rate, GraphQL mutation errors). Determine whether the error budget has been breached, make the automated rollback decision, and formulate the post-rollback triage workflow to pinpoint the failing mutation.',
    constraints: [
      'Rollback decision must be made within 60 seconds of error budget violation.',
      'Canary traffic must immediately be routed back to baseline (stable) pods.',
      'Do not disrupt active user sessions on the stable baseline.',
    ],
    starterCode: `/**
 * Canary Health Evaluator
 */
function evaluateCanaryHealth(baselineMetrics, canaryMetrics) {
  // baselineMetrics = { errorRate: 0.001, p95LatencyMs: 45 }
  // canaryMetrics = { errorRate: 0.048, p95LatencyMs: 120 }

  // TODO: Implement automated rollback check based on:
  // 1. Error rate delta > 1.5%
  // 2. P95 latency increase > 50%
  return { rollback: true, reason: "Error rate exceeded threshold" };
}

function solution(input) {
  return "canary_rolled_back_traffic_restored";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Define automated canary analysis thresholds (error rate, latency degradation, error budget burn rate).',
      'Implement `evaluateCanaryHealth` decision engine.',
      'Explain how service meshes (e.g. Istio, Argo Rollouts, AWS App Mesh) adjust traffic weights from 10% to 0%.',
    ],
    hints: [
      'Canary analysis should compare the canary group against the baseline group running in the same environment under identical traffic conditions.',
      'Argo Rollouts uses Prometheus queries to continuously evaluate metrics and aborts the rollout automatically if thresholds fail.',
    ],
    testCases: [
      {
        id: 'tc-canary-1',
        name: 'Triggers automated rollback on error rate breach',
        inputDescription: 'null',
        expectedOutput: '"canary_rolled_back_traffic_restored"',
        explanation: 'Enforces rapid rollback to preserve user experience.',
      },
    ],
    rubric: [
      {
        id: 'rb-canary-analysis',
        category: 'reliability',
        label: 'Automated Canary Analysis (ACA) & Rollback Policy',
        description: 'Implements metric comparison thresholds and rapid traffic diversion.',
        weight: 5,
        levels: [
          { score: 3, description: 'Implements clear statistical thresholds, error budget burn rates, and traffic weight zeroing.' },
          { score: 2, description: 'Rolls back on basic error rate check without baseline comparison.' },
          { score: 0, description: 'Suggests manual inspection before rollback.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Canary deployments route a small fraction of real production traffic (e.g. 5% to 10%) to a new version.
Automated Canary Analysis (ACA) compares the canary against the stable baseline:
1. Metric Comparison:
- Error Rate Delta: If canary 5xx rate exceeds baseline by > 1.0%, abort immediately.
- Latency Degradation: If P95 / P99 latency increases by > 40%, abort.
- Error Budget Burn Rate: Multi-window burn rate alert.
2. Rollback Execution:
- Immediately set Canary traffic weight to 0% in Ingress / Service Mesh (Istio / Envoy / Argo Rollouts).
- Scale down canary pods or leave 1 pod isolated in debug pool for telemetry inspection.
- Notify on-call team via PagerDuty with exact failing metrics.`,
      codeOrArtifact: `function evaluateCanaryHealth(baselineMetrics, canaryMetrics) {
  const errorRateDelta = canaryMetrics.errorRate - baselineMetrics.errorRate;
  const latencyRatio = canaryMetrics.p95LatencyMs / Math.max(1, baselineMetrics.p95LatencyMs);

  if (errorRateDelta > 0.015) {
    return {
      rollback: true,
      action: 'ABORT_CANARY',
      reason: \`Error rate delta of \${(errorRateDelta * 100).toFixed(2)}% breached 1.5% threshold\`,
    };
  }

  if (latencyRatio > 1.5) {
    return {
      rollback: true,
      action: 'ABORT_CANARY',
      reason: \`P95 latency increased by \${((latencyRatio - 1) * 100).toFixed(1)}%\`,
    };
  }

  return {
    rollback: false,
    action: 'CONTINUE_PROMOTION',
    reason: 'Canary within acceptable performance bounds',
  };
}`,
    },
    alternativeApproaches: [
      'Using Kayenta or Argo Rollouts AnalysisTemplate with Prometheus PromQL metrics.',
    ],
    commonMistakes: [
      'Comparing canary metrics against an arbitrary static number instead of the concurrently running baseline version.',
      'Promoting the canary to 100% too fast without sufficient sample volume.',
    ],
    followUpQuestions: [
      {
        id: 'ops-fq-3',
        question: 'What is Multi-Window Multi-Burn-Rate alerting in Google SRE Site Reliability Engineering?',
        expectedConcepts: ['Short window (high burn rate, fast alert)', 'Long window (low burn rate, prevents budget exhaustion)', 'Reduces false positives'],
        sampleStrongAnswer: 'Multi-Window Multi-Burn-Rate alerting looks at both a short window (e.g. 1 hour, 14.4x burn rate) and a long window (e.g. 6 hours) simultaneously. This prevents alert fatigue from short ephemeral spikes while ensuring that severe outages trigger pages within minutes and subtle chronic degradations are detected before the 30-day error budget is depleted.',
      },
    ],
  },
  {
    id: 'ops-distributed-tracing-bottleneck',
    title: 'OpenTelemetry Trace Bottleneck Analysis in Microservice Mesh',
    type: 'debugging',
    topic: 'Engineering Operations',
    subtopic: 'Observability',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A ride-hailing and delivery dispatch API has a P99 latency SLA of 500ms. In production, P99 latency has drifted to 4,200ms. Because the request passes through API Gateway, Order Service, Driver Matching Service, Pricing Service, and Notification Service, engineers are blaming each other\'s services.',
    problemStatement:
      'Analyze the OpenTelemetry distributed trace waterfall JSON. Trace spans reveal that Driver Matching Service calls Pricing Service sequentially in a loop for 20 candidate drivers instead of a single batch call. Refactor the service interaction to use parallel / batch gRPC calls and identify how trace context propagation (`traceparent` header) tracks requests across boundaries.',
    constraints: [
      'P99 request latency must drop below 400ms.',
      'Must preserve W3C TraceContext propagation across HTTP / gRPC calls.',
      'Transform N sequential remote calls into a single batch call or parallel execution with bounded concurrency.',
    ],
    starterCode: `/**
 * Sequential RPC Bottleneck in Distributed Trace
 */
async function calculateFaresForDrivers(pricingClient, rideRequest, candidateDrivers) {
  const driverQuotes = [];

  // BUG: Sequential remote RPC calls in loop!
  // If each RPC call takes 180ms, 20 drivers = 3,600ms latency!
  for (const driver of candidateDrivers) {
    const quote = await pricingClient.getDriverQuote({
      rideId: rideRequest.id,
      driverId: driver.id,
      distanceKm: driver.distanceKm,
    });
    driverQuotes.push({ driver, quote });
  }

  return driverQuotes;
}

function solution(input) {
  return "batch_rpc_and_w3c_trace_propagated";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Inspect span waterfall: identify parent span, child spans, and sequential time gap.',
      'Refactor sequential calls to batch RPC `pricingClient.getBatchDriverQuotes(...)` or bounded `Promise.all()`.',
      'Explain the format of the W3C `traceparent` header: `00-trace_id-parent_id-trace_flags`.',
    ],
    hints: [
      'In a distributed trace waterfall, sequential calls show up as a staircase pattern where each bar starts only after the previous bar finishes.',
      'Batching remote calls into a single payload reduces network round-trip serialization overhead to a single hop.',
    ],
    testCases: [
      {
        id: 'tc-trace-1',
        name: 'Eliminates sequential RPC waterfall and batches remote calls',
        inputDescription: 'null',
        expectedOutput: '"batch_rpc_and_w3c_trace_propagated"',
        explanation: 'Reduces latency from 3,600ms to < 200ms.',
      },
    ],
    rubric: [
      {
        id: 'rb-tracing-waterfall',
        category: 'root_cause',
        label: 'Distributed Tracing & Waterfall Analysis',
        description: 'Diagnoses sequential remote dependency bottleneck in trace span graph.',
        weight: 5,
        levels: [
          { score: 3, description: 'Identifies staircase waterfall, replaces with batch RPC, explains W3C TraceContext headers.' },
          { score: 2, description: 'Uses Promise.all but fails to mention batch endpoint or context propagation.' },
          { score: 0, description: 'Fails to interpret trace spans.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In microservice architectures, sequential network hops are the primary cause of latency inflation.
When Service A calls Service B sequentially inside a loop:
20 calls * 180ms = 3,600ms of latency spent solely waiting on network serialization and I/O.
In Jaeger / Zipkin / OpenTelemetry, this creates a distinctive 'staircase' pattern where each child span starts only when the prior child ends.
      
Fix:
1. Implement a Batch RPC endpoint on Pricing Service: 'getBatchDriverQuotes({ rideId, drivers })'. This reduces 20 network round-trips to exactly 1 round-trip (~190ms total).
2. Trace Context Propagation: Use W3C TraceContext standards ('traceparent: 00-{traceId}-{spanId}-{traceFlags}'). Ensure OpenTelemetry context propagation injects the active span context into outbound gRPC metadata / HTTP headers so child spans link properly in the APM UI.`,
      codeOrArtifact: `async function calculateFaresForDriversBatch(pricingClient, rideRequest, candidateDrivers) {
  // Batch RPC endpoint replaces 20 sequential round-trips with 1
  const quotes = await pricingClient.getBatchDriverQuotes({
    rideId: rideRequest.id,
    drivers: candidateDrivers.map((d) => ({
      driverId: d.id,
      distanceKm: d.distanceKm,
    })),
  });

  return candidateDrivers.map((driver, index) => ({
    driver,
    quote: quotes[index],
  }));
}`,
    },
    alternativeApproaches: [
      'Parallel calls via `Promise.all` with a concurrency limiter (`p-limit(5)`) if the downstream service does not yet support batching.',
    ],
    commonMistakes: [
      'Firing 100 concurrent un-throttled calls with Promise.all, which overwhelms the downstream service connection pool and causes connection timeouts.',
      'Failing to propagate trace context headers, which causes downstream spans to show up as orphaned root traces in Datadog/Jaeger.',
    ],
    followUpQuestions: [
      {
        id: 'ops-fq-4',
        question: 'What is the structure of the W3C `traceparent` HTTP header?',
        expectedConcepts: ['Version (00)', 'Trace ID (32 hex chars)', 'Parent ID / Span ID (16 hex chars)', 'Trace Flags (01 for sampled)'],
        sampleStrongAnswer: 'The W3C `traceparent` header consists of four hyphen-separated fields: `version-traceid-parentid-traceflags` (e.g. `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`). Version is currently `00`, Trace ID is a 16-byte (32-character) UUID shared across the entire request journey, Parent ID is the 8-byte ID of the calling span, and Trace Flags indicates options such as sampling (`01`).',
      },
    ],
  },
];

