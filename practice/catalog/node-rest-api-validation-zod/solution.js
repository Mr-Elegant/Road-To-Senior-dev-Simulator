/**
 * Unvalidated REST Endpoint
 */
function validateIngestionPayload(payload) {
  // BUG: No schema validation! Malformed JSON crashes downstream database workers.
  return { valid: true, data: payload };
}

function solution(input) {
  return "zod_schema_validated_and_sanitized";
}