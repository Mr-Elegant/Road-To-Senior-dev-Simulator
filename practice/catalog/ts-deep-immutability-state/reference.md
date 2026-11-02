# Reference: Deep Readonly State Container with Lens-Based Immutability

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A robust DeepReadonly<T> must check types in specific precedence:\n1. Functions should remain unchanged (otherwise mapping over them strips call signatures).\n2. Arrays must be mapped to ReadonlyArray<DeepReadonly<Element>> so mutating methods like .push(), .pop(), and .splice() are banned by the compiler.\n3. Maps and Sets can optionally be mapped to ReadonlyMap and ReadonlySet.\n4. Plain objects map keys to readonly [K in keyof T]: DeepReadonly<T[K]>.\n5. Primitives pass through unchanged.",
    "codeOrArtifact": "export type DeepReadonly<T> = T extends (...args: any[]) => any\n  ? T\n  : T extends ReadonlyArray<infer R>\n  ? ReadonlyArray<DeepReadonly<R>>\n  : T extends ReadonlyMap<infer K, infer V>\n  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>\n  : T extends ReadonlySet<infer M>\n  ? ReadonlySet<DeepReadonly<M>>\n  : T extends object\n  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }\n  : T;"
  },
  "rubric": [
    {
      "id": "rb-deep-readonly",
      "category": "code_quality",
      "label": "Recursive Type Definition",
      "description": "DeepReadonly covers all core types without breaking function signatures.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Handles functions, arrays, objects, and primitives gracefully."
        },
        {
          "score": 2,
          "description": "Breaks when encountering arrays or functions."
        },
        {
          "score": 0,
          "description": "Non-recursive shallow readonly."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Immer.js with Draft<T> and Immutable<T> library types.",
    "Using Immutable.js Record and Map data structures."
  ],
  "commonMistakes": [
    "Applying object mapping to functions, turning methods into {} types.",
    "Forgetting that Array is also an object, mapping it to { [0]: ..., [1]: ... } instead of ReadonlyArray."
  ],
  "followUps": [
    {
      "id": "ts-fq-4",
      "question": "Does DeepReadonly prevent runtime mutations if someone casts with `as any`?",
      "expectedConcepts": [
        "Compile-time only",
        "Object.freeze() for shallow runtime",
        "Recursive deepFreeze() needed for runtime protection"
      ],
      "sampleStrongAnswer": "No, DeepReadonly is purely a compile-time constraint enforced by the TypeScript compiler. At runtime, JavaScript objects can still be mutated if someone bypasses type checking or if data is passed to external JS libraries. To enforce runtime immutability, one must use Object.freeze() recursively or use proxy-based copy-on-write tools like Immer."
    }
  ]
}
```
