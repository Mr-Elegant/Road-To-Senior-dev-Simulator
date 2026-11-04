// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={output:'standalone'};export default config;
// A server-capable deployment is required for the stated authenticated runtime features.
// If static hosting is mandatory, redesign those features around an explicitly separate authenticated backend.
