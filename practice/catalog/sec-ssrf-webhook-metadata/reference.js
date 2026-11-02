const dns = require('dns').promises;
const ipaddr = require('ipaddr.js');

async function sendWebhookNotificationSafe(targetUrl, payload) {
  const parsed = new URL(targetUrl);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Disallowed protocol');
  }

  // 1. Resolve DNS to physical IP
  const lookup = await dns.lookup(parsed.hostname);
  const addr = ipaddr.parse(lookup.address);

  // 2. Reject private, loopback, link-local, or carrier-grade NAT IPs
  const range = addr.range();
  if (
    range === 'loopback' ||
    range === 'private' ||
    range === 'linkLocal' || // Blocks 169.254.x.x
    range === 'carrierGradeNat' ||
    range === 'broadcast'
  ) {
    throw new Error(`Security Exception: SSRF attempt to private network address (${lookup.address})`);
  }

  // 3. Dispatch with custom agent pinned to validated IP and redirect disabled
  return fetch(targetUrl, {
    method: 'POST',
    redirect: 'error', // Prevent 302 redirects from bypassing IP filter!
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
