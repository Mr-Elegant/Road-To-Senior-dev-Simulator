# Reference: Zero-Downtime Database Secret Rotation with HashiCorp Vault

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Traditional Static Secret Problem:\nWhen you change the password for static user 'db_user', all active database connections established with that password become invalid if the connection drops, and any application trying to reconnect with the old password fails immediately.\n      \nZero-Downtime Dynamic Secret Solution (HashiCorp Vault):\n1. Vault PostgreSQL Secrets Engine:\n   Vault manages the database. When an application needs credentials, Vault executes:\n   'CREATE ROLE \"v-app-xyz\" WITH LOGIN PASSWORD \"random-pw\" VALID UNTIL \"time\";'\n   'GRANT app_role TO \"v-app-xyz\";'\n2. Lease Management:\n   Vault returns: { username, password, lease_id, lease_duration: 3600 }.\n   The application runs a background timer that renews the lease at 50% of its duration ('vault.renewLease(lease_id)').\n3. Seamless Rotation Before Max TTL:\n   At 80% of max TTL (or upon rotation signal):\n   - The application requests NEW credentials from Vault ('v-app-abc').\n   - Creates a new connection pool with the new credentials and begins routing new requests to it.\n   - Gracefully drains in-flight queries on the old connection pool.\n   - When old pool is empty, closes it.\n   - Vault automatically drops the old role 'v-app-xyz' when its lease expires.\n   Result: Zero downtime, zero dropped queries, 100% automated rotation.",
    "codeOrArtifact": "class VaultManagedPool {\n  constructor(vaultClient, dbConfig) {\n    this.vault = vaultClient;\n    this.dbConfig = dbConfig;\n    this.currentPool = null;\n    this.renewTimer = null;\n  }\n\n  async acquireAndConnect() {\n    // 1. Fetch dynamic temporary credentials from Vault\n    const creds = await this.vault.read('database/creds/app-service-role');\n    const { username, password, lease_id, lease_duration } = creds;\n\n    // 2. Instantiate new database pool\n    const newPool = new pg.Pool({\n      ...this.dbConfig,\n      user: username,\n      password: password,\n    });\n\n    const oldPool = this.currentPool;\n    this.currentPool = newPool;\n\n    // 3. Gracefully drain old pool if rotating\n    if (oldPool) {\n      setTimeout(() => oldPool.end(), 30000); // 30s grace period for in-flight queries\n    }\n\n    // 4. Schedule lease renewal at 50% of duration\n    const renewalIntervalMs = (lease_duration / 2) * 1000;\n    this.renewTimer = setInterval(async () => {\n      try {\n        await this.vault.write(`sys/leases/renew`, { lease_id });\n      } catch (err) {\n        console.warn('Lease renewal failed; acquiring fresh credentials...');\n        clearInterval(this.renewTimer);\n        this.acquireAndConnect();\n      }\n    }, renewalIntervalMs);\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-vault-rotation",
      "category": "security",
      "label": "Dynamic Secrets & Dual-User Rotation Architecture",
      "description": "Understands dynamic credential generation, lease renewal, and pool draining.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Details Vault dynamic secrets engine, lease renewals, dual-user overlap, and pool drain."
        },
        {
          "score": 2,
          "description": "Understands rotation but restarts pods on rotation."
        },
        {
          "score": 0,
          "description": "Suggests static password replacement."
        }
      ]
    }
  ],
  "alternatives": [
    "AWS Secrets Manager automated rotation using Lambda and two-user rotation template (`user_master` alternates between `userA` and `userB`)."
  ],
  "commonMistakes": [
    "Rotating the password immediately and dropping all active connections simultaneously.",
    "Hardcoding a single database user across all microservices instead of role-based least privilege."
  ],
  "followUps": [
    {
      "id": "vault-fq-1",
      "question": "How does the \"Two-User Rotation\" pattern work in AWS Secrets Manager?",
      "expectedConcepts": [
        "Two database users: user_a and user_b",
        "Alternating active user while the other receives new password",
        "Zero interruption to active connections"
      ],
      "sampleStrongAnswer": "In AWS Secrets Manager Two-User rotation, the application alternates between two users (e.g. `user_1` and `user_2`) that share the same permissions. During rotation, Secrets Manager updates the password for `user_2`, verifies the new password, updates the secret to point to `user_2`, and grants the application time to connect with `user_2`. `user_1` remains valid until the next rotation cycle, ensuring active connections on `user_1` are never severed."
    }
  ]
}
```
