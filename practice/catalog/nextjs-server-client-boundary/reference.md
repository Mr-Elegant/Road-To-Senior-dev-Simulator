# Reference: Secret Key Leakage Across Next.js Server-Client Boundary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In Next.js App Router, Server Components run on the server and render a virtual DOM stream (React Server Component Flight payload). When a Server Component renders a Client Component (marked with \"use client\"), all props passed to that Client Component are serialized into JSON strings and injected into the HTML stream (e.g. self.__next_f.push) so the client browser can hydrate the component.\n      \nIf a Server Component passes an object containing secretKey or database connection strings, those secrets become visible in the page source or DevTools Network tab to anyone visiting the page.\n      \nFix:\n1. Always project data into a dedicated client DTO containing only public fields: '{ publishableKey: config.publishableKey, currency: config.currency }'.\n2. In the server module that loads secrets, add 'import \"server-only\"'. If any developer accidentally imports this module into a client component, the build will fail immediately.",
    "codeOrArtifact": "// app/billing/page.tsx (Server Component)\nimport { getTenantPaymentConfig } from '@/lib/payment-db';\nimport PaymentSettingsForm from './PaymentSettingsForm';\n\nexport default async function BillingPage({ params }) {\n  const config = await getTenantPaymentConfig(params.tenantId);\n\n  // Project only public, safe fields for client consumption\n  const safeClientConfig = {\n    publishableKey: config.publishableKey,\n    defaultCurrency: config.currency,\n    isStripeConnected: Boolean(config.secretKey),\n  };\n\n  return (\n    <div>\n      <h1>Billing Configuration</h1>\n      <PaymentSettingsForm paymentConfig={safeClientConfig} />\n    </div>\n  );\n}"
  },
  "rubric": [
    {
      "id": "rb-rsc-security",
      "category": "security",
      "label": "RSC Boundary Serialization Understanding",
      "description": "Understands RSC serialization protocol and client bundle security risks.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Details the RSC flight payload serialization mechanism and prescribes server-only build guards."
        },
        {
          "score": 2,
          "description": "Knows not to pass secrets but unaware of how Next.js serializes props in HTML."
        },
        {
          "score": 0,
          "description": "Fails to recognize leak."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Server Actions for sensitive operations so secrets never touch the client at all.",
    "Using experimental taint API: `experimental_taintUniqueValue` or `experimental_taintObjectReference` in React/Next.js."
  ],
  "commonMistakes": [
    "Thinking \"use client\" components run only in the browser and cannot access server data: they receive whatever props the server passes to them.",
    "Naming secret environment variables with NEXT_PUBLIC_, which automatically bakes them into client JS bundles."
  ],
  "followUps": [
    {
      "id": "next-fq-1",
      "question": "What is React's `experimental_taintUniqueValue` and how does it prevent data leaks in Next.js?",
      "expectedConcepts": [
        "React taint API",
        "Throws runtime/build error if tainted value is passed to client",
        "Taints private tokens and hashes"
      ],
      "sampleStrongAnswer": "React's taint API allows developers to mark specific objects (`experimental_taintObjectReference`) or primitive values like tokens (`experimental_taintUniqueValue`) as forbidden from crossing into Client Components. If any server component attempts to pass a tainted value as a prop to a client component, React immediately throws an error during rendering."
    }
  ]
}
```
