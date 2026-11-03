import type { ReactJourney } from '@/types/reactExercise';
import type { Scenario } from '@/types/scenario';
import type { RunSuiteResult } from '@/lib/evaluation/safeCodeRunner';

// Native submit events need allow-forms; CSP still blocks form-action navigation.
export const REACT_FRAME_SANDBOX = 'allow-scripts allow-forms';

export function reactFrameDocument(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:16px;font:15px system-ui;background:#fff;color:#18181b}*{box-sizing:border-box}input,select,button{font:inherit;max-width:100%;margin:4px;padding:8px;border:1px solid #a1a1aa;border-radius:5px}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #2563eb}ul{padding-left:24px}#error{white-space:pre-wrap;color:#b91c1c;overflow-wrap:anywhere}progress{max-width:100%}</style></head><body><div id="root"></div><pre id="error" role="alert"></pre>
<script>
let initialized = false;
addEventListener('message', event => {
  if(initialized || event.source !== parent || event.data !== 'react-practice-init' || !event.ports[0]) return;
  initialized = true;
  const port = event.ports[0];
  port.onmessage = async ({data}) => {
    try {
      const execute = new Function(data.runtime + ';return ReactPractice.execute;')();
      port.postMessage(await execute(data.code, data.journey, data.typescript));
    } catch(error) { port.postMessage({passed:false,error:String(error.message).slice(0,1000)}); }
  };
  port.start(); port.postMessage({ready:true});
});
</script></body></html>`;
}

let runtimePromise: Promise<string> | undefined;
async function runtimeSource() {
  // Cache trusted runtime code, never candidate source or account information.
  if (!runtimePromise) runtimePromise = fetch('/react-practice-runtime.js', { signal: AbortSignal.timeout(15000) })
    .then(async response => { if (!response.ok) throw new Error('React runtime unavailable. Rebuild the app and retry.'); return response.text(); })
    .catch(error => { runtimePromise = undefined; throw error; });
  return runtimePromise;
}

interface Reply { ready?: boolean; passed?: boolean; error?: string }

/** Opaque-origin DOM isolation. A browser iframe cannot guarantee preemption of synchronous loops. */
export async function runReactFrame(host: HTMLElement, code: string, journey: ReactJourney | undefined, signal: AbortSignal, typescript = false): Promise<Reply> {
  if (code.length > 100000) throw new Error('Code exceeds the 100,000 character limit.');
  const runtime = await runtimeSource();
  signal.throwIfAborted();
  const frame = document.createElement('iframe');
  frame.title = journey ? 'React exercise tests' : 'React component preview';
  if (journey) frame.tabIndex = -1;
  frame.setAttribute('sandbox', REACT_FRAME_SANDBOX);
  frame.referrerPolicy = 'no-referrer';
  frame.className = 'w-full h-full border-0 bg-white';
  frame.srcdoc = reactFrameDocument();
  const channel = new MessageChannel();
  return new Promise((resolve, reject) => {
    let settled = false;
    const dispose = () => { frame.remove(); channel.port1.close(); channel.port2.close(); signal.removeEventListener('abort', abort); };
    const finish = (error?: Error, reply?: Reply) => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      channel.port1.close(); channel.port2.close();
      if (journey || error) dispose();
      // Preview stays mounted until the component cancels or refreshes it.
      if (error) reject(error); else resolve(reply!);
    };
    const abort = () => { finish(new DOMException('Execution cancelled.', 'AbortError')); dispose(); };
    const timer = setTimeout(() => finish(new Error('React runner did not respond within 8 seconds. Check your code and retry.')), 8000);
    signal.addEventListener('abort', abort, { once: true });
    channel.port1.onmessage = ({ data }: MessageEvent<Reply>) => {
      if (data?.ready) channel.port1.postMessage({ runtime, code, journey, typescript });
      else if (typeof data?.passed === 'boolean') finish(undefined, data);
    };
    frame.onload = () => frame.contentWindow?.postMessage('react-practice-init', '*', [channel.port2]);
    host.replaceChildren(frame);
  });
}

export async function runReactSuite(scenario: Scenario, code: string, signal: AbortSignal): Promise<RunSuiteResult> {
  if (scenario.reactTypescriptExercise) {
    const errors = await (await import('@/lib/reactTypescript/runner')).checkReactTypes(code, signal);
    if (errors.length) return { isSupported: true, totalTests: scenario.testCases?.length ?? 0, passedTests: 0,
      results: (scenario.testCases ?? []).map(test => ({ testId: test.id, name: test.name, passed: false, expectedOutput: test.expectedOutput, actualOutput: 'Type check failed', errorMessage: errors.join('\n'), logs: [], durationMs: 0 })) };
  }
  const host = document.createElement('div');
  // display:none prevents native focus events and document.activeElement checks.
  // Render offscreen so focus/ref exercises run against an actual focusable DOM.
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:600px;opacity:0;pointer-events:none';
  document.body.appendChild(host);
  const results: RunSuiteResult['results'] = [];
  try {
    for (const test of scenario.testCases ?? []) {
      signal.throwIfAborted();
      const start = performance.now();
      let reply: Reply;
      try { reply = await runReactFrame(host, code, JSON.parse(test.inputDescription), signal, Boolean(scenario.reactTypescriptExercise)); }
      catch (error) { signal.throwIfAborted(); reply = { passed: false, error: error instanceof Error ? error.message : 'Runner failed.' }; }
      results.push({ testId: test.id, name: test.name, passed: reply.passed === true, expectedOutput: test.expectedOutput,
        actualOutput: reply.passed ? 'All DOM assertions passed' : reply.error, errorMessage: reply.error,
        logs: [], durationMs: Math.round(performance.now() - start) });
    }
  } finally { host.remove(); }
  return { isSupported: true, results, totalTests: results.length, passedTests: results.filter(r => r.passed).length };
}
