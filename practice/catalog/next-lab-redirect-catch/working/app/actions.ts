'use server';
import { redirect } from 'next/navigation';
export async function save(){try{redirect('/complete');}catch{return {error:'Save failed'};}}