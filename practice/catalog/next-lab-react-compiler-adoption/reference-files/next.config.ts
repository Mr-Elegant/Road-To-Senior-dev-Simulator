// Corrected review reference: next.config.ts
import type { NextConfig } from 'next';
const config:NextConfig={reactCompiler:true};export default config;
// Install the version-compatible babel-plugin-react-compiler dev dependency in the lab.
// Fix render purity/hook-rule violations and compare interactions/build cost before enabling broadly.
