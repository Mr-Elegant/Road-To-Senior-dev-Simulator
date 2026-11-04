// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={turbopack:{resolveAlias:{'legacy-parser':'./parser'}}};
export default config;
// Validate this alias against the actual parser module; retain an explicit webpack build only as a tested fallback.
