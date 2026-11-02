# Reference: Global Multi-Channel Notification Platform (50M Events/Day)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Architecture Blueprint:\n1. Ingestion Layer:\n- Clients & Microservices call 'POST /v1/notifications' via API Gateway (mTLS & API Key authentication).\n- Ingestion Service validates payload, generates a unique idempotency/dedup hash, checks Redis for deduplication ('SET dedup:{userId}:{hash} 1 NX EX 900'). If key exists, return 200 OK with status \"DEDUPLICATED\".\n\n2. Priority Queues (Kafka / SQS):\n- NEVER use a single FIFO queue. Use separate topics:\n  - Topic 'notifications.p0.transactional' (OTPs, Security Alerts, Payment Receipts)\n  - Topic 'notifications.p1.account' (Password changed, shipping updates)\n  - Topic 'notifications.p2.marketing' (Promotions, newsletter blasts)\n- Dedicated worker pools scale independently. Even if P2 has 20M queued messages, P0 workers immediately consume transactional messages with < 100ms lag.\n\n3. Preference & State Engine:\n- Worker queries User Preference Cache (Redis) containing opt-ins, quiet hours (e.g. 22:00 - 08:00 user local time), and frequency caps.\n- If in quiet hours and priority is P2: Delay delivery until morning using delayed message exchange. If P0: bypass quiet hours.\n\n4. Channel Dispatchers:\n- Push Dispatcher: APNs (HTTP/2 persistent connections) & FCM. Handles APNs feedback service to delete invalid device tokens from DB.\n- Email Dispatcher: SendGrid / AWS SES with template rendering.\n- SMS Dispatcher: Twilio / Infobip with fallback to AWS SNS.\n\n5. Dead Letter Queue & Observability:\n- Retries with exponential backoff and full jitter. If 3 retries fail, message routes to DLQ for engineer alert and inspection.",
    "codeOrArtifact": "API Specification:\nPOST /v1/notifications/send\nHeaders:\n  Authorization: Bearer <token>\n  Idempotency-Key: <uuid>\nPayload:\n{\n  \"recipientId\": \"user_987123\",\n  \"priority\": \"P0\", // P0 = Transactional, P1 = Important, P2 = Marketing\n  \"channels\": [\"PUSH\", \"SMS\"],\n  \"templateId\": \"tmpl_otp_verification\",\n  \"templateData\": {\n    \"code\": \"482910\",\n    \"expiresInMinutes\": 5\n  },\n  \"deduplicationWindowSeconds\": 300\n}\n\nResponse (202 Accepted):\n{\n  \"notificationId\": \"notif_01HXYZ1234\",\n  \"status\": \"QUEUED\",\n  \"estimatedDeliveryMs\": 450\n}"
  },
  "rubric": [
    {
      "id": "rb-arch-queues",
      "category": "tradeoffs",
      "label": "Priority Queueing & Ingestion Decoupling",
      "description": "Separates traffic into dedicated priority queues to protect transactional SLAs.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Dedicated priority queues (P0/P1/P2), worker auto-scaling, backpressure handling."
        },
        {
          "score": 2,
          "description": "Single queue with priority flags (causes head-of-line blocking)."
        },
        {
          "score": 0,
          "description": "Synchronous API calls without message queue."
        }
      ]
    },
    {
      "id": "rb-arch-dedup",
      "category": "reliability",
      "label": "Deduplication & Rate Limiting Strategy",
      "description": "Implements atomic Redis key checks and token bucket per user.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Redis SET NX EX deduplication, sliding window rate limits, quiet-hour timezone evaluation."
        },
        {
          "score": 2,
          "description": "Mentions rate limiting without concrete caching mechanism."
        },
        {
          "score": 0,
          "description": "No deduplication."
        }
      ]
    },
    {
      "id": "rb-arch-security",
      "category": "security",
      "label": "Data Privacy & Token Management",
      "description": "Protects PII in notification templates, handles expired push tokens from APNs/FCM feedback.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Masks PII, strips credentials, handles APNs BadDeviceToken feedback loops to clean DB."
        },
        {
          "score": 1,
          "description": "Stores tokens without cleanup."
        },
        {
          "score": 0,
          "description": "No consideration for device token invalidation."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Temporal.io / AWS Step Functions for complex multi-step delivery workflows (e.g. \"Send push; if unread after 10m, send SMS\")."
  ],
  "commonMistakes": [
    "Sending external emails/SMS synchronously inside the web request handler, locking client threads.",
    "Using a single queue: marketing blasts drown out password resets and payment confirmation emails."
  ],
  "followUps": [
    {
      "id": "sys-fq-1",
      "question": "How do you handle APNs (Apple Push Notification) invalid device token errors in production?",
      "expectedConcepts": [
        "HTTP/2 410 Gone / BadDeviceToken response",
        "Feedback service",
        "Asynchronously prune or deactivate token in DB"
      ],
      "sampleStrongAnswer": "APNs returns HTTP status `410 Gone` with reason `BadDeviceToken` or `Unregistered` when a user uninstalls the app. The Push Dispatcher must capture this error and publish a `device_token.deactivated` event so the user profile service removes or flags the token as inactive. Continuing to send to invalid tokens causes Apple to throttle or ban your push certificate."
    }
  ]
}
```
