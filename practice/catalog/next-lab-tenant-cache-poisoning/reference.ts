// Corrected review reference: lib/tenant-report.ts
import 'server-only';
import { requireTenantMember } from '@/lib/auth';
import { queryTenantReport } from '@/lib/db';
export async function report(tenantId:string,id:string){await requireTenantMember(tenantId);return queryTenantReport({tenantId,id});}
// Add a bounded explicit cache only after defining tenant/role/version keys and revocation behavior.
