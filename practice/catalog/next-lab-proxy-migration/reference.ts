// Corrected review reference: proxy.ts
import { NextResponse,type NextRequest } from 'next/server';
export function proxy(request:NextRequest){const response=NextResponse.next();response.headers.set('x-route-policy','v2');return response;}
export const config={matcher:['/account/:path*']};
