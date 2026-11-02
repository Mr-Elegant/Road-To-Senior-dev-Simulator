# Reference: Lead Engineer Interview: 45-Minute Outage Facilitation & Blameless Post-Mortem

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Engineering Leadership Playbook:\n1. Handling Punitive Leadership & Blameless Post-Mortem:\n- State clearly to leadership: \"If our architecture and deployment pipelines permit a single engineer to take down production with a standard pull request, our engineering safety systems have failed. Blaming or punishing the individual will only incentivize engineers to hide mistakes and slow innovation to a crawl. Our goal is to make this failure structurally impossible for anyone to repeat.\"\n\n2. The 5 Whys Analysis:\n- Why did the site go down? Because the database connection pool was exhausted and queries timed out.\n- Why were queries timing out? Because an ALTER TABLE migration held an AccessExclusiveLock on the 'users' table.\n- Why did it hold an exclusive lock? Because dropping the index was executed synchronously without lock timeouts.\n- Why was it deployed during peak hours without lock timeouts? Because developers do not have automated guardrails checking migration safety in CI.\n- Why were there no automated checks in CI? Because the team has treated migration review as a manual discipline rather than automated engineering policy.\n\n3. Action Items Matrix:\n- PREVENT (Engineering Guardrails):\n  - Integrate 'strong_migrations' or 'sqlfluff' in CI: automatically fails PR if a migration drops indexes without CONCURRENTLY or adds columns with blocking defaults.\n  - Set global database 'lock_timeout = 2s' in migration connections so migrations abort harmlessly rather than queueing behind long transactions.\n- DETECT (Observability):\n  - Add Prometheus alert on 'pg_stat_activity' for queries waiting on lock acquisition > 10 seconds.\n- MITIGATE (Resilience):\n  - Isolate web traffic from migrations: enforce migrations execute via automated pre-deployment jobs before traffic switch.",
    "codeOrArtifact": "Post-Mortem Executive Summary:\nIncident Date: 2026-10-31\nDuration: 45 minutes\nImpact: $350k estimated revenue delay, 12,000 active sessions dropped.\n\nRoot Cause: \nAn unthrottled index drop acquired an AccessExclusiveLock on the users table. Incoming web queries queued behind the lock, quickly exhausting the 200-connection pool and rendering API gateways unable to service traffic.\n\nPreventative Fix:\n1. Implemented lock_timeout = 2000ms on all migration runners.\n2. Added automated CI linter blocking dangerous schema operations.\n3. Created automated kill-switch runbook to terminate blocking lock queries within 30 seconds."
  },
  "rubric": [
    {
      "id": "rb-postmortem-blameless",
      "category": "tradeoffs",
      "label": "Blameless Culture & Executive Leadership",
      "description": "Defends systemic safety over individual blame; re-frames incident to systemic resilience.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Articulates blameless post-mortem tenets, models psychological safety, educates executive stakeholders."
        },
        {
          "score": 1,
          "description": "Suggests requiring manager sign-off for all PRs (bureaucratic anti-pattern)."
        },
        {
          "score": 0,
          "description": "Assigns blame to junior engineer."
        }
      ]
    },
    {
      "id": "rb-postmortem-action-items",
      "category": "reliability",
      "label": "Action Item Quality & Defense-in-Depth",
      "description": "Implements automated CI linter guards, timeout safeguards, and runbooks.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Categorizes Action Items: Automated CI migration checks, lock_timeout guards, automated runbooks."
        },
        {
          "score": 2,
          "description": "Action items only suggest \"write more tests\" or \"be more careful\"."
        },
        {
          "score": 0,
          "description": "No concrete technical guardrails."
        }
      ]
    }
  ],
  "alternatives": [
    "Using blue/green database deployments with logical replication."
  ],
  "commonMistakes": [
    "Creating manual approval committees or adding 5 more people to review PRs (creates bureaucratic drag without fixing systemic issues).",
    "Failing to establish a hard lock_timeout in PostgreSQL."
  ],
  "followUps": [
    {
      "id": "lead-fq-1",
      "question": "Why is `lock_timeout` the single most critical configuration parameter when running PostgreSQL migrations in production?",
      "expectedConcepts": [
        "Queued locks block all subsequent reads/writes behind them",
        "Default lock_timeout is 0 (infinite)",
        "Short lock_timeout aborts migration harmlessly"
      ],
      "sampleStrongAnswer": "In PostgreSQL, when an ALTER TABLE requests an `AccessExclusiveLock`, it waits in the lock queue until existing active queries finish. However, once in the queue, it blocks all subsequent reads and writes behind it! If `lock_timeout` is 0 (the default, infinite), a single slow query will cause the migration to wait forever, backing up all incoming web requests and taking down production in seconds. Setting `SET lock_timeout = \"2s\"` ensures the migration aborts safely if it cannot acquire the lock immediately."
    }
  ]
}
```
