/**
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
    return `Access granted to tenant: ${session.tenantId}`;
  }
  return "Denied";
}