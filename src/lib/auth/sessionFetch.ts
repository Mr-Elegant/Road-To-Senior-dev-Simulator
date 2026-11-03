'use client';

/** Bound session reads even when the auth SDK supplies its own cancellation signal. */
export const sessionFetch: typeof fetch = (input, init) => {
  const url = input instanceof Request ? input.url : String(input);
  if (new URL(url, 'http://localhost').pathname !== '/api/auth/get-session') return fetch(input, init);
  const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
  const signal = AbortSignal.any([AbortSignal.timeout(15000), ...(callerSignal ? [callerSignal] : [])]);
  return fetch(input, { ...init, signal });
};
