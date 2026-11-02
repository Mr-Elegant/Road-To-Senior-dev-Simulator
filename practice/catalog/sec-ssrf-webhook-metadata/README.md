# Custom Webhook Dispatcher AWS Metadata SSRF Vulnerability

Collection: catalog · ID: `sec-ssrf-webhook-metadata` · Mode: **guided**

## Business context

A B2B integration platform allows enterprise customers to register custom webhook callback URLs (e.g. `https://hooks.slack.com/...`). A penetration testing audit discovered that by submitting `http://169.254.169.254/latest/meta-data/iam/security-credentials/`, an attacker can exfiltrate AWS instance IAM credentials directly to their webhook receiver.

## Task

The webhook dispatcher executes `fetch(userSuppliedUrl)` directly from backend worker pods. The function lacks private IP filtering, DNS rebinding protection, and URL protocol restrictions, allowing Server-Side Request Forgery (SSRF) against internal VPC services and the cloud metadata API (169.254.169.254).

## Candidate tasks

- Explain the mechanics of SSRF and the AWS EC2 instance metadata service (IMDSv1 vs IMDSv2).
- Resolve the DNS hostname first, validate that the resolved IP address is NOT in private or loopback ranges.
- Explain DNS Rebinding attacks and how to pin the resolved IP in the HTTP agent socket connection.

## Constraints

- Must block requests to private IP ranges: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, and cloud metadata 169.254.169.254.
- Must protect against DNS Rebinding attacks (where a public domain resolves to a public IP on first check, but resolves to 169.254.169.254 when fetch executes).
- Only permit HTTPS / HTTP protocols; block `file://`, `gopher://`, `ftp://`.

## Follow-up questions

- Why does AWS IMDSv2 require a `PUT` request with custom headers instead of a simple `GET`?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
