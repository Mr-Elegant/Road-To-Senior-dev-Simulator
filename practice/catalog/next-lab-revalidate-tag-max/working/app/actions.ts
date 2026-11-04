'use server';
import { revalidateTag } from 'next/cache';
export async function publish(){revalidateTag('public-posts');}