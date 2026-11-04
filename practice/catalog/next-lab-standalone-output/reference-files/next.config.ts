// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={output:'standalone'};export default config;
// Packaging step: copy public into .next/standalone/public and .next/static into .next/standalone/.next/static.
// Run the generated server.js with the deployment's PORT/HOSTNAME and runtime secrets.
