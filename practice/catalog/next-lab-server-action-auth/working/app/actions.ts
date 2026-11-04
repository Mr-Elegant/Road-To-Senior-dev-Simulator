'use server';
import { db } from '@/lib/db';
export async function removeInvoice(id:string){await db.invoice.delete({where:{id}});}