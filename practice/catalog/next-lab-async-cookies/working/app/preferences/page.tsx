'use client';
import { cookies } from 'next/headers';
export default function Page(){ return <p>{cookies().get('theme')?.value}</p>; }