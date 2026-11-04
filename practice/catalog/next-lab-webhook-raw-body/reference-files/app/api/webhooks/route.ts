// Corrected review reference: app/api/webhooks/route.ts
import { verifyProviderSignature,commitEventOnce } from '@/lib/webhooks';
export async function POST(request:Request){
 const raw=await request.text();const signature=request.headers.get('provider-signature');
 const event=await verifyProviderSignature(raw,signature);
 if(!event)return Response.json({error:'Invalid signature'},{status:401});
 await commitEventOnce(event);return Response.json({ok:true});
}
// The provider adapter enforces its timestamp/replay rules; commitEventOnce uses durable uniqueness with the business write.
