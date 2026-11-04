// Corrected review reference: app/config-client.tsx
// Keep DATABASE_URL server-only; never prefix a secret with NEXT_PUBLIC_.
// Public NEXT_PUBLIC_* references are inlined at build time, not read afresh after promoting an artifact.
export type PublicConfig={supportLabel:string};
export function projectConfig(input:{supportLabel:string;databaseUrl:string}):PublicConfig{return {supportLabel:input.supportLabel};}
