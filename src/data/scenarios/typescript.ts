import { Scenario } from '@/types/scenario';

export const typescriptScenarios: Scenario[] = [
  {
    id: 'ts-discriminated-unions-events',
    title: 'Multi-Gateway Webhook Event Normalization & Exhaustive Narrowing',
    type: 'coding',
    topic: 'TypeScript',
    subtopic: 'Discriminated unions',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A global subscription SaaS platform receives webhook events from Stripe, PayPal, and Adyen. Currently, developers use `any` casting, causing runtime crashes when payment gateway payload versions change or when unhandled event types slip through into billing ledger workers.',
    problemStatement:
      'Build a strongly-typed webhook event dispatch system using discriminated unions and an exhaustive checking utility (`assertNever`). The compiler must enforce that every possible payment event type is handled at compile time, rejecting any PR that adds a new event without an exhaustive handler.',
    constraints: [
      'Zero usage of `any` or loose `unknown` casts.',
      'Must enforce compile-time exhaustiveness: if a new event is added to the union, omission in the dispatcher must cause a TypeScript compilation error.',
      'Must provide type narrowing on `event.payload` based on `event.provider` and `event.type`.',
    ],
    starterCode: `/**
 * Multi-Gateway Webhook Ingestion
 */
type StripeChargeSucceeded = {
  provider: 'stripe';
  type: 'charge.succeeded';
  payload: { chargeId: string; amountInCents: number; customerId: string };
};

type StripeInvoicePaymentFailed = {
  provider: 'stripe';
  type: 'invoice.payment_failed';
  payload: { invoiceId: string; reason: string; attemptCount: number };
};

type PayPalOrderApproved = {
  provider: 'paypal';
  type: 'ORDER.APPROVED';
  payload: { orderId: string; grossAmount: string; payerEmail: string };
};

type AdyenPaymentCaptured = {
  provider: 'adyen';
  type: 'CAPTURE_SUCCESS';
  payload: { pspReference: string; originalReference: string; value: number };
};

export type WebhookEvent =
  | StripeChargeSucceeded
  | StripeInvoicePaymentFailed
  | PayPalOrderApproved
  | AdyenPaymentCaptured;

// Helper to enforce exhaustiveness at compile time
export function assertNever(value: never): never {
  throw new Error(\`Unhandled union member: \${JSON.stringify(value)}\`);
}

export function handleWebhookEvent(event: WebhookEvent): string {
  // TODO: Implement exhaustive handling based on discriminated union
  switch (event.type) {
    case 'charge.succeeded':
      return \`Processed Stripe charge: \${event.payload.chargeId}\`;
    // Complete remaining cases and exhaustiveness check
    default:
      return "unhandled";
  }
}

function solution(input) {
  const sampleEvent = {
    provider: 'stripe',
    type: 'charge.succeeded',
    payload: { chargeId: 'ch_123', amountInCents: 5000, customerId: 'cus_999' }
  };
  return handleWebhookEvent(sampleEvent);
}`,
    codeLanguage: 'typescript',
    candidateTasks: [
      'Implement switch cases covering all union members with safe payload access.',
      'Use `assertNever(event)` in the default branch to enforce compile-time verification.',
      'Explain how discriminated unions differ from nominal typing or runtime schema validators like Zod.',
    ],
    hints: [
      'TypeScript can discriminate unions using literal string properties like `type` or combination of `provider` and `type`.',
      'Passing `event` to `assertNever(event)` in `default` ensures that if any union case is omitted, TypeScript flags a type error because the variable has not been narrowed to `never`.',
    ],
    testCases: [
      {
        id: 'tc-ts-1',
        name: 'Processes Stripe charge succeeded',
        inputDescription: 'null',
        expectedOutput: '"Processed Stripe charge: ch_123"',
        explanation: 'Correctly extracts type-safe payload fields.',
      },
    ],
    rubric: [
      {
        id: 'rb-ts-discriminated',
        category: 'correctness',
        label: 'Discriminated Union Implementation',
        description: 'Successfully discriminates all variants and accesses nested payloads safely.',
        weight: 5,
        levels: [
          { score: 3, description: 'All variants handled, payload narrowed with zero type assertions.' },
          { score: 2, description: 'Handles cases but uses "as" type casts.' },
          { score: 0, description: 'Fails to discriminate union.' },
        ],
      },
      {
        id: 'rb-ts-exhaustive',
        category: 'code_quality',
        label: 'Compile-Time Exhaustiveness Guarantees',
        description: 'Uses never type check in default case to guarantee exhaustive coverage.',
        weight: 4,
        levels: [
          { score: 3, description: 'Correctly applies assertNever pattern to catch unhandled future cases.' },
          { score: 1, description: 'Returns generic string without never assertion.' },
          { score: 0, description: 'No exhaustiveness enforcement.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Discriminated unions require a common property (a discriminant) with literal types on each member of the union. Here, 'type' serves as the discriminant. By matching on 'event.type' in a switch statement, TypeScript automatically narrows 'event' to the exact interface corresponding to that branch.
      
In the 'default' case, if all branches are handled, 'event' is narrowed to the bottom type 'never'. If a developer later introduces a new event (e.g. AdyenRefund) to WebhookEvent but forgets to add a case, 'event' in the default case will have the type 'AdyenRefund'. Passing it to 'assertNever(value: never)' will trigger a compile-time type error: "Argument of type 'AdyenRefund' is not assignable to parameter of type 'never'."`,
      codeOrArtifact: `export function handleWebhookEvent(event: WebhookEvent): string {
  switch (event.type) {
    case 'charge.succeeded':
      return \`Processed Stripe charge: \${event.payload.chargeId} for \${event.payload.amountInCents} cents\`;
    case 'invoice.payment_failed':
      return \`Alert: Stripe invoice \${event.payload.invoiceId} failed: \${event.payload.reason}\`;
    case 'ORDER.APPROVED':
      return \`PayPal order \${event.payload.orderId} approved for \${event.payload.grossAmount}\`;
    case 'CAPTURE_SUCCESS':
      return \`Adyen capture \${event.payload.pspReference} confirmed\`;
    default:
      return assertNever(event);
  }
}`,
    },
    alternativeApproaches: [
      'Using a lookup object mapping event type to handler functions with Record<WebhookEvent["type"], (event: any) => string> constrained by generics.',
      'Combining with Zod / Valibot for runtime validation at the HTTP edge before passing into typed domain logic.',
    ],
    commonMistakes: [
      'Using "as any" inside the cases instead of letting TypeScript naturally narrow the payload.',
      'Forgetting the assertNever call, leaving unhandled cases silently ignored at compile time.',
    ],
    followUpQuestions: [
      {
        id: 'ts-fq-1',
        question: 'Why does TypeScript type-checking not protect your application from malformed JSON payloads at runtime?',
        expectedConcepts: ['Type erasure at compile time', 'Runtime validation needed (Zod, ArkType, io-ts)', 'Untrusted boundary validation'],
        sampleStrongAnswer: 'TypeScript types are completely erased during compilation and do not exist at runtime in JavaScript. External data arriving via network HTTP requests must be validated using runtime schema libraries like Zod, Valibot, or JSON Schema before being safely cast to TypeScript types.',
      },
    ],
  },
  {
    id: 'ts-generics-api-client',
    title: 'Type-Safe RPC/REST Client with Path Parameter Inference',
    type: 'coding',
    topic: 'TypeScript',
    subtopic: 'Generics',
    difficulty: 'Senior',
    estimatedMinutes: 35,
    businessContext:
      'A microservices ecosystem requires an internal SDK. Frontend engineers frequently write typos in URL routes like `/users/:userId/orders/:orderId` or pass wrong query parameters, resulting in 404s and missing request bodies that only surface in production.',
    problemStatement:
      'Design a generic TypeScript utility type `ExtractRouteParams<TPath>` that extracts route param names from a template string like `"/orgs/:orgId/repos/:repoId"` into a strongly typed object `{ orgId: string; repoId: string }`. Build a typed client interface ensuring paths and parameters match at compile time.',
    constraints: [
      'Must recursively infer all `:param` tokens from any route string.',
      'Routes without params must yield an empty object or void.',
      'Path and param arguments must be validated at compile time with zero runtime overhead.',
    ],
    starterCode: `/**
 * Path Parameter Inference Utility Type
 */

// TODO: Define recursive template literal type ExtractRouteParams<T>
// Example: ExtractRouteParams<"/users/:id/posts/:slug"> => { id: string; slug: string }
export type ExtractRouteParams<T extends string> = T extends \`\${string}:\${infer Param}/\${infer Rest}\`
  ? { [K in Param | keyof ExtractRouteParams<\`/\${Rest}\`>]: string }
  : T extends \`\${string}:\${infer Param}\`
  ? { [K in Param]: string }
  : Record<string, never>;

export class TypedApiClient {
  async get<TPath extends string>(
    path: TPath,
    params: ExtractRouteParams<TPath>
  ): Promise<string> {
    let resolvedPath: string = path;
    for (const [key, value] of Object.entries(params)) {
      resolvedPath = resolvedPath.replace(\`:\${key}\`, encodeURIComponent(String(value)));
    }
    return resolvedPath;
  }
}

function solution(input) {
  const client = new TypedApiClient();
  return client.get('/tenants/:tenantId/invoices/:invoiceId', {
    tenantId: 't-100',
    invoiceId: 'inv-55'
  });
}`,
    codeLanguage: 'typescript',
    candidateTasks: [
      'Implement `ExtractRouteParams<T>` using template literal types, conditional types, and recursion.',
      'Handle trailing slashes and multi-param paths.',
      'Ensure the `params` argument is required if parameters exist, and optional if the route has no parameters.',
    ],
    hints: [
      'Use conditional types with template literals: `T extends \`\${infer Start}:\${infer Param}/\${infer Rest}\``. Use recursion on `Rest`.',
      'Make sure single-parameter routes at the end of the string are captured: `T extends \`\${infer Start}:\${infer Param}\``.',
    ],
    testCases: [
      {
        id: 'tc-gen-1',
        name: 'Resolves path parameters into URL path',
        inputDescription: 'null',
        expectedOutput: '"/tenants/t-100/invoices/inv-55"',
        explanation: 'Path parameters are interpolated into resolved route.',
      },
    ],
    rubric: [
      {
        id: 'rb-template-literals',
        category: 'code_quality',
        label: 'Template Literal Type Recursion',
        description: 'Understands recursive string parsing in TypeScript compiler type system.',
        weight: 5,
        levels: [
          { score: 3, description: 'Accurately parses arbitrary number of route params recursively.' },
          { score: 2, description: 'Works for 1 or 2 params but fails with deeper nestings.' },
          { score: 0, description: 'Fails to implement template literal inference.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `TypeScript 4.1+ introduced Template Literal Types and recursive conditional types. We can parse string patterns by combining 'infer' with template literals.
We split the string at ':'. Whatever follows up to the next '/' is a parameter name. We union that with the recursive extraction of the remaining string. When no further ':' tokens exist, we return Record<string, never>.`,
      codeOrArtifact: `export type ExtractRouteParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param]: string } & ExtractRouteParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer Param}\`
    ? { [K in Param]: string }
    : Record<string, never>;

export type RouteArgs<T extends string> = keyof ExtractRouteParams<T> extends never
  ? [path: T]
  : [path: T, params: { [K in keyof ExtractRouteParams<T>]: string }];

export class TypedApiClient {
  async get<TPath extends string>(...args: RouteArgs<TPath>): Promise<string> {
    const [path, params] = args;
    if (!params) return path;

    let resolved = path;
    for (const [k, v] of Object.entries(params)) {
      resolved = resolved.replace(\`:\${k}\`, encodeURIComponent(String(v)));
    }
    return resolved;
  }
}`,
    },
    alternativeApproaches: [
      'Using OpenAPI generator / tRPC / ts-rest for complete full-stack contract sharing.',
    ],
    commonMistakes: [
      'Infinite recursion in type aliases leading to "Type instantiation is excessively deep and possibly infinite".',
      'Not supporting optional params when routes have no parameters.',
    ],
    followUpQuestions: [
      {
        id: 'ts-fq-2',
        question: 'How do you prevent type-level recursion limit errors when writing complex generic parsers?',
        expectedConcepts: ['Tail-call recursion optimization in TypeScript 4.5+', 'Accumulator tuple pattern'],
        sampleStrongAnswer: 'TypeScript supports tail-call elimination in conditional types if the recursive call appears directly in the true branch without being wrapped in intersections or indexed types. Using an accumulator array or object allows TypeScript to recurse up to ~1,000 depths instead of halting at ~50.',
      },
    ],
  },
  {
    id: 'ts-type-narrowing-rbac',
    title: 'Enterprise Multi-Tenant RBAC Authorization Type Narrowing',
    type: 'coding',
    topic: 'TypeScript',
    subtopic: 'Type narrowing',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'An enterprise ERP platform provides access to financial records. Different user roles (SuperAdmin, OrgAdmin, BillingAuditor, Viewer) have strictly segregated access to tenant resources. A security audit discovered that downstream handler code assumed all users have an `organizationId`, causing cross-tenant data leaks when SuperAdmins (who operate globally without an organizationId) called organization-scoped endpoints.',
    problemStatement:
      'Design a custom type guard and discriminated context model for user sessions. Implement a type guard `isOrgScopedSession(session)` that narrows a general user session to an `OrgScopedUserSession` guaranteed to contain a non-nullable `tenantId` and valid organization permissions.',
    constraints: [
      'Type guards must use `session is OrgScopedUserSession` predicate.',
      'Must enforce tenant isolation at compile time.',
      'Must reject sessions with undefined or null tenantId.',
    ],
    starterCode: `/**
 * Multi-Tenant RBAC Session Narrowing
 */
export interface BaseUser {
  id: string;
  email: string;
}

export interface SuperAdminUser extends BaseUser {
  role: 'SUPER_ADMIN';
  tenantId: null;
  globalCapabilities: string[];
}

export interface OrgAdminUser extends BaseUser {
  role: 'ORG_ADMIN';
  tenantId: string;
  permissions: ('MANAGE_USERS' | 'VIEW_BILLING' | 'EDIT_INVOICES')[];
}

export interface OrgMemberUser extends BaseUser {
  role: 'ORG_MEMBER';
  tenantId: string;
  permissions: ('VIEW_BILLING')[];
}

export type UserSession = SuperAdminUser | OrgAdminUser | OrgMemberUser;
export type OrgScopedSession = OrgAdminUser | OrgMemberUser;

// TODO: Implement custom type predicate
export function isOrgScopedSession(session: UserSession): session is OrgScopedSession {
  return session.role !== 'SUPER_ADMIN' && typeof session.tenantId === 'string' && session.tenantId.length > 0;
}

function solution(input) {
  const session: UserSession = {
    id: 'u-1',
    email: 'admin@acme.com',
    role: 'ORG_ADMIN',
    tenantId: 'tenant-99',
    permissions: ['MANAGE_USERS']
  };

  if (isOrgScopedSession(session)) {
    return \`Access granted to tenant: \${session.tenantId}\`;
  }
  return "Denied";
}`,
    codeLanguage: 'typescript',
    candidateTasks: [
      'Implement `isOrgScopedSession` type guard correctly checking runtime fields.',
      'Ensure the return type predicate `session is OrgScopedSession` narrows TypeScript type in if/else blocks.',
      'Discuss how custom type predicates can be dangerous if the runtime logic does not match the type predicate declaration.',
    ],
    hints: [
      'A type guard must return a boolean and have return type `arg is TargetType`.',
      'Check both role and that `tenantId !== null && typeof tenantId === "string"`.',
    ],
    testCases: [
      {
        id: 'tc-rbac-1',
        name: 'Narrows org scoped session accurately',
        inputDescription: 'null',
        expectedOutput: '"Access granted to tenant: tenant-99"',
        explanation: 'Allows scoped access with safe tenantId.',
      },
    ],
    rubric: [
      {
        id: 'rb-type-predicate',
        category: 'security',
        label: 'Type Guard Predicate Safety',
        description: 'Implements rigorous runtime checks matching the type predicate assertion.',
        weight: 5,
        levels: [
          { score: 3, description: 'Rigorously validates role and string tenantId, avoiding unsafe assumptions.' },
          { score: 2, description: 'Checks role only without verifying tenantId is non-null.' },
          { score: 0, description: 'Incorrect type predicate.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Type predicates ('param is Type') instruct the TypeScript compiler to narrow the variable type when the predicate function returns true. However, because TypeScript cannot prove that the boolean expression inside the function body actually satisfies the target type, the developer must ensure that runtime checks are exhaustive.
      
If a function states 'session is OrgScopedSession' but only checks 'session.role !== "SUPER_ADMIN"', a malformed session with 'tenantId: null' could pass through, causing runtime crashes or security vulnerabilities in downstream tenant database queries.`,
      codeOrArtifact: `export function isOrgScopedSession(session: UserSession): session is OrgScopedSession {
  return (
    (session.role === 'ORG_ADMIN' || session.role === 'ORG_MEMBER') &&
    typeof session.tenantId === 'string' &&
    session.tenantId.trim().length > 0
  );
}`,
    },
    alternativeApproaches: [
      'Using Discriminated Unions on a "scope" tag (scope: "GLOBAL" | "ORG").',
      'Using branded types for TenantId to prevent accidental substitution of user IDs for tenant IDs.',
    ],
    commonMistakes: [
      'Using type assertion "as OrgScopedSession" instead of a proper type guard.',
      'Forgetting to check for empty strings or undefined in tenantId.',
    ],
    followUpQuestions: [
      {
        id: 'ts-fq-3',
        question: 'What are Branded / Nominal Types in TypeScript and how do they enhance security?',
        expectedConcepts: ['Nominal typing simulation', 'Unique symbol brand tag', 'Preventing string mixups (e.g. UserId vs TenantId)'],
        sampleStrongAnswer: 'TypeScript is structurally typed, so two strings (like UserId and TenantId) are interchangeable. Branded types attach a unique private type tag (e.g. `type TenantId = string & { readonly __brand: unique symbol }`). This forces callers to go through a validation constructor before using the value in tenant-critical queries.',
      },
    ],
  },
  {
    id: 'ts-deep-immutability-state',
    title: 'Deep Readonly State Container with Lens-Based Immutability',
    type: 'coding',
    topic: 'TypeScript',
    subtopic: 'Utility types',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'In a high-frequency trading and portfolio management dashboard, unintended in-place mutations of deeply nested asset objects caused subtle desynchronizations between the UI chart and underlying websocket order feeds.',
    problemStatement:
      'Create a recursive utility type `DeepReadonly<T>` that converts all nested objects, arrays, and maps into immutable types at compile time. Then create a safe updater function `updateAtPath(state, path, updater)` that enforces type safety on nested property updates.',
    constraints: [
      'Must recursively make all nested properties readonly, including arrays and Maps.',
      'Must preserve function types without making their signatures unusable.',
      'Do not use any third-party libraries.',
    ],
    starterCode: `/**
 * DeepReadonly Utility Type and Immutable Store
 */

export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends (...args: any[]) => any
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export class ImmutableStore<T extends object> {
  private state: DeepReadonly<T>;

  constructor(initial: T) {
    this.state = Object.freeze({ ...initial }) as unknown as DeepReadonly<T>;
  }

  getState(): DeepReadonly<T> {
    return this.state;
  }
}

function solution(input) {
  interface Portfolio {
    user: { name: string; settings: { currency: string } };
    assets: { symbol: string; allocation: number }[];
  }

  const store = new ImmutableStore<Portfolio>({
    user: { name: 'Alex', settings: { currency: 'USD' } },
    assets: [{ symbol: 'BTC', allocation: 0.6 }]
  });

  return store.getState().user.settings.currency;
}`,
    codeLanguage: 'typescript',
    candidateTasks: [
      'Write recursive `DeepReadonly<T>` utility type covering primitives, functions, arrays, and plain objects.',
      'Explain how `ReadonlyArray<T>` protects against `.push()` and `.splice()`.',
      'Explain why TypeScript readonly is a compile-time check and how it pairs with runtime `Object.freeze`.',
    ],
    hints: [
      'Check for function types first so you do not turn functions into empty objects.',
      'Handle arrays with `ReadonlyArray<DeepReadonly<R>>`.',
    ],
    testCases: [
      {
        id: 'tc-deep-1',
        name: 'Retrieves nested property from deeply immutable state',
        inputDescription: 'null',
        expectedOutput: '"USD"',
        explanation: 'Deep property access succeeds safely.',
      },
    ],
    rubric: [
      {
        id: 'rb-deep-readonly',
        category: 'code_quality',
        label: 'Recursive Type Definition',
        description: 'DeepReadonly covers all core types without breaking function signatures.',
        weight: 5,
        levels: [
          { score: 3, description: 'Handles functions, arrays, objects, and primitives gracefully.' },
          { score: 2, description: 'Breaks when encountering arrays or functions.' },
          { score: 0, description: 'Non-recursive shallow readonly.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `A robust DeepReadonly<T> must check types in specific precedence:
1. Functions should remain unchanged (otherwise mapping over them strips call signatures).
2. Arrays must be mapped to ReadonlyArray<DeepReadonly<Element>> so mutating methods like .push(), .pop(), and .splice() are banned by the compiler.
3. Maps and Sets can optionally be mapped to ReadonlyMap and ReadonlySet.
4. Plain objects map keys to readonly [K in keyof T]: DeepReadonly<T[K]>.
5. Primitives pass through unchanged.`,
      codeOrArtifact: `export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends ReadonlyArray<infer R>
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlySet<infer M>
  ? ReadonlySet<DeepReadonly<M>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;`,
    },
    alternativeApproaches: [
      'Using Immer.js with Draft<T> and Immutable<T> library types.',
      'Using Immutable.js Record and Map data structures.',
    ],
    commonMistakes: [
      'Applying object mapping to functions, turning methods into {} types.',
      'Forgetting that Array is also an object, mapping it to { [0]: ..., [1]: ... } instead of ReadonlyArray.',
    ],
    followUpQuestions: [
      {
        id: 'ts-fq-4',
        question: 'Does DeepReadonly prevent runtime mutations if someone casts with `as any`?',
        expectedConcepts: ['Compile-time only', 'Object.freeze() for shallow runtime', 'Recursive deepFreeze() needed for runtime protection'],
        sampleStrongAnswer: 'No, DeepReadonly is purely a compile-time constraint enforced by the TypeScript compiler. At runtime, JavaScript objects can still be mutated if someone bypasses type checking or if data is passed to external JS libraries. To enforce runtime immutability, one must use Object.freeze() recursively or use proxy-based copy-on-write tools like Immer.',
      },
    ],
  },
];

