import { getScenarioById } from '@/data';
import { loanLabExercises } from '@/data/loanLabExercises';

export interface EnterpriseLabExercise {
  id: string;
  title: string;
  href: string;
  minutes: number;
  tests: number;
  evaluation: 'behavioral' | 'rubric';
}

export interface EnterpriseLab {
  id: string;
  title: string;
  domain: string;
  format: 'dashboard' | 'challenges';
  summary: string;
  businessContext: string;
  skills: string[];
  workflow: string[];
  exercises: EnterpriseLabExercise[];
  dashboardHref?: string;
}

function scenarioExercise(id: string): EnterpriseLabExercise {
  const scenario = getScenarioById(id);
  if (!scenario) throw new Error(`Enterprise lab references missing scenario: ${id}`);
  return { id, title: scenario.title, href: `/challenge/${id}`, minutes: scenario.estimatedMinutes,
    tests: scenario.testCases?.length ?? 0, evaluation: 'rubric' };
}

export const enterpriseLabs: EnterpriseLab[] = [
  {
    id: 'loan-operations', title: 'Loan Operations', domain: 'Financial services', format: 'dashboard',
    summary: 'Keep a loan review dashboard correct as searches overlap, approvals fail, and users change pages.',
    businessContext: 'An operations team reviews loan applications throughout the day. Fast filtering and responsive approvals matter, but a stale response or an incorrect rollback can leave reviewers acting on the wrong application state.',
    skills: ['React & Redux', 'Async correctness', 'Optimistic updates', 'State immutability'],
    workflow: ['Explore the dashboard: search applications, change filters, and review an approval.', 'Choose a bug exercise, reproduce its failing behavior, and edit the JavaScript function.', 'Run the full suite and compare your reasoning with the reference fix.'],
    dashboardHref: '/challenges/loan-management',
    exercises: loanLabExercises.map(exercise => ({
      id: `loan-lab:${exercise.bugId}`, title: exercise.title,
      href: `/challenges/loan-management?bug=${encodeURIComponent(exercise.bugId)}`,
      minutes: 20, tests: exercise.tests.length, evaluation: 'behavioral',
    })),
  },
  {
    id: 'commerce-operations', title: 'Commerce Operations', domain: 'E-commerce', format: 'challenges',
    summary: 'Protect inventory, reconcile payments, and recover catalog imports without corrupting business data.',
    businessContext: 'A merchant is preparing for a busy sales period. Checkout retries must not consume stock twice, payment notifications must not trigger duplicate fulfillment, and a restarted supplier import must preserve the right prices.',
    skills: ['Inventory invariants', 'Payment idempotency', 'Import recovery', 'Transaction design'],
    workflow: ['Start with the last-item reservation failure and define the stock invariant.', 'Reconcile duplicate payments without regressing an already paid order.', 'Recover a catalog import, then explain the database guarantees each solution needs.'],
    exercises: ['commerce-inventory-reservations', 'commerce-payment-reconciliation', 'commerce-resumable-catalog-import'].map(scenarioExercise),
  },
  {
    id: 'multi-tenant-saas', title: 'Multi-Tenant SaaS', domain: 'Business software', format: 'challenges',
    summary: 'Keep customer data isolated, subscription access accurate, and audit history free of credentials.',
    businessContext: 'Multiple organizations share a finance SaaS. Each request must respect tenant membership, billing changes must produce the correct access policy, and administration events must remain useful without exposing secrets.',
    skills: ['Tenant authorization', 'Subscription policy', 'Audit design', 'Data minimization'],
    workflow: ['Close the cross-tenant invoice access bug using explicit permissions.', 'Reconcile subscription snapshots and verify the access expiry boundary.', 'Produce safe audit records and explain how to store them durably.'],
    exercises: ['saas-tenant-authorization', 'saas-subscription-entitlements', 'saas-safe-audit-history'].map(scenarioExercise),
  },
  {
    id: 'real-time-collaboration', title: 'Real-Time Collaboration', domain: 'Communication & chat', format: 'challenges',
    summary: 'Keep conversations correct through retries, reconnects, stale receipts, and meeting signaling races.',
    businessContext: 'A team messaging product needs ordered conversations, reliable history, private channels, and predictable meeting lifecycles. Clients reconnect from multiple devices while events arrive late or repeat.',
    skills: ['Message ordering', 'Reconnect recovery', 'Channel authorization', 'Meeting signaling'],
    workflow: ['Repair message ordering and replay cursors first.', 'Reconcile read receipts and presence across devices.', 'Enforce channel permissions and notification preferences.', 'Fence stale meeting signals, then page chat history safely.'],
    exercises: ['collab-message-ordering', 'collab-reconnect-cursor', 'collab-read-receipts', 'collab-presence-expiry', 'collab-channel-permissions', 'collab-notification-delivery', 'collab-meeting-signaling', 'collab-history-pagination'].map(scenarioExercise),
  },
];

export function getEnterpriseLab(id: string): EnterpriseLab | undefined {
  return enterpriseLabs.find(lab => lab.id === id);
}
