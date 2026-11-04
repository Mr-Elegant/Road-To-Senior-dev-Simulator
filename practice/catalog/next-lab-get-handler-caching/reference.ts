// Corrected review reference: app/api/profile/route.ts
import { getVerifiedSession } from '@/lib/auth';
export async function GET(){const session=await getVerifiedSession();if(!session)return Response.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'private, no-store'}});return Response.json({name:session.user.name},{headers:{'Cache-Control':'private, no-store'}});}
