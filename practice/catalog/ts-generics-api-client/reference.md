# Reference: Type-Safe RPC/REST Client with Path Parameter Inference

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "TypeScript 4.1+ introduced Template Literal Types and recursive conditional types. We can parse string patterns by combining 'infer' with template literals.\nWe split the string at ':'. Whatever follows up to the next '/' is a parameter name. We union that with the recursive extraction of the remaining string. When no further ':' tokens exist, we return Record<string, never>.",
    "codeOrArtifact": "export type ExtractRouteParams<T extends string> =\n  T extends `${string}:${infer Param}/${infer Rest}`\n    ? { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>\n    : T extends `${string}:${infer Param}`\n    ? { [K in Param]: string }\n    : Record<string, never>;\n\nexport type RouteArgs<T extends string> = keyof ExtractRouteParams<T> extends never\n  ? [path: T]\n  : [path: T, params: { [K in keyof ExtractRouteParams<T>]: string }];\n\nexport class TypedApiClient {\n  async get<TPath extends string>(...args: RouteArgs<TPath>): Promise<string> {\n    const [path, params] = args;\n    if (!params) return path;\n\n    let resolved = path;\n    for (const [k, v] of Object.entries(params)) {\n      resolved = resolved.replace(`:${k}`, encodeURIComponent(String(v)));\n    }\n    return resolved;\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-template-literals",
      "category": "code_quality",
      "label": "Template Literal Type Recursion",
      "description": "Understands recursive string parsing in TypeScript compiler type system.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Accurately parses arbitrary number of route params recursively."
        },
        {
          "score": 2,
          "description": "Works for 1 or 2 params but fails with deeper nestings."
        },
        {
          "score": 0,
          "description": "Fails to implement template literal inference."
        }
      ]
    }
  ],
  "alternatives": [
    "Using OpenAPI generator / tRPC / ts-rest for complete full-stack contract sharing."
  ],
  "commonMistakes": [
    "Infinite recursion in type aliases leading to \"Type instantiation is excessively deep and possibly infinite\".",
    "Not supporting optional params when routes have no parameters."
  ],
  "followUps": [
    {
      "id": "ts-fq-2",
      "question": "How do you prevent type-level recursion limit errors when writing complex generic parsers?",
      "expectedConcepts": [
        "Tail-call recursion optimization in TypeScript 4.5+",
        "Accumulator tuple pattern"
      ],
      "sampleStrongAnswer": "TypeScript supports tail-call elimination in conditional types if the recursive call appears directly in the true branch without being wrapped in intersections or indexed types. Using an accumulator array or object allows TypeScript to recurse up to ~1,000 depths instead of halting at ~50."
    }
  ]
}
```
