export function isOrgScopedSession(session: UserSession): session is OrgScopedSession {
  return (
    (session.role === 'ORG_ADMIN' || session.role === 'ORG_MEMBER') &&
    typeof session.tenantId === 'string' &&
    session.tenantId.trim().length > 0
  );
}
