// Corrected review reference: csp-policy.ts
export function policy(nonce:string){return "default-src 'self'; script-src 'self' 'nonce-"+nonce+"' 'strict-dynamic'; object-src 'none'; base-uri 'self'";}
// Generate an unpredictable nonce per request and propagate it through documented Next request/response headers.
// This policy fragment alone does not install CSP or nonce every application script.
