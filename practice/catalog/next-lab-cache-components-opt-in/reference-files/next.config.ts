// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={cacheComponents:true};
export default config;
// Audit route-segment configuration and put uncached runtime work behind Suspense.
