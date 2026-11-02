# Reference: High-Throughput REST Ingestion & Zod Schema Validation Guard

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In modern REST APIs, input validation at the untrusted network perimeter is essential.\nBest Practices:\n1. 'schema.safeParse()' instead of 'schema.parse()': Returns '{ success: true, data }' or '{ success: false, error }' without the CPU overhead of throwing and catching exceptions.\n2. Prototype Pollution & Mass Assignment Defense: Use 'z.object(...).strict()' to reject unexpected keys, or '.strip()' to discard unmapped fields before passing to database ORMs.\n3. RFC 7807 Problem Details: Return a standard structure that client SDKs can easily parse, mapping exact path and validation messages.",
    "codeOrArtifact": "const { z } = require('zod');\n\nconst TelemetryPayloadSchema = z.object({\n  stationId: z.string().uuid(),\n  timestamp: z.string().datetime(),\n  powerKw: z.number().positive().max(350),\n  temperatureC: z.number().min(-40).max(120),\n  status: z.enum(['CHARGING', 'IDLE', 'FAULT', 'OFFLINE']),\n  firmwareVersion: z.string().regex(/^v\\d+\\.\\d+\\.\\d+$/),\n}).strict(); // Strips or rejects unexpected keys (prevents mass-assignment)\n\nfunction validateRequestMiddleware(schema) {\n  return (req, res, next) => {\n    const parseResult = schema.safeParse(req.body);\n\n    if (!parseResult.success) {\n      const formattedErrors = parseResult.error.errors.map((e) => ({\n        field: e.path.join('.'),\n        message: e.message,\n      }));\n\n      return res.status(400).json({\n        type: 'https://api.example.com/errors/validation-failed',\n        title: 'Invalid Request Payload',\n        status: 400,\n        errors: formattedErrors,\n      });\n    }\n\n    req.validatedBody = parseResult.data;\n    next();\n  };\n}"
  },
  "rubric": [
    {
      "id": "rb-zod-validation",
      "category": "code_quality",
      "label": "Runtime Schema Validation & Error Transformation",
      "description": "Implements safeParse, schema constraints, and standard error format.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Strict Zod schema, custom transforms, safeParse, and clean RFC 7807 error responses."
        },
        {
          "score": 2,
          "description": "Basic schema with schema.parse() inside try/catch."
        },
        {
          "score": 0,
          "description": "No schema validation."
        }
      ]
    }
  ],
  "alternatives": [
    "Using TypeBox or Ajv with JSON Schema for maximum raw JSON validation throughput.",
    "Valibot for lightweight bundles with modular tree-shaking."
  ],
  "commonMistakes": [
    "Writing manual ad-hoc if statements for 20 fields (fragile, verbose, and difficult to maintain).",
    "Relying only on TypeScript compile-time types without runtime validation."
  ],
  "followUps": [
    {
      "id": "node-fq-6",
      "question": "Why is Ajv significantly faster than Zod for massive JSON validation workloads?",
      "expectedConcepts": [
        "Ajv compiles JSON schema to JIT-optimized JavaScript code",
        "Zod evaluates schema dynamically via runtime function wrappers"
      ],
      "sampleStrongAnswer": "Ajv (Another JSON Schema Validator) takes a JSON Schema and compiles it ahead-of-time (or just-in-time) into a monolithic, optimized JavaScript function using code generation (`new Function()`). The V8 engine can JIT-compile this raw function directly to machine code, achieving 10x-50x higher throughput than Zod, which relies on dynamic JavaScript object traversals and runtime function wrappers."
    }
  ]
}
```
