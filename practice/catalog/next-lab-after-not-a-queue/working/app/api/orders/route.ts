import { after } from 'next/server';
export async function POST(){after(async()=>{await chargeCard();await shipOrder();});return Response.json({paid:true});}