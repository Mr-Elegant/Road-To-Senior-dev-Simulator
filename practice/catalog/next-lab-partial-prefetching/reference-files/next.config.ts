// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={cacheComponents:true,partialPrefetching:true};export default config;
// Audit full per-link prefetches; resolve URL-dependent data behind destination Suspense boundaries.
// Retain prefetch={true} only where resolving extra URL-specific cached content is an intentional budget decision.
