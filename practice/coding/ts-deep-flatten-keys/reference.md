# Reference: Deep Nested Object Path Keys Union Type

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "type PathKeys<T> = T extends object\n  ? {\n      [K in keyof T & string]: T[K] extends object\n        ? K | `${K}.${PathKeys<T[K]>}`\n        : K;\n    }[keyof T & string]\n  : never;\n\nfunction getNestedValue(obj: any, path: string): any {\n  return path.split('.').reduce((acc, part) => acc && acc[part], obj);\n}\n\nfunction solution(path: string = 'auth.jwt.issuer') {\n  const config = {\n    auth: {\n      jwt: {\n        issuer: 'auth.enterprise.io',\n        expiry: '1h'\n      }\n    },\n    database: {\n      pool: {\n        max: 20\n      }\n    }\n  };\n\n  const val = getNestedValue(config, path || 'auth.jwt.issuer');\n  return typeof val === 'object' ? JSON.stringify(val) : String(val);\n}",
    "explanation": "Maps over string keys, recursively checking if the value is an object. If so, unions the current key with the key concatenated with recursive sub-paths.",
    "timeComplexity": "Compile-time type evaluation"
  }
}
```
