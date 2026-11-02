# Reference: Custom Webhook Dispatcher AWS Metadata SSRF Vulnerability

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Server-Side Request Forgery (SSRF) occurs when an application fetches a remote resource without validating the destination address. In cloud environments (AWS, GCP, Azure), querying the link-local metadata address 'http://169.254.169.254' returns IAM instance credentials, API keys, and environment variables.\n      \nComprehensive Defense in Depth:\n1. URL Protocol Validation: Only allow 'http:' and 'https:'.\n2. DNS Resolution & Private IP Range Filtering:\n   Resolve hostname using 'dns.lookup()'. Check that the resolved IPv4/IPv6 is NOT in:\n   - 127.0.0.0/8 (Loopback)\n   - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (Private RFC 1918)\n   - 169.254.169.254 / 169.254.0.0/16 (Link-Local Cloud Metadata)\n   - ::1 / fc00::/7 (IPv6 private)\n3. DNS Rebinding Defense: Connect directly to the resolved and verified IP address, passing the original domain in the 'Host' header, or use an egress proxy like Envoy / Smokescreen.\n4. Cloud Guardrail: Enforce AWS IMDSv2 (requiring a PUT request with X-aws-ec2-metadata-token-ttl-seconds) which blocks basic GET-based SSRF.",
    "codeOrArtifact": "const dns = require('dns').promises;\nconst ipaddr = require('ipaddr.js');\n\nasync function sendWebhookNotificationSafe(targetUrl, payload) {\n  const parsed = new URL(targetUrl);\n  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {\n    throw new Error('Disallowed protocol');\n  }\n\n  // 1. Resolve DNS to physical IP\n  const lookup = await dns.lookup(parsed.hostname);\n  const addr = ipaddr.parse(lookup.address);\n\n  // 2. Reject private, loopback, link-local, or carrier-grade NAT IPs\n  const range = addr.range();\n  if (\n    range === 'loopback' ||\n    range === 'private' ||\n    range === 'linkLocal' || // Blocks 169.254.x.x\n    range === 'carrierGradeNat' ||\n    range === 'broadcast'\n  ) {\n    throw new Error(`Security Exception: SSRF attempt to private network address (${lookup.address})`);\n  }\n\n  // 3. Dispatch with custom agent pinned to validated IP and redirect disabled\n  return fetch(targetUrl, {\n    method: 'POST',\n    redirect: 'error', // Prevent 302 redirects from bypassing IP filter!\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(payload),\n  });\n}"
  },
  "rubric": [
    {
      "id": "rb-ssrf-rca",
      "category": "security",
      "label": "SSRF & Cloud Metadata Defense",
      "description": "Understands SSRF, DNS Rebinding, and IMDSv2 session token defenses.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Validates resolved IP, pins socket IP against DNS rebinding, enforces IMDSv2 and egress firewall rules."
        },
        {
          "score": 2,
          "description": "Checks IP range but vulnerable to DNS rebinding or redirects."
        },
        {
          "score": 0,
          "description": "Only checks string matching on URL."
        }
      ]
    }
  ],
  "alternatives": [
    "Routing all outbound webhook requests through a hardened forward-proxy (e.g. Stripe Smokescreen) with strict iptables egress rules."
  ],
  "commonMistakes": [
    "Following HTTP 302 redirects automatically: an attacker points their public domain to a server that returns `Location: http://169.254.169.254`, bypassing the initial IP check.",
    "Checking URL hostname without resolving DNS (e.g. testing `parsed.hostname !== \"169.254.169.254\"` which fails if the attacker uses an `attacker-controlled.com` domain pointing to that IP)."
  ],
  "followUps": [
    {
      "id": "sec-fq-3",
      "question": "Why does AWS IMDSv2 require a `PUT` request with custom headers instead of a simple `GET`?",
      "expectedConcepts": [
        "Most simple SSRF and HTML/form injection vulnerabilities cannot issue PUT requests with custom headers",
        "Blocks SSRF via image tags / simple fetch"
      ],
      "sampleStrongAnswer": "IMDSv2 requires callers to first issue an HTTP `PUT` request with the header `X-aws-ec2-metadata-token-ttl-seconds` to obtain a session token before requesting metadata. Because typical SSRF exploits (via open redirects, markdown images, or basic GET proxies) cannot manipulate HTTP methods or inject custom request headers, IMDSv2 completely neutralizes simple SSRF attacks."
    }
  ]
}
```
