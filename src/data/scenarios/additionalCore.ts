import { Scenario } from '@/types/scenario';

export const additionalCoreScenarios: Scenario[] = [
  {
    id: 'sec-ssrf-webhook-metadata',
    title: 'Custom Webhook Dispatcher AWS Metadata SSRF Vulnerability',
    type: 'debugging',
    topic: 'Security',
    subtopic: 'API response typing',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A B2B integration platform allows enterprise customers to register custom webhook callback URLs (e.g. `https://hooks.slack.com/...`). A penetration testing audit discovered that by submitting `http://169.254.169.254/latest/meta-data/iam/security-credentials/`, an attacker can exfiltrate AWS instance IAM credentials directly to their webhook receiver.',
    problemStatement:
      'The webhook dispatcher executes `fetch(userSuppliedUrl)` directly from backend worker pods. The function lacks private IP filtering, DNS rebinding protection, and URL protocol restrictions, allowing Server-Side Request Forgery (SSRF) against internal VPC services and the cloud metadata API (169.254.169.254).',
    constraints: [
      'Must block requests to private IP ranges: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, and cloud metadata 169.254.169.254.',
      'Must protect against DNS Rebinding attacks (where a public domain resolves to a public IP on first check, but resolves to 169.254.169.254 when fetch executes).',
      'Only permit HTTPS / HTTP protocols; block `file://`, `gopher://`, `ftp://`.',
    ],
    starterCode: `const dns = require('dns').promises;

/**
 * Vulnerable Webhook Dispatcher
 */
async function sendWebhookNotification(targetUrl, payload) {
  // BUG: Direct fetch of unvalidated user-controlled URL allows SSRF to cloud metadata
  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.status;
}

function solution(input) {
  return "ssrf_firewall_and_dns_pinning_applied";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the mechanics of SSRF and the AWS EC2 instance metadata service (IMDSv1 vs IMDSv2).',
      'Resolve the DNS hostname first, validate that the resolved IP address is NOT in private or loopback ranges.',
      'Explain DNS Rebinding attacks and how to pin the resolved IP in the HTTP agent socket connection.',
    ],
    hints: [
      'Checking URL strings like `url.includes("localhost")` is trivial to bypass using hexadecimal IPs (e.g. `http://0x7f000001`) or redirect loops.',
      'You must resolve the hostname via `dns.lookup()`, verify the IP is publicly routable, and connect directly to that validated IP.',
    ],
    testCases: [
      {
        id: 'tc-ssrf-1',
        name: 'Blocks internal IPs and pins verified public IP',
        inputDescription: 'null',
        expectedOutput: '"ssrf_firewall_and_dns_pinning_applied"',
        explanation: 'Enforces complete SSRF mitigation.',
      },
    ],
    rubric: [
      {
        id: 'rb-ssrf-rca',
        category: 'security',
        label: 'SSRF & Cloud Metadata Defense',
        description: 'Understands SSRF, DNS Rebinding, and IMDSv2 session token defenses.',
        weight: 5,
        levels: [
          { score: 3, description: 'Validates resolved IP, pins socket IP against DNS rebinding, enforces IMDSv2 and egress firewall rules.' },
          { score: 2, description: 'Checks IP range but vulnerable to DNS rebinding or redirects.' },
          { score: 0, description: 'Only checks string matching on URL.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Server-Side Request Forgery (SSRF) occurs when an application fetches a remote resource without validating the destination address. In cloud environments (AWS, GCP, Azure), querying the link-local metadata address 'http://169.254.169.254' returns IAM instance credentials, API keys, and environment variables.
      
Comprehensive Defense in Depth:
1. URL Protocol Validation: Only allow 'http:' and 'https:'.
2. DNS Resolution & Private IP Range Filtering:
   Resolve hostname using 'dns.lookup()'. Check that the resolved IPv4/IPv6 is NOT in:
   - 127.0.0.0/8 (Loopback)
   - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (Private RFC 1918)
   - 169.254.169.254 / 169.254.0.0/16 (Link-Local Cloud Metadata)
   - ::1 / fc00::/7 (IPv6 private)
3. DNS Rebinding Defense: Connect directly to the resolved and verified IP address, passing the original domain in the 'Host' header, or use an egress proxy like Envoy / Smokescreen.
4. Cloud Guardrail: Enforce AWS IMDSv2 (requiring a PUT request with X-aws-ec2-metadata-token-ttl-seconds) which blocks basic GET-based SSRF.`,
      codeOrArtifact: `const dns = require('dns').promises;
const ipaddr = require('ipaddr.js');

async function sendWebhookNotificationSafe(targetUrl, payload) {
  const parsed = new URL(targetUrl);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Disallowed protocol');
  }

  // 1. Resolve DNS to physical IP
  const lookup = await dns.lookup(parsed.hostname);
  const addr = ipaddr.parse(lookup.address);

  // 2. Reject private, loopback, link-local, or carrier-grade NAT IPs
  const range = addr.range();
  if (
    range === 'loopback' ||
    range === 'private' ||
    range === 'linkLocal' || // Blocks 169.254.x.x
    range === 'carrierGradeNat' ||
    range === 'broadcast'
  ) {
    throw new Error(\`Security Exception: SSRF attempt to private network address (\${lookup.address})\`);
  }

  // 3. Dispatch with custom agent pinned to validated IP and redirect disabled
  return fetch(targetUrl, {
    method: 'POST',
    redirect: 'error', // Prevent 302 redirects from bypassing IP filter!
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}`,
    },
    alternativeApproaches: [
      'Routing all outbound webhook requests through a hardened forward-proxy (e.g. Stripe Smokescreen) with strict iptables egress rules.',
    ],
    commonMistakes: [
      'Following HTTP 302 redirects automatically: an attacker points their public domain to a server that returns `Location: http://169.254.169.254`, bypassing the initial IP check.',
      'Checking URL hostname without resolving DNS (e.g. testing `parsed.hostname !== "169.254.169.254"` which fails if the attacker uses an `attacker-controlled.com` domain pointing to that IP).',
    ],
    followUpQuestions: [
      {
        id: 'sec-fq-3',
        question: 'Why does AWS IMDSv2 require a `PUT` request with custom headers instead of a simple `GET`?',
        expectedConcepts: ['Most simple SSRF and HTML/form injection vulnerabilities cannot issue PUT requests with custom headers', 'Blocks SSRF via image tags / simple fetch'],
        sampleStrongAnswer: 'IMDSv2 requires callers to first issue an HTTP `PUT` request with the header `X-aws-ec2-metadata-token-ttl-seconds` to obtain a session token before requesting metadata. Because typical SSRF exploits (via open redirects, markdown images, or basic GET proxies) cannot manipulate HTTP methods or inject custom request headers, IMDSv2 completely neutralizes simple SSRF attacks.',
      },
    ],
  },
  {
    id: 'sysdesign-distributed-search-engine',
    title: 'E-Commerce Real-Time Full-Text Search & Faceted Filtering',
    type: 'system_design',
    topic: 'System Design',
    subtopic: 'Search',
    difficulty: 'Staff/Principal',
    estimatedMinutes: 45,
    businessContext:
      'An e-commerce retailer with 25,000,000 product SKUs needs sub-50ms search with autocomplete, typo tolerance, synonyms, faceted aggregations (brand, category, price ranges, rating), and real-time inventory filtering.',
    problemStatement:
      'Architect an enterprise search engine cluster (Elasticsearch / OpenSearch). Describe the document indexing pipeline from PostgreSQL via CDC, the inverted index and BKD tree structure, shard distribution, query DSL construction for boolean query scoring with BM25, and zero-downtime index re-indexing via index aliases.',
    constraints: [
      'Search query P99 latency: < 50ms across 25M products.',
      'Freshness: New products or price changes searchable within 3 seconds of DB commit.',
      'Support typo tolerance (Levenshtein edit distance 1-2) without killing performance.',
    ],
    systemDesignReqs: {
      scale: '25M products, 5k search queries/second peak, 100 updates/second.',
      functional: [
        'Full-text query search with BM25 relevance scoring.',
        'Faceted navigation (aggregations on price, color, brand).',
        'Autocomplete / Suggest-as-you-type.',
        'Typo tolerance and synonym expansion.',
      ],
      nonFunctional: [
        'Sub-50ms search response.',
        'Zero-downtime schema migrations via Aliases.',
        'Read replica scaling.',
      ],
      assumptions: [
        'PostgreSQL is source of truth.',
        'Elasticsearch / OpenSearch used as search secondary index.',
      ],
    },
    candidateTasks: [
      'Design the inverted index document mapping with analyzers (stemming, lowercase, edge_ngram for autocomplete).',
      'Explain BM25 relevance scoring algorithm (term frequency, inverse document frequency, document length normalization).',
      'Design the zero-downtime re-indexing strategy using Index Aliases (`products_v1` -> `products_v2` with `_aliases` switch).',
      'Design faceted aggregations using doc_values for low memory footprint.',
    ],
    hints: [
      'Inverted indexes map terms to document IDs for text search; BKD trees index numeric values (prices, ratings) for range filters.',
      'Never point application directly to an index name (`products`); point to an alias (`products_active`) so you can swap versions atomically.',
    ],
    rubric: [
      {
        id: 'rb-search-inverted',
        category: 'tradeoffs',
        label: 'Inverted Index & Analyzer Architecture',
        description: 'Details text analysis, tokenizers, edge-ngram, and BKD tree numeric indexing.',
        weight: 5,
        levels: [
          { score: 3, description: 'Deep mastery of text analyzers, inverted index, BKD trees, and doc_values for aggregations.' },
          { score: 2, description: 'Suggests Elasticsearch but unaware of analyzer pipelines or alias swapping.' },
          { score: 0, description: 'Suggests doing ILIKE %query% in Postgres.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Search Architecture Design:
1. Ingestion & Sync Pipeline:
- Source of truth: PostgreSQL.
- CDC (Change Data Capture) via Debezium monitors DB WAL -> pushes to Kafka 'products.cdc' topic.
- Ingestion Worker batch-indexes documents into OpenSearch using the Bulk API (batches of 1,000 docs).

2. Document Index Mapping:
- Analyzers:
  - Standard English Analyzer (lowercase, stemmer, stop-words) for full-text search.
  - Edge-nGram Token Filter (min_gram: 2, max_gram: 15) on dedicated 'title.autocomplete' sub-field for fast prefix search without expensive regex.
  - Keyword type on 'brand', 'category', 'sku' with 'doc_values: true' for fast aggregations and sorting.
  - Dense Vector field for semantic hybrid search with embeddings.

3. Query Construction (Bool Query):
- 'must': Multi-match on 'title' (boost 3.0), 'description' (boost 1.0) with BM25 scoring and 'fuzziness: "AUTO"'.
- 'filter': Range queries on 'price', 'in_stock: true' (runs in filter context: bypasses scoring and leverages fast bitset caching).
- 'aggs': Terms aggregations on 'brand', 'category' and stats aggregation on 'price'.

4. Zero-Downtime Re-indexing via Aliases:
- Application queries the alias 'products_active'.
- To change schema or mapping, create 'products_v2'.
- Run '_reindex' API from 'products_v1' to 'products_v2'.
- Atomically swap the alias:
  'POST /_aliases { actions: [ { remove: { index: "products_v1", alias: "products_active" } }, { add: { index: "products_v2", alias: "products_active" } } ] }'
- Zero downtime, zero dropped queries.`,
      codeOrArtifact: `/* Elasticsearch Index Mapping Snippet */
PUT /products_v1
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "autocomplete_analyzer": {
          "tokenizer": "autocomplete_tokenizer",
          "filter": ["lowercase"]
        }
      },
      "tokenizer": {
        "autocomplete_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 15,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "autocomplete": { "type": "text", "analyzer": "autocomplete_analyzer" }
        }
      },
      "brand": { "type": "keyword" },
      "price": { "type": "scaled_float", "scaling_factor": 100 },
      "in_stock": { "type": "boolean" }
    }
  }
}`,
    },
    alternativeApproaches: [
      'PostgreSQL `pgvector` + `pg_trgm` if catalog is smaller than 200k items.',
      'Algolia / Meilisearch for managed developer-friendly search.',
    ],
    commonMistakes: [
      'Running wildcards `*term*` in production: leading wildcards bypass inverted indexes and force a full cluster scan.',
      'Putting filters in the `must` clause instead of `filter` clause, calculating unnecessary relevance scores for boolean attributes and preventing cache utilization.',
    ],
    followUpQuestions: [
      {
        id: 'sys-fq-5',
        question: 'Why should filters like `in_stock: true` be placed in the `filter` context instead of the `must` context in Elasticsearch?',
        expectedConcepts: ['Filter context skips scoring (saves CPU)', 'Filter context results are cached in bitsets in RAM', 'Must context calculates BM25 score for every document'],
        sampleStrongAnswer: 'The `must` context calculates a relevance score (BM25) for each document matching the clause. In contrast, the `filter` context asks a binary yes/no question without calculating scores. Elasticsearch automatically caches filter context results in memory as compact roaring bitsets, providing nearly instant filtering and significantly lower CPU utilization.',
      },
    ],
  },
  {
    id: 'integ-payment-reconciliation-ledger',
    title: 'Automated Nightly Payment Gateway Reconciliation & Variance Ledger',
    type: 'coding',
    topic: 'Integrations',
    subtopic: 'Reconciliation and recovery',
    difficulty: 'Senior',
    estimatedMinutes: 35,
    businessContext:
      'A subscription SaaS processes \$500,000 daily across Stripe and PayPal. Month-end accounting closes revealed a \$42,000 discrepancy between the internal database and the bank settlement payout due to silent chargeback fees, unrecorded currency conversions, and dropped webhook events.',
    problemStatement:
      'Design an automated payment reconciliation engine. The worker fetches the daily settlement balance transaction CSV/API feed from Stripe, parses all events (charges, refunds, dispute fees, transfer payout fees), compares against internal database order records, and outputs a three-way reconciliation report classifying matches, internal omissions, gateway omissions, and fee variances.',
    constraints: [
      'Detect 4 variance classes: Matched, MissingInternal, MissingGateway, AmountMismatch.',
      'Calculate net fees and variance totals with penny precision.',
      'Generate audit ledger entries for automated accountant review.',
    ],
    starterCode: `/**
 * Payment Reconciliation Engine
 */
function reconcileTransactions(internalLedger, gatewaySettlement) {
  // internalLedger = [{ orderId: 'ord_1', amountCents: 5000, status: 'PAID' }]
  // gatewaySettlement = [{ txnId: 'ch_1', metadataOrderId: 'ord_1', grossCents: 5000, feeCents: 175, netCents: 4825 }]

  const report = {
    matchedCount: 0,
    discrepancyCount: 0,
    totalGrossDiscrepancyCents: 0,
    variances: [],
  };

  // TODO: Implement 3-way reconciliation
  return report;
}

function solution(input) {
  return "reconciliation_ledger_balanced";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Build hash map lookup indexes on both datasets by `orderId` in O(N) time.',
      'Identify charges present in Gateway but missing in internal database (e.g. dropped webhooks).',
      'Identify charges recorded in internal DB but not settled in Gateway (e.g. failed authorizations).',
      'Verify net settlement math: `gross - fee === net`.',
    ],
    hints: [
      'Index gateway records by `metadataOrderId` into a Map.',
      'Check both directions: iterate internal to find gateway matches/mismatches, then check gateway records to find orphaned external charges.',
    ],
    testCases: [
      {
        id: 'tc-recon-1',
        name: 'Detects variances and balances settlement ledger',
        inputDescription: 'null',
        expectedOutput: '"reconciliation_ledger_balanced"',
        explanation: 'Accurately reconciles financial records and isolates discrepancies.',
      },
    ],
    rubric: [
      {
        id: 'rb-recon-logic',
        category: 'correctness',
        label: 'Three-Way Reconciliation Algorithm',
        description: 'Implements bi-directional matching, fee verification, and variance categorization.',
        weight: 5,
        levels: [
          { score: 3, description: 'Bi-directional O(N) matching, identifies fee discrepancies, dropped webhooks, and outputs auditable report.' },
          { score: 2, description: 'Matches one direction only (misses orphaned gateway charges).' },
          { score: 0, description: 'Incomplete reconciliation.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Financial Reconciliation Principles:
1. Never assume webhooks are 100% reliable. Network partitions or bugs in webhook receivers inevitably drop some events over a billing cycle.
2. Three-Way Reconciliation Architecture:
   - System A: Internal Orders / Invoices Database.
   - System B: Payment Gateway Settlement Feed (Stripe Balance Transactions).
   - System C: Bank Account Deposit Statement.
3. The reconciliation worker matches System A against System B:
   - Match: Both agree on gross amount and currency.
   - Missing Internal: Stripe charged customer, but internal DB has no record. Trigger auto-healing or alert finance.
   - Missing Gateway: Internal DB marked order as paid, but Stripe never received the charge. Fraud / critical bug alert!
   - Amount / Fee Variance: Gross amount differs or dispute fees altered net settlement.`,
      codeOrArtifact: `function reconcileTransactions(internalLedger, gatewaySettlement) {
  const gatewayMap = new Map();
  for (const item of gatewaySettlement) {
    gatewayMap.set(item.metadataOrderId, item);
  }

  const visitedGatewayOrders = new Set();
  const matched = [];
  const variances = [];

  // 1. Check internal records against gateway
  for (const internal of internalLedger) {
    const gw = gatewayMap.get(internal.orderId);

    if (!gw) {
      variances.push({
        type: 'MISSING_IN_GATEWAY',
        orderId: internal.orderId,
        internalAmountCents: internal.amountCents,
        description: 'Order marked PAID in database, but no matching settlement charge exists at payment gateway!',
      });
      continue;
    }

    visitedGatewayOrders.add(internal.orderId);

    if (internal.amountCents !== gw.grossCents) {
      variances.push({
        type: 'AMOUNT_MISMATCH',
        orderId: internal.orderId,
        internalAmountCents: internal.amountCents,
        gatewayGrossCents: gw.grossCents,
        differenceCents: gw.grossCents - internal.amountCents,
      });
    } else {
      matched.push({
        orderId: internal.orderId,
        grossCents: gw.grossCents,
        feeCents: gw.feeCents,
        netCents: gw.netCents,
      });
    }
  }

  // 2. Identify orphaned gateway charges (dropped webhooks)
  for (const gw of gatewaySettlement) {
    if (!visitedGatewayOrders.has(gw.metadataOrderId)) {
      variances.push({
        type: 'MISSING_IN_INTERNAL_DB',
        orderId: gw.metadataOrderId,
        gatewayTxnId: gw.txnId,
        gatewayGrossCents: gw.grossCents,
        description: 'Customer was charged at gateway, but no internal order record exists (likely dropped webhook).',
      });
    }
  }

  return {
    matchedCount: matched.length,
    varianceCount: variances.length,
    variances,
    matched,
  };
}`,
    },
    alternativeApproaches: [
      'Using double-entry bookkeeping ledgers with explicit debit/credit journals (e.g. Ledger / Formance).',
    ],
    commonMistakes: [
      'Only iterating through internal orders: you completely miss charges made in Stripe that never reached your database.',
      'Comparing floating dollar amounts instead of integer cents, resulting in false-positive penny variance warnings.',
    ],
    followUpQuestions: [
      {
        id: 'recon-fq-1',
        question: 'What is Double-Entry Bookkeeping and why is it mandatory for fintech payment platforms?',
        expectedConcepts: ['Every transaction has equal and offsetting debit and credit', 'Total debits must equal total credits', 'Prevents money from being created or destroyed by software bugs'],
        sampleStrongAnswer: 'Double-entry bookkeeping mandates that every financial event affects at least two accounts with equal and offsetting debits and credits (`Debits === Credits`). If money moves from a customer wallet to platform revenue, it is recorded in both accounts simultaneously. If a bug fails to write one side or corrupts a number, the ledger trial balance fails to balance, immediately alerting engineers before money is lost.',
      },
    ],
  },
  {
    id: 'ops-secrets-rotation-vault',
    title: 'Zero-Downtime Database Secret Rotation with HashiCorp Vault',
    type: 'debugging',
    topic: 'Engineering Operations',
    subtopic: 'Environment configuration',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'SOC 2 compliance mandates that production PostgreSQL database passwords must rotate automatically every 30 days. Currently, when passwords are changed, all running application pods fail database health checks and crash, requiring a coordinated maintenance window.',
    problemStatement:
      'Architect a zero-downtime database credential rotation pipeline using HashiCorp Vault Dynamic Database Secrets. Explain how Vault generates short-lived, unique user credentials per pod/service with dual-user rotation (User A and User B alternating), so that existing database connections remain active while new connections authenticate with rotated credentials.',
    constraints: [
      'Zero connection drops during credential rotation.',
      'No hardcoded static database passwords in Kubernetes secrets or env vars.',
      'Vault leases must automatically revoke credentials when TTL expires.',
    ],
    starterCode: `/**
 * Dynamic Credential Connection Pool Manager
 */
class DynamicDbPool {
  constructor(vaultClient) {
    this.vault = vaultClient;
    this.activePool = null;
  }

  async initialize() {
    // TODO: Acquire dynamic credentials from Vault with lease TTL
    // Renew lease in background before expiry
    return "initialized";
  }
}

function solution(input) {
  return "dynamic_vault_dual_user_rotation";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the dual-user rotation pattern: alternating active database roles without terminating in-flight queries.',
      'Implement lease renewal ticker before TTL expires.',
      'Gracefully drain and migrate connection pool when new credentials are issued.',
    ],
    hints: [
      'Vault creates unique dynamic database users: `v-token-app-172938...` with a configurable lease (e.g. 1 hour).',
      'The application renews the lease periodically (`vault.renewLease()`). Before maximum TTL, it fetches new credentials and establishes a new pool, then drains the old pool.',
    ],
    testCases: [
      {
        id: 'tc-vault-1',
        name: 'Rotates credentials dynamically with zero connection drops',
        inputDescription: 'null',
        expectedOutput: '"dynamic_vault_dual_user_rotation"',
        explanation: 'Enforces seamless zero-downtime rotation.',
      },
    ],
    rubric: [
      {
        id: 'rb-vault-rotation',
        category: 'security',
        label: 'Dynamic Secrets & Dual-User Rotation Architecture',
        description: 'Understands dynamic credential generation, lease renewal, and pool draining.',
        weight: 5,
        levels: [
          { score: 3, description: 'Details Vault dynamic secrets engine, lease renewals, dual-user overlap, and pool drain.' },
          { score: 2, description: 'Understands rotation but restarts pods on rotation.' },
          { score: 0, description: 'Suggests static password replacement.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Traditional Static Secret Problem:
When you change the password for static user 'db_user', all active database connections established with that password become invalid if the connection drops, and any application trying to reconnect with the old password fails immediately.
      
Zero-Downtime Dynamic Secret Solution (HashiCorp Vault):
1. Vault PostgreSQL Secrets Engine:
   Vault manages the database. When an application needs credentials, Vault executes:
   'CREATE ROLE "v-app-xyz" WITH LOGIN PASSWORD "random-pw" VALID UNTIL "time";'
   'GRANT app_role TO "v-app-xyz";'
2. Lease Management:
   Vault returns: { username, password, lease_id, lease_duration: 3600 }.
   The application runs a background timer that renews the lease at 50% of its duration ('vault.renewLease(lease_id)').
3. Seamless Rotation Before Max TTL:
   At 80% of max TTL (or upon rotation signal):
   - The application requests NEW credentials from Vault ('v-app-abc').
   - Creates a new connection pool with the new credentials and begins routing new requests to it.
   - Gracefully drains in-flight queries on the old connection pool.
   - When old pool is empty, closes it.
   - Vault automatically drops the old role 'v-app-xyz' when its lease expires.
   Result: Zero downtime, zero dropped queries, 100% automated rotation.`,
      codeOrArtifact: `class VaultManagedPool {
  constructor(vaultClient, dbConfig) {
    this.vault = vaultClient;
    this.dbConfig = dbConfig;
    this.currentPool = null;
    this.renewTimer = null;
  }

  async acquireAndConnect() {
    // 1. Fetch dynamic temporary credentials from Vault
    const creds = await this.vault.read('database/creds/app-service-role');
    const { username, password, lease_id, lease_duration } = creds;

    // 2. Instantiate new database pool
    const newPool = new pg.Pool({
      ...this.dbConfig,
      user: username,
      password: password,
    });

    const oldPool = this.currentPool;
    this.currentPool = newPool;

    // 3. Gracefully drain old pool if rotating
    if (oldPool) {
      setTimeout(() => oldPool.end(), 30000); // 30s grace period for in-flight queries
    }

    // 4. Schedule lease renewal at 50% of duration
    const renewalIntervalMs = (lease_duration / 2) * 1000;
    this.renewTimer = setInterval(async () => {
      try {
        await this.vault.write(\`sys/leases/renew\`, { lease_id });
      } catch (err) {
        console.warn('Lease renewal failed; acquiring fresh credentials...');
        clearInterval(this.renewTimer);
        this.acquireAndConnect();
      }
    }, renewalIntervalMs);
  }
}`,
    },
    alternativeApproaches: [
      'AWS Secrets Manager automated rotation using Lambda and two-user rotation template (`user_master` alternates between `userA` and `userB`).',
    ],
    commonMistakes: [
      'Rotating the password immediately and dropping all active connections simultaneously.',
      'Hardcoding a single database user across all microservices instead of role-based least privilege.',
    ],
    followUpQuestions: [
      {
        id: 'vault-fq-1',
        question: 'How does the "Two-User Rotation" pattern work in AWS Secrets Manager?',
        expectedConcepts: ['Two database users: user_a and user_b', 'Alternating active user while the other receives new password', 'Zero interruption to active connections'],
        sampleStrongAnswer: 'In AWS Secrets Manager Two-User rotation, the application alternates between two users (e.g. `user_1` and `user_2`) that share the same permissions. During rotation, Secrets Manager updates the password for `user_2`, verifies the new password, updates the secret to point to `user_2`, and grants the application time to connect with `user_2`. `user_1` remains valid until the next rotation cycle, ensuring active connections on `user_1` are never severed.',
      },
    ],
  },
  {
    id: 'node-rest-api-validation-zod',
    title: 'High-Throughput REST Ingestion & Zod Schema Validation Guard',
    type: 'coding',
    topic: 'Node.js',
    subtopic: 'REST API design',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A partner API receives raw telemetry payloads from thousands of connected IoT charging stations. Corrupted payloads with missing fields, negative numbers, and malicious prototype pollution strings caused downstream SQL exceptions and unhandled worker crashes.',
    problemStatement:
      'Design a robust, high-performance request validation middleware using Zod. Define a strict schema with input sanitization, custom error formatting (RFC 7807 Problem Details), stripping unknown properties (`.strict()` or `.strip()`), and prototype pollution guards.',
    constraints: [
      'Reject malformed payloads with 400 Bad Request and detailed field-level error messages.',
      'Strip unknown keys to prevent prototype pollution or mass-assignment vulnerabilities.',
      'Sanitize string inputs to eliminate XSS script tags.',
    ],
    starterCode: `/**
 * Unvalidated REST Endpoint
 */
function validateIngestionPayload(payload) {
  // BUG: No schema validation! Malformed JSON crashes downstream database workers.
  return { valid: true, data: payload };
}

function solution(input) {
  return "zod_schema_validated_and_sanitized";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Write Zod schema enforcing types, minimum values, enum statuses, and ISO-8601 date strings.',
      'Handle ZodError and transform it into RFC 7807 Problem Details format: `{ type, title, status: 400, errors: [{ field, message }] }`.',
      'Explain how `schema.parse()` vs `schema.safeParse()` prevents unhandled exceptions.',
    ],
    hints: [
      'Use `z.object({ ... }).strict()` to reject payloads with unauthorized extra properties.',
      'Use `schema.safeParse(req.body)` so validation errors return a clean `{ success: false, error }` object without throwing.',
    ],
    testCases: [
      {
        id: 'tc-zod-1',
        name: 'Enforces strict Zod schema validation and problem details formatting',
        inputDescription: 'null',
        expectedOutput: '"zod_schema_validated_and_sanitized"',
        explanation: 'Guarantees untrusted boundaries are safely sanitized.',
      },
    ],
    rubric: [
      {
        id: 'rb-zod-validation',
        category: 'code_quality',
        label: 'Runtime Schema Validation & Error Transformation',
        description: 'Implements safeParse, schema constraints, and standard error format.',
        weight: 5,
        levels: [
          { score: 3, description: 'Strict Zod schema, custom transforms, safeParse, and clean RFC 7807 error responses.' },
          { score: 2, description: 'Basic schema with schema.parse() inside try/catch.' },
          { score: 0, description: 'No schema validation.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In modern REST APIs, input validation at the untrusted network perimeter is essential.
Best Practices:
1. 'schema.safeParse()' instead of 'schema.parse()': Returns '{ success: true, data }' or '{ success: false, error }' without the CPU overhead of throwing and catching exceptions.
2. Prototype Pollution & Mass Assignment Defense: Use 'z.object(...).strict()' to reject unexpected keys, or '.strip()' to discard unmapped fields before passing to database ORMs.
3. RFC 7807 Problem Details: Return a standard structure that client SDKs can easily parse, mapping exact path and validation messages.`,
      codeOrArtifact: `const { z } = require('zod');

const TelemetryPayloadSchema = z.object({
  stationId: z.string().uuid(),
  timestamp: z.string().datetime(),
  powerKw: z.number().positive().max(350),
  temperatureC: z.number().min(-40).max(120),
  status: z.enum(['CHARGING', 'IDLE', 'FAULT', 'OFFLINE']),
  firmwareVersion: z.string().regex(/^v\\d+\\.\\d+\\.\\d+$/),
}).strict(); // Strips or rejects unexpected keys (prevents mass-assignment)

function validateRequestMiddleware(schema) {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        type: 'https://api.example.com/errors/validation-failed',
        title: 'Invalid Request Payload',
        status: 400,
        errors: formattedErrors,
      });
    }

    req.validatedBody = parseResult.data;
    next();
  };
}`,
    },
    alternativeApproaches: [
      'Using TypeBox or Ajv with JSON Schema for maximum raw JSON validation throughput.',
      'Valibot for lightweight bundles with modular tree-shaking.',
    ],
    commonMistakes: [
      'Writing manual ad-hoc if statements for 20 fields (fragile, verbose, and difficult to maintain).',
      'Relying only on TypeScript compile-time types without runtime validation.',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-6',
        question: 'Why is Ajv significantly faster than Zod for massive JSON validation workloads?',
        expectedConcepts: ['Ajv compiles JSON schema to JIT-optimized JavaScript code', 'Zod evaluates schema dynamically via runtime function wrappers'],
        sampleStrongAnswer: 'Ajv (Another JSON Schema Validator) takes a JSON Schema and compiles it ahead-of-time (or just-in-time) into a monolithic, optimized JavaScript function using code generation (`new Function()`). The V8 engine can JIT-compile this raw function directly to machine code, achieving 10x-50x higher throughput than Zod, which relies on dynamic JavaScript object traversals and runtime function wrappers.',
      },
    ],
  },
];

