# Reference: Production Incident: Cloud Provider IAM & Stripe Key Leak in CI Logs

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Security Incident Response Playbook:\n1. Immediate Containment (< 5 minutes):\n- Deactivate the compromised AWS IAM Access Key immediately in AWS Console / CLI:\n  'aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive'\n- Roll Stripe Secret Key in Stripe Dashboard (choose \"Roll key in 24 hours\" if active traffic exists, or \"Roll key immediately\" with emergency redeploy).\n- Invalidate all active AWS STS temporary sessions assumed via that IAM user:\n  Attach inline policy denying all actions before current timestamp ('aws:CurrentTime < 2026-10-31T17:00:00Z').\n\n2. Threat Identification & Eradication:\n- Query AWS CloudTrail:\n  Filter by 'eventSource == ec2.amazonaws.com' and 'userIdentity.accessKeyId == AKIA...'.\n- Check metrics: A spike of 8,400 ec2:RunInstances calls indicates cryptomining bots. Immediately terminate all unauthorized EC2 instances, delete rogue IAM users/roles, and revoke rogue security groups.\n\n3. Remediation & Long-Term Prevention:\n- Migrate completely away from static IAM keys to GitHub Actions OpenID Connect (OIDC). OIDC generates short-lived (15-minute) AWS STS tokens on-demand based on cryptographic repository claims.\n- Install pre-commit hooks ('gitleaks' or 'trufflehog') to block secrets from ever being committed.\n- Configure automated secret scanning in GitHub.",
    "codeOrArtifact": "/**\n * Secure GitHub Actions OIDC Workflow (Zero Static Keys)\n */\n/*\nname: Deploy Production\non:\n  push:\n    branches: [main]\n\npermissions:\n  id-token: write # Required for requesting JWT from GitHub OIDC provider\n  contents: read\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      # Assumes AWS IAM role using short-lived cryptographically signed token\n      - name: Configure AWS Credentials\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole\n          aws-region: us-east-1\n          audience: sts.amazonaws.com\n*/"
  },
  "rubric": [
    {
      "id": "rb-sec-containment",
      "category": "security",
      "label": "Emergency Credential Containment & Rotation",
      "description": "Immediately revokes compromised keys, rotates secrets, terminates malicious instances.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Immediate revocation in AWS/Stripe, audits CloudTrail for anomalies, terminates rogue instances, rotates secrets."
        },
        {
          "score": 2,
          "description": "Rotates keys but forgets to check CloudTrail for unauthorized resource creation."
        },
        {
          "score": 0,
          "description": "Deletes GitHub log without revoking actual keys."
        }
      ]
    },
    {
      "id": "rb-sec-oidc",
      "category": "code_quality",
      "label": "OIDC & Short-Lived Credentials Architecture",
      "description": "Replaces static credentials with OpenID Connect short-lived tokens and secret scanners.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Implements GitHub Actions OIDC role assumption (aws-actions/configure-aws-credentials) and pre-commit secret scanners."
        },
        {
          "score": 2,
          "description": "Re-adds keys as GitHub Secrets without migrating to OIDC."
        },
        {
          "score": 0,
          "description": "Leaves static keys."
        }
      ]
    }
  ],
  "alternatives": [
    "Using AWS Secrets Manager / HashiCorp Vault with dynamic secret engines for automated credential rotation."
  ],
  "commonMistakes": [
    "Deleting the GitHub log or making the repo private without rotating the keys (scrapers index keys within seconds).",
    "Creating a new key without deactivating the old compromised key."
  ],
  "followUps": [
    {
      "id": "ops-fq-2",
      "question": "How does GitHub Actions OpenID Connect (OIDC) authenticate to AWS without any stored passwords or keys?",
      "expectedConcepts": [
        "GitHub OIDC provider mints signed JWT",
        "AWS STS verifies GitHub signature via public OIDC discovery endpoint",
        "Validates repository claim before issuing short-lived credentials"
      ],
      "sampleStrongAnswer": "GitHub Actions mints a cryptographically signed JSON Web Token (JWT) containing claims about the repo, branch, and workflow. AWS STS receives this token, verifies GitHub's signature against GitHub's public OIDC JWKS keys, inspects the IAM trust policy condition (verifying repo matches `repo:my-org/my-repo:*`), and issues temporary 15-minute STS credentials without any shared secret stored anywhere in GitHub."
    }
  ]
}
```
