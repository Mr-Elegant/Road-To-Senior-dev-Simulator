import type { LoanLabExercise, LoanLabResult, LoanLabRun } from '@/types/loanLab';
import { executeLoanLabCase, sameLoanLabOutput } from './harness';

const workerSource = () => `
const executeCase = (${executeLoanLabCase.toString()});
self.onmessage = ({ data }) => {
  const logs = [];
  const send = self.postMessage.bind(self);
  const stringify = JSON.stringify.bind(JSON);
  const parse = JSON.parse.bind(JSON);
  const compile = Function;
  const capture = (...args) => {
    if (logs.length >= 20) return;
    try { logs.push(args.map(item => typeof item === 'string' ? item : stringify(item)).join(' ').slice(0, 500)); }
    catch { logs.push('[unserializable console output]'); }
  };
  console.log = console.info = console.warn = console.error = capture;
  try {
    const candidate = compile('"use strict";\\n' + data.code + '\\n;return ' + data.entryPoint + ';')();
    if (typeof candidate !== 'function') throw new Error('Define the documented entry-point function.');
    const actual = executeCase(candidate, data.kind, data.input);
    if (actual && typeof actual.then === 'function') throw new Error('Use a synchronous function for this exercise.');
    const encoded = stringify(actual);
    if (encoded === undefined) throw new Error('The function returned undefined. Return the documented result.');
    if (encoded.length > 64000) throw new Error('Test output exceeds the 64 KB limit.');
    send({ actual: parse(encoded), logs });
  } catch (error) {
    send({ error: String(error && error.message || error).slice(0, 1000), logs });
  }
};`;

/** The bootstrap contains only trusted source. Candidate text is transferred later as data. */
export function loanLabFrameDocument(): string {
  const source = JSON.stringify(workerSource()).replace(/</g, '\\u003c');
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; child-src blob:; connect-src 'none'; form-action 'none'; base-uri 'none'"><script>
  let initialized = false;
  addEventListener('message', event => {
    if (initialized || event.source !== parent || event.data !== 'loan-lab-init' || !event.ports[0]) return;
    initialized = true;
    const port = event.ports[0];
    const source = ${source};
    let active;
    port.onmessage = ({ data }) => {
      if (data.type === 'cancel') { if (active) active(); return; }
      const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      let worker;
      try { worker = new Worker(url); }
      catch (error) { URL.revokeObjectURL(url); port.postMessage({ id: data.id, error: String(error.message), logs: [] }); return; }
      let finished = false;
      const finish = result => {
        if (finished) return;
        finished = true;
        clearTimeout(timer); worker.terminate(); URL.revokeObjectURL(url); active = undefined;
        port.postMessage({ id: data.id, ...result });
      };
      const timer = setTimeout(() => finish({ error: 'Execution timed out (1500 ms). Fix the blocking loop or excessive work.', logs: [] }), 1500);
      active = () => finish({ error: 'Execution cancelled.', logs: [] });
      worker.onmessage = event => finish(event.data && typeof event.data === 'object' ? event.data : { error: 'Invalid worker result.', logs: [] });
      worker.onerror = event => { event.preventDefault(); finish({ error: event.message || 'Worker execution failed.', logs: [] }); };
      worker.postMessage(data);
    };
    port.start();
    port.postMessage({ id: 'ready' });
  });
  </script>`;
}

interface Reply { id: string; actual?: unknown; error?: string; logs?: unknown[] }

export async function runLoanLab(exercise: LoanLabExercise, code: string, mode: 'sample' | 'submit', signal: AbortSignal): Promise<LoanLabRun> {
  if (typeof document === 'undefined') throw new Error('Run loan exercises in the browser.');
  if (code.length > 100000) throw new Error('Code exceeds the 100,000 character limit.');
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.setAttribute('aria-hidden', 'true');
  frame.title = 'Isolated loan exercise runner';
  frame.hidden = true;
  frame.referrerPolicy = 'no-referrer';
  frame.srcdoc = loanLabFrameDocument();
  const channel = new MessageChannel();
  const started = performance.now();
  const tests = exercise.tests.filter((test) => mode === 'submit' || test.sample);
  const results: LoanLabResult[] = [];

  function exchange(id: string, send: () => void): Promise<Reply> {
    if (signal.aborted) return Promise.reject(new DOMException('Execution cancelled.', 'AbortError'));
    return new Promise((resolve, reject) => {
      const finish = (error?: Error, reply?: Reply) => {
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        channel.port1.onmessage = null;
        if (error) reject(error); else resolve(reply!);
      };
      const abort = () => finish(new DOMException('Execution cancelled.', 'AbortError'));
      const timer = setTimeout(() => finish(new Error('The isolated runner did not respond. Check browser support and retry.')), 5000);
      signal.addEventListener('abort', abort, { once: true });
      channel.port1.onmessage = ({ data }: MessageEvent<Reply>) => {
        if (!data || data.id !== id) return;
        finish(undefined, data);
      };
      try { send(); } catch (error) { finish(error instanceof Error ? error : new Error('Runner initialization failed.')); }
    });
  }

  try {
    await exchange('ready', () => {
      frame.onload = () => frame.contentWindow?.postMessage('loan-lab-init', '*', [channel.port2]);
      document.body.appendChild(frame);
    });
    for (const test of tests) {
      const reply = await exchange(test.id, () => channel.port1.postMessage({ id: test.id, code, entryPoint: exercise.entryPoint, kind: exercise.kind, input: test.input }));
      let actual: unknown;
      let error = typeof reply.error === 'string' ? reply.error.slice(0, 1000) : undefined;
      if (!error) {
        try {
          const encoded = JSON.stringify(reply.actual);
          if (encoded === undefined || encoded.length > 64000) throw new Error('Invalid or oversized output.');
          actual = JSON.parse(encoded);
        } catch { error = 'The result could not be read. Return a small JSON-compatible value.'; }
      }
      results.push({ testId: test.id, name: test.name, actual, error, passed: !error && sameLoanLabOutput(actual, test.expected), logs: Array.isArray(reply.logs) ? reply.logs.filter((line): line is string => typeof line === 'string').slice(0, 20).map((line) => line.slice(0, 500)) : [] });
      if (error?.includes('timed out')) break;
    }
    // Preserve the full denominator if a blocking answer stops the remaining tests.
    for (const test of tests.slice(results.length)) results.push({ testId: test.id, name: test.name, passed: false, error: 'Not run after the preceding timeout. Fix the loop and retry.', logs: [] });
    if (signal.aborted) throw new DOMException('Execution cancelled.', 'AbortError');
    return { mode, results, passed: results.filter((result) => result.passed).length, total: tests.length, durationMs: Math.round(performance.now() - started) };
  } finally {
    channel.port1.postMessage({ type: 'cancel' });
    channel.port1.close(); channel.port2.close(); frame.remove();
  }
}
