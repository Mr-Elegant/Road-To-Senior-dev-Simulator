# Reference: Enterprise Multi-Tenant RBAC Authorization Type Narrowing

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Type predicates ('param is Type') instruct the TypeScript compiler to narrow the variable type when the predicate function returns true. However, because TypeScript cannot prove that the boolean expression inside the function body actually satisfies the target type, the developer must ensure that runtime checks are exhaustive.\n      \nIf a function states 'session is OrgScopedSession' but only checks 'session.role !== \"SUPER_ADMIN\"', a malformed session with 'tenantId: null' could pass through, causing runtime crashes or security vulnerabilities in downstream tenant database queries.",
    "codeOrArtifact": "export function isOrgScopedSession(session: UserSession): session is OrgScopedSession {\n  return (\n    (session.role === 'ORG_ADMIN' || session.role === 'ORG_MEMBER') &&\n    typeof session.tenantId === 'string' &&\n    session.tenantId.trim().length > 0\n  );\n}"
  },
  "rubric": [
    {
      "id": "rb-type-predicate",
      "category": "security",
      "label": "Type Guard Predicate Safety",
      "description": "Implements rigorous runtime checks matching the type predicate assertion.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Rigorously validates role and string tenantId, avoiding unsafe assumptions."
        },
        {
          "score": 2,
          "description": "Checks role only without verifying tenantId is non-null."
        },
        {
          "score": 0,
          "description": "Incorrect type predicate."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Discriminated Unions on a \"scope\" tag (scope: \"GLOBAL\" | \"ORG\").",
    "Using branded types for TenantId to prevent accidental substitution of user IDs for tenant IDs."
  ],
  "commonMistakes": [
    "Using type assertion \"as OrgScopedSession\" instead of a proper type guard.",
    "Forgetting to check for empty strings or undefined in tenantId."
  ],
  "followUps": [
    {
      "id": "ts-fq-3",
      "question": "What are Branded / Nominal Types in TypeScript and how do they enhance security?",
      "expectedConcepts": [
        "Nominal typing simulation",
        "Unique symbol brand tag",
        "Preventing string mixups (e.g. UserId vs TenantId)"
      ],
      "sampleStrongAnswer": "TypeScript is structurally typed, so two strings (like UserId and TenantId) are interchangeable. Branded types attach a unique private type tag (e.g. `type TenantId = string & { readonly __brand: unique symbol }`). This forces callers to go through a validation constructor before using the value in tenant-critical queries."
    }
  ]
}
```
