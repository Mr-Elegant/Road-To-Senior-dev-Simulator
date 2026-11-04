// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={experimental:{serverActions:{allowedOrigins:['trusted-proxy.example.com'],bodySizeLimit:'1mb'}}};export default config;
// If the default same-origin policy already fits the deployment, omit allowedOrigins instead of expanding it.
