// Corrected review reference: app/actions.ts
'use server';
import { revalidateTag } from 'next/cache';
import { authorizePublisher,commitPost } from '@/lib/posts';
export async function publish(){await authorizePublisher();await commitPost();revalidateTag('public-posts','max');}
