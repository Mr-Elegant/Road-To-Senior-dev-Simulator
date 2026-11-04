// Corrected review reference: app/public-actions.ts
'use server';
import { requireCapability } from '@/lib/auth';
import { listTenantCustomerExport } from '@/lib/customers';
export async function exportCustomers(){const actor=await requireCapability('customers:export');return listTenantCustomerExport(actor.tenantId);}
