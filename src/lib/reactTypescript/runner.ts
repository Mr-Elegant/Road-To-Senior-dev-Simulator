/** The compiler Worker parses source only; execution stays in the opaque React iframe. */
export function checkReactTypes(code: string, signal: AbortSignal): Promise<string[]> {
  signal.throwIfAborted();
  if (code.length > 100000) return Promise.resolve(['Code exceeds the 100,000 character limit.']);
  return new Promise((resolve, reject) => {
    const worker = new Worker('/react-typescript-worker.js');
    const finish = (errors?: string[], failure?: Error) => {
      clearTimeout(timer); worker.terminate(); signal.removeEventListener('abort', abort);
      if (failure) reject(failure); else resolve(errors!);
    };
    const abort = () => finish(undefined, new DOMException('Type checking cancelled.', 'AbortError'));
    const timer = setTimeout(() => finish(['Type checking exceeded 15 seconds. Retry with a smaller solution.']), 15000);
    worker.onmessage = ({ data }: MessageEvent<{ errors: string[] }>) => finish(data.errors);
    worker.onerror = event => { event.preventDefault(); finish(['TypeScript compiler unavailable. Rebuild and retry.']); };
    signal.addEventListener('abort', abort, { once: true });
    worker.postMessage({ code });
  });
}
