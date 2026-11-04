// Corrected review reference: instrumentation.ts
export async function register(){if(process.env.NEXT_RUNTIME==='nodejs'){await import('./lib/node-tracing');}}
// node-tracing initializes the approved telemetry SDK once and redacts sensitive attributes.
