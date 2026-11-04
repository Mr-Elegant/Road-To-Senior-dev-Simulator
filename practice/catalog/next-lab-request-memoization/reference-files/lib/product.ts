// Corrected review reference: lib/product.ts
import 'server-only';
import { cache } from 'react';
import { loadFromDatabase } from './database';
export const getProduct=cache(async(id:string)=>loadFromDatabase(id));
