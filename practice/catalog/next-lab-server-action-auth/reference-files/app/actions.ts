// Corrected review reference: app/actions.ts
'use server';
import { requireUser } from '@/lib/auth';
import { deleteOwnedInvoice } from '@/lib/invoices';
export async function removeInvoice(id:string){const user=await requireUser();if(!/^[a-z0-9-]{1,64}$/.test(id))return {ok:false};await deleteOwnedInvoice({id,ownerId:user.id});return {ok:true};}
// deleteOwnedInvoice enforces ownership in its database predicate/transaction.
