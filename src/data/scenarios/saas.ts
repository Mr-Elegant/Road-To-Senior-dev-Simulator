import type { Scenario } from '@/types/scenario';
import { businessCase as tc, businessScenario } from './businessScenario';

export const saasScenarios: Scenario[] = [
  businessScenario({
    id: 'saas-tenant-authorization',
    title: 'SaaS: Close a Cross-Tenant Invoice Access Bug',
    type: 'debugging', topic: 'Security', subtopic: 'SaaS / Tenant isolation and authorization',
    difficulty: 'Senior', estimatedMinutes: 30,
    businessContext: 'A finance SaaS authenticates users but fetches invoices by ID alone. A customer can change the invoice ID in a URL and read another organization\'s billing data.',
    problemStatement: 'Implement solution({ session, requestedTenantId, invoice, action }) returning { allowed: boolean }. session is null or trusted server context with userId and memberships [{ tenantId, role, active }]. invoice is null or { id, tenantId }. action is read, edit, or delete. Require a nonempty string session.userId, an active membership for the requested tenant, and a matching invoice tenant. Owners may read/edit/delete, editors read/edit, viewers read only. Unknown roles/actions and missing resources must deny access. requestedTenantId is untrusted routing input.',
    constraints: ['Membership active must equal true; truthy strings must not grant access. Memberships have at most one entry per tenant.', 'Do not return invoice data, change inputs, infer membership from the invoice, or let a role from one tenant authorize another tenant.'],
    candidateTasks: ['Replace the authentication-only check with tenant and permission checks.', 'Describe where server-side query scoping, cache keys, and background jobs must carry tenant identity.'],
    starterCode: `function solution({ session, invoice }) {
  return { allowed: Boolean(session && invoice) };
}`,
    testCases: [
      tc('tenant-1', 'Owner can delete within their tenant', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'delete' }, { allowed: true }),
      tc('tenant-2', 'Changing invoice ID cannot cross tenants', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'b' }, action: 'read' }, { allowed: false }),
      tc('tenant-3', 'Routing tenant alone does not grant membership', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }] }, requestedTenantId: 'b', invoice: { id: 'i', tenantId: 'b' }, action: 'read' }, { allowed: false }, true),
      tc('tenant-4', 'Viewer cannot edit', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'viewer', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'edit' }, { allowed: false }, true),
      tc('tenant-5', 'Editor can edit', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'editor', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'edit' }, { allowed: true }, true),
      tc('tenant-6', 'Inactive membership is denied', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: false }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'read' }, { allowed: false }, true),
      tc('tenant-7', 'Missing session is denied', { session: null, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'read' }, { allowed: false }, true),
      tc('tenant-8', 'Unknown action is denied', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'export' }, { allowed: false }, true),
      tc('tenant-9', 'Prototype-like role cannot grant permissions', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'constructor', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'read' }, { allowed: false }, true),
      tc('tenant-10', 'Truthy active string does not grant access', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: 'true' }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'read' }, { allowed: false }, true),
      tc('tenant-11', 'Owner of another tenant cannot upgrade viewer permissions', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }, { tenantId: 'b', role: 'viewer', active: true }] }, requestedTenantId: 'b', invoice: { id: 'i', tenantId: 'b' }, action: 'delete' }, { allowed: false }, true),
      tc('tenant-12', 'Missing invoice is denied', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'owner', active: true }] }, requestedTenantId: 'a', invoice: null, action: 'read' }, { allowed: false }, true),
      tc('tenant-13', 'Viewer can read', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'viewer', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'read' }, { allowed: true }, true),
      tc('tenant-14', 'Editor cannot delete', { session: { userId: 'u', memberships: [{ tenantId: 'a', role: 'editor', active: true }] }, requestedTenantId: 'a', invoice: { id: 'i', tenantId: 'a' }, action: 'delete' }, { allowed: false }, true),
    ],
    hints: ['Authentication identifies a user; membership and role authorize a tenant-specific action.', 'Choose the membership for the requested tenant, then compare the resource tenant and apply a deny-by-default permission list.'],
    assessment: 'Access requires trusted identity, active tenant membership, matching resource ownership, and a known permitted action.',
    referenceSolution: {
      explanation: 'The broken function proves only that objects exist. The correction binds identity, requested tenant, resource tenant, and action in one decision, defaulting to denial. In production validate session context server-side and query invoices with both tenant_id and invoice_id before serialization. Apply the same scope to exports, caches, search indexes, object storage, and jobs. Database row-level security can add defense in depth, but request roles must not bypass it and pooled connection context must be scoped to the transaction. Verify with two real tenant accounts across every read/write route, including revoked membership and stale caches. Log denial metadata without invoice contents; revoke exposed links and investigate historical access after a leak. [OWASP tenant isolation](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html).',
      codeOrArtifact: `function solution({ session, requestedTenantId, invoice, action }) {
  if (!session || typeof session.userId !== "string" || !session.userId.trim() ||
      !invoice || invoice.tenantId !== requestedTenantId) return { allowed: false };
  const membership = session.memberships.find(m => m.tenantId === requestedTenantId && m.active === true);
  if (!membership) return { allowed: false };
  const permissions = new Map([
    ["owner", ["read", "edit", "delete"]],
    ["editor", ["read", "edit"]],
    ["viewer", ["read"]]
  ]);
  return { allowed: (permissions.get(membership.role) || []).includes(action) };
}`,
    },
    alternativeApproaches: ['Centralize policy evaluation with tenant-scoped repositories; test every adapter so a shared policy cannot be bypassed.'],
    commonMistakes: ['Trusting a tenant header without checking membership.', 'Checking the strongest role across all memberships rather than the requested tenant.'],
    followUpQuestions: [{ id: 'tenant-cache', question: 'How could a correct database query still leak an invoice?', expectedConcepts: ['tenant-scoped cache keys', 'authorization before cache reads', 'revocation'], sampleStrongAnswer: 'A cache keyed only by invoice ID or a shared response cache can bypass scoped queries. Authorize before reading, include tenant and relevant access scope in keys, and invalidate permission-sensitive entries when membership changes.' }],
  }),
  businessScenario({
    id: 'saas-subscription-entitlements',
    title: 'SaaS: Repair Subscription Access After Delayed Updates',
    type: 'coding', topic: 'Integrations', subtopic: 'SaaS / Subscription entitlements',
    difficulty: 'Senior', estimatedMinutes: 35,
    businessContext: 'A reporting SaaS restores export access from an old billing update after a cancellation. A separate expiry bug lets trial accounts keep exporting indefinitely.',
    problemStatement: 'Implement solution({ state, snapshots, now }) returning { state, canExport, outcomes }. state is the current valid subscription { tenantId, version, status, plan, periodEnd, cancelAtPeriodEnd }. Each snapshot has the same fields. version is a positive integer assigned by our serialized internal reconciler, NOT a Stripe event timestamp or provider version. now and periodEnd use integer epoch seconds. Process snapshots in order, then compute export access from the final state.',
    constraints: [
      'Check tenant first: a different tenant returns mismatch. Invalid fields return invalid: version positive safe integer, periodEnd nonnegative safe integer, cancelAtPeriodEnd boolean, plan starter/pro, status active/trialing/past_due/canceled/unpaid/incomplete. Then version <= current version returns stale; otherwise replace state and return applied.',
      'Export requires plan pro, status active or trialing, and now < periodEnd. An active subscription with cancelAtPeriodEnd true retains access until periodEnd. No grace period is configured. Do not mutate inputs; current state and now are valid.',
    ],
    candidateTasks: ['Implement ordered snapshot reconciliation and the explicit entitlement policy.', 'Explain how reconciliation obtains fresh authoritative provider state without inventing ordering guarantees.'],
    starterCode: `function solution({ state, snapshots }) {
  const next = snapshots.length ? snapshots[snapshots.length - 1] : state;
  return { state: next, canExport: next.plan === "pro", outcomes: snapshots.map(() => "applied") };
}`,
    testCases: [
      tc('sub-1', 'Active pro subscription can export', { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [], now: 100 }, { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: true, outcomes: [] }),
      tc('sub-2', 'Expiry boundary denies export', { state: { tenantId: 'a', version: 1, status: 'trialing', plan: 'pro', periodEnd: 100, cancelAtPeriodEnd: false }, snapshots: [], now: 100 }, { state: { tenantId: 'a', version: 1, status: 'trialing', plan: 'pro', periodEnd: 100, cancelAtPeriodEnd: false }, canExport: false, outcomes: [] }),
      tc('sub-3', 'Stale and replayed snapshots cannot restore canceled access', { state: { tenantId: 'a', version: 3, status: 'canceled', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [2, 3].map(version => ({ tenantId: 'a', version, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false })), now: 100 }, { state: { tenantId: 'a', version: 3, status: 'canceled', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: false, outcomes: ['stale', 'stale'] }, true),
      tc('sub-4', 'Cancellation scheduled for period end preserves current access', { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [{ tenantId: 'a', version: 2, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: true }], now: 100 }, { state: { tenantId: 'a', version: 2, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: true }, canExport: true, outcomes: ['applied'] }, true),
      tc('sub-5', 'Cross-tenant snapshot is rejected', { state: { tenantId: 'a', version: 1, status: 'active', plan: 'starter', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [{ tenantId: 'b', version: 2, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }], now: 100 }, { state: { tenantId: 'a', version: 1, status: 'active', plan: 'starter', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: false, outcomes: ['mismatch'] }, true),
      tc('sub-6', 'Past due does not grant an implicit grace period', { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [{ tenantId: 'a', version: 2, status: 'past_due', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }], now: 100 }, { state: { tenantId: 'a', version: 2, status: 'past_due', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: false, outcomes: ['applied'] }, true),
      tc('sub-7', 'Invalid internal version is not applied', { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [{ tenantId: 'a', version: 2.5, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }], now: 100 }, { state: { tenantId: 'a', version: 1, status: 'active', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: true, outcomes: ['invalid'] }, true),
      tc('sub-8', 'A newer downgrade removes exports', { state: { tenantId: 'a', version: 1, status: 'trialing', plan: 'pro', periodEnd: 200, cancelAtPeriodEnd: false }, snapshots: [{ tenantId: 'a', version: 2, status: 'active', plan: 'starter', periodEnd: 200, cancelAtPeriodEnd: false }], now: 100 }, { state: { tenantId: 'a', version: 2, status: 'active', plan: 'starter', periodEnd: 200, cancelAtPeriodEnd: false }, canExport: false, outcomes: ['applied'] }, true),
    ],
    hints: ['Event arrival time does not establish provider state order. This fixture explicitly supplies internal reconciler versions.', 'Apply validated newer snapshots first; evaluate access using both billing state and the supplied time.'],
    assessment: 'Reject stale or cross-tenant snapshots and enforce the explicit plan, status, and expiry policy.',
    referenceSolution: {
      explanation: 'The starter uses last delivery wins and equates a plan name with permission. Apply only valid newer internal snapshots for the current tenant, then compute access against a deterministic clock. This exercise assumes a serialized reconciler assigned versions after reading authoritative billing state; provider webhook timestamps are not equivalent. In production deduplicate verified deliveries, serialize reconciliation per subscription, fetch authoritative state as required, and conditionally persist the internal revision and entitlements. Periodic reconciliation repairs missing notifications. Check access server-side and expire caches at the entitlement boundary. Test delayed updates, cancellation at period end, expired trials, and a provider outage. Monitor reconciliation lag and unexpected grants; on an inconsistent snapshot preserve a known valid policy and queue review rather than granting access from an unknown state. [Stripe ordering and retrieval guidance](https://docs.stripe.com/webhooks).',
      codeOrArtifact: `function solution({ state, snapshots, now }) {
  let next = { ...state };
  const statuses = ["active", "trialing", "past_due", "canceled", "unpaid", "incomplete"];
  const outcomes = snapshots.map(snapshot => {
    if (snapshot.tenantId !== next.tenantId) return "mismatch";
    if (!Number.isSafeInteger(snapshot.version) || snapshot.version <= 0 ||
        !Number.isSafeInteger(snapshot.periodEnd) || snapshot.periodEnd < 0 ||
        typeof snapshot.cancelAtPeriodEnd !== "boolean" ||
        !["starter", "pro"].includes(snapshot.plan) || !statuses.includes(snapshot.status)) return "invalid";
    if (snapshot.version <= next.version) return "stale";
    next = { ...snapshot };
    return "applied";
  });
  const canExport = next.plan === "pro" && ["active", "trialing"].includes(next.status) && now < next.periodEnd;
  return { state: next, canExport, outcomes };
}`,
    },
    alternativeApproaches: ['Use provider entitlement APIs behind a cached server-side policy, with explicit cache expiry and a documented outage policy.'],
    commonMistakes: ['Using event.created as a guaranteed per-subscription sequence.', 'Revoking access immediately when cancelAtPeriodEnd becomes true.'],
    followUpQuestions: [{ id: 'sub-order', question: 'Why is an internal revision not enough if provider fetches race?', expectedConcepts: ['serialization', 'authoritative state', 'stale reads'], sampleStrongAnswer: 'A revision assigned when an old fetch completes can make stale data appear newer. Serialize fetch-and-commit for each subscription or use a documented provider ordering mechanism; assign the internal revision only within that controlled reconciliation.' }],
  }),
  businessScenario({
    id: 'saas-safe-audit-history',
    title: 'SaaS: Record Useful Audit History Without Leaking Secrets',
    type: 'debugging', topic: 'Security', subtopic: 'SaaS / Audit history and data minimization',
    difficulty: 'Senior', estimatedMinutes: 30,
    businessContext: 'An administration SaaS logs entire organization objects after edits. The log now contains integration API keys, and a client-supplied tenant field can misattribute another organization\'s activity.',
    problemStatement: 'Implement solution({ context, before, after }) returning { entry }. context is null or trusted server-side { tenantId, actorId }. before and after are null or resource snapshots with id, tenantId, name, status, plan and possibly additional secret fields. Only name, status, and plan are auditable. Both values for each auditable field must be strings. Return entry null for invalid context, missing resources, different IDs, tenant mismatch, invalid auditable fields, or no auditable changes. IDs and trusted context values must be nonempty strings. This function formats an already-authorized edit; it does not authorize the mutation.',
    constraints: [
      'A valid entry is exactly { tenantId, actorId, resourceId, action: "organization.updated", changes }. changes contains only changed allowlisted fields in name, status, plan order as { field, before, after }.',
      'Exclude every non-allowlisted field, including nested credentials and newly introduced secret names. Do not modify input snapshots or accept actor identity from resource data.',
    ],
    candidateTasks: ['Replace full-object logging with an allowlisted change record and trusted context checks.', 'Describe transactional audit durability, restricted access, retention, and tests against accidental secret capture.'],
    starterCode: `function solution({ context, before, after }) {
  return { entry: { tenantId: after.tenantId, actorId: context ? context.actorId : "unknown", before, after } };
}`,
    testCases: [
      tc('audit-1', 'Record a changed name without API keys', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'a', name: 'Old', status: 'active', plan: 'pro', apiKey: 'synthetic-old' }, after: { id: 'org', tenantId: 'a', name: 'New', status: 'active', plan: 'pro', apiKey: 'synthetic-new' } }, { entry: { tenantId: 'a', actorId: 'u', resourceId: 'org', action: 'organization.updated', changes: [{ field: 'name', before: 'Old', after: 'New' }] } }),
      tc('audit-2', 'Secret-only changes produce no business audit entry', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'a', name: 'Org', status: 'active', plan: 'pro', credentials: { token: 'synthetic-old' } }, after: { id: 'org', tenantId: 'a', name: 'Org', status: 'active', plan: 'pro', credentials: { token: 'synthetic-new' } } }, { entry: null }),
      tc('audit-3', 'Tenant mismatch cannot forge an audit entry', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'b', name: 'Old', status: 'active', plan: 'pro' }, after: { id: 'org', tenantId: 'b', name: 'New', status: 'active', plan: 'pro' } }, { entry: null }, true),
      tc('audit-4', 'Missing trusted context is rejected', { context: null, before: { id: 'org', tenantId: 'a', name: 'Old', status: 'active', plan: 'pro' }, after: { id: 'org', tenantId: 'a', name: 'New', status: 'active', plan: 'pro' } }, { entry: null }, true),
      tc('audit-5', 'Changes use fixed field ordering and trusted actor', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'a', name: 'Old', status: 'active', plan: 'starter' }, after: { id: 'org', tenantId: 'a', plan: 'pro', status: 'paused', name: 'New', actorId: 'forged', futureSecret: 'synthetic-only' } }, { entry: { tenantId: 'a', actorId: 'u', resourceId: 'org', action: 'organization.updated', changes: [{ field: 'name', before: 'Old', after: 'New' }, { field: 'status', before: 'active', after: 'paused' }, { field: 'plan', before: 'starter', after: 'pro' }] } }, true),
      tc('audit-6', 'Different resource IDs are rejected', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'one', tenantId: 'a', name: 'Old', status: 'active', plan: 'pro' }, after: { id: 'two', tenantId: 'a', name: 'New', status: 'active', plan: 'pro' } }, { entry: null }, true),
      tc('audit-7', 'Objects in auditable fields cannot smuggle nested secrets', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'a', name: 'Old', status: 'active', plan: 'pro' }, after: { id: 'org', tenantId: 'a', name: { password: 'synthetic-only' }, status: 'active', plan: 'pro' } }, { entry: null }, true),
      tc('audit-8', 'An unchanged resource produces no entry', { context: { tenantId: 'a', actorId: 'u' }, before: { id: 'org', tenantId: 'a', name: 'Org', status: 'active', plan: 'pro' }, after: { id: 'org', tenantId: 'a', name: 'Org', status: 'active', plan: 'pro' } }, { entry: null }, true),
    ],
    hints: ['An allowlist remains safe when a new secret field is added; a blacklist can silently miss it.', 'Build a new object from trusted identifiers and primitive field differences. Never spread whole snapshots into the entry.'],
    assessment: 'Audit output contains only allowed primitive changes and trusted identity, with no cross-tenant attribution.',
    referenceSolution: {
      explanation: 'The starter serializes credentials and trusts the resource tenant. Validate the trusted context against both resource versions, require stable identity and string-valued auditable fields, then construct a fresh allowlisted record. Secret rotation needs a separate metadata-only security event; excluding secrets does not mean suppressing evidence that a rotation occurred. In production commit the authorized mutation and audit record together, or use a durable outbox in that transaction. Populate time and request identity server-side, enforce append-only permissions, restrict audit readers by tenant and role, and define retention. An allowlist limits sensitive content but does not make arbitrary business strings safe for HTML rendering: escape output and cap field lengths at ingestion. Test new secret fields, nested values, context mismatch, and rollback. Monitor missing audit events; pause affected writes if required audit durability fails instead of falling back to full-object logs.',
      codeOrArtifact: `function solution({ context, before, after }) {
  const nonempty = value => typeof value === "string" && value.trim().length > 0;
  if (!context || !nonempty(context.tenantId) || !nonempty(context.actorId) || !before || !after ||
      !nonempty(before.id) || before.id !== after.id ||
      before.tenantId !== context.tenantId || after.tenantId !== context.tenantId) return { entry: null };
  const fields = ["name", "status", "plan"];
  if (fields.some(field => typeof before[field] !== "string" || typeof after[field] !== "string")) return { entry: null };
  const changes = fields.filter(field => before[field] !== after[field])
    .map(field => ({ field, before: before[field], after: after[field] }));
  if (!changes.length) return { entry: null };
  return { entry: {
    tenantId: context.tenantId, actorId: context.actorId, resourceId: before.id,
    action: "organization.updated", changes
  } };
}`,
    },
    alternativeApproaches: ['Emit typed domain events with an explicit schema, using an outbox to feed a restricted audit store.'],
    commonMistakes: ['Redacting only known key names while logging arbitrary new fields.', 'Writing audit entries independently from the mutation, losing one side during a crash.'],
    followUpQuestions: [{ id: 'audit-rotation', question: 'How would you audit API key rotation without logging the key?', expectedConcepts: ['metadata-only security event', 'trusted actor', 'no credential contents'], sampleStrongAnswer: 'Emit a dedicated integration.key_rotated event with tenant, actor, integration ID, server time, and request ID. Include no raw key or secret before/after values; store the event durably with the rotation.' }],
  }),
];
