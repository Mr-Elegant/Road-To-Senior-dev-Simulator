import { PracticeTestCase, ExecutionResultItem } from '@/types/practice';

export async function executeJavaScriptSandbox(
  code: string,
  testCases: PracticeTestCase[]
): Promise<{ passedCount: number; results: ExecutionResultItem[]; durationMs: number }> {
  const startTime = performance.now();
  const results: ExecutionResultItem[] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const logs: string[] = [];
    const testStart = performance.now();

    const captureLog = (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    const declaredFns = [...code.matchAll(/function\s+([a-zA-Z0-9_$]+)/g)].map((m) => m[1]);
    const customCheckers = declaredFns
      .filter((name) => !['solution', 'handler', 'solve', 'execute'].includes(name))
      .reverse()
      .map((name) => `: typeof ${name} === 'function' ? ${name}`)
      .join('\n        ');

    const sanitizedWrapper = `
      "use strict";
      const console = {
        log: (...args) => __log(...args),
        info: (...args) => __log(...args),
        warn: (...args) => __log(...args),
        error: (...args) => __log(...args),
      };
      const window = undefined;
      const document = undefined;
      const localStorage = undefined;
      const sessionStorage = undefined;
      const fetch = undefined;
      const XMLHttpRequest = undefined;
      const WebSocket = undefined;
      const Worker = undefined;
      const process = undefined;

      ${code}

      // Check common entrypoint function names
      const candidateFn = typeof solution === 'function' ? solution
        : typeof handler === 'function' ? handler
        : typeof solve === 'function' ? solve
        : typeof execute === 'function' ? execute
        ${customCheckers ? customCheckers : ''}
        : undefined;

      if (candidateFn) {
        return candidateFn(${tc.inputDescription || ''});
      }
      return undefined;
    `;

    try {
      const runnerPromise = new Promise<{ result: any }>(async (resolve, reject) => {
        try {
          const fn = new Function('__log', sanitizedWrapper);
          const rawResult = fn(captureLog);
          const result = rawResult && typeof rawResult.then === 'function' ? await rawResult : rawResult;
          resolve({ result });
        } catch (err: any) {
          reject(err);
        }
      });

      const timeoutPromise = new Promise<{ result: any }>((_, reject) => {
        setTimeout(() => reject(new Error('Execution Timeout (1500ms limit exceeded)')), 1500);
      });

      const outcome = await Promise.race([runnerPromise, timeoutPromise]);
      const durationMs = Math.round(performance.now() - testStart);

      let actualStr = '';
      if (outcome.result !== undefined) {
        actualStr = typeof outcome.result === 'object' ? JSON.stringify(outcome.result) : String(outcome.result);
      } else if (logs.length > 0) {
        actualStr = logs[logs.length - 1];
      }

      const normalizedActual = actualStr.trim().replace(/\s+/g, ' ');
      const normalizedExpected = tc.expectedOutput.trim().replace(/\s+/g, ' ');

      const isPass = normalizedActual === normalizedExpected ||
        (normalizedActual.length > 0 && normalizedExpected.includes(normalizedActual));

      if (isPass) passedCount++;

      results.push({
        testId: tc.id,
        name: tc.name,
        passed: isPass,
        input: tc.inputDescription,
        expectedOutput: tc.expectedOutput,
        actualOutput: actualStr || '(no return value)',
        logs,
        durationMs,
        errorMessage: isPass ? undefined : `Expected "${tc.expectedOutput}", received "${actualStr}"`,
      });
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - testStart);
      results.push({
        testId: tc.id,
        name: tc.name,
        passed: false,
        input: tc.inputDescription,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Runtime Exception',
        logs,
        durationMs,
        errorMessage: err.message || 'Error occurred during execution',
      });
    }
  }

  const overallDuration = Math.round(performance.now() - startTime);
  return { passedCount, results, durationMs: overallDuration };
}
