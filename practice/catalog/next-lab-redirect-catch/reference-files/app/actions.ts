// Corrected review reference: app/actions.ts
'use server';
import { redirect } from 'next/navigation';
import { authorizeAndSave } from '@/lib/save';
export async function save(){try{await authorizeAndSave();}catch{return {error:'Save failed'};}redirect('/complete');}
