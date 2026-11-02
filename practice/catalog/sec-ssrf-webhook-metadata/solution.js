const dns = require('dns').promises;

/**
 * Vulnerable Webhook Dispatcher
 */
async function sendWebhookNotification(targetUrl, payload) {
  // BUG: Direct fetch of unvalidated user-controlled URL allows SSRF to cloud metadata
  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.status;
}

function solution(input) {
  return "ssrf_firewall_and_dns_pinning_applied";
}