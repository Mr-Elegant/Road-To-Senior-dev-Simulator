// Corrected review reference: app/api/orders/route.ts
import { after } from 'next/server';
import { createPendingOrderAndOutbox } from '@/lib/orders';
import { recordMetric } from '@/lib/metrics';
export async function POST(request:Request){const order=await createPendingOrderAndOutbox(request);after(()=>recordMetric('order.accepted'));return Response.json({id:order.id,status:'pending'},{status:202});}
