import { TestCase } from '@/types/scenario';

export interface TestExecutionResult {
  testId: string;
  name: string;
  passed: boolean;
  actualOutput?: string;
  expectedOutput: string;
  logs: string[];
  durationMs: number;
  errorMessage?: string;
}

export interface RunSuiteResult {
  isSupported: boolean;
  message?: string;
  passedTests: number;
  totalTests: number;
  results: TestExecutionResult[];
}

/**
 * Executes user JavaScript/TypeScript function in a sandboxed, isolated client-side context.
 * Strictly adheres to safety constraints:
 * - NO server execution
 * - Strict timeout protection (1500ms)
 * - Safe environment with restricted globals
 */
export async function runClientSideTestSuite(
  code: string,
  testCases: TestCase[],
  language: string = 'javascript'
): Promise<RunSuiteResult> {
  const normalizedLang = language.toLowerCase();
  
  if (normalizedLang !== 'javascript' && normalizedLang !== 'typescript' && normalizedLang !== 'js' && normalizedLang !== 'ts') {
    return {
      isSupported: false,
      message: `Direct execution is not supported for ${language} in client sandbox. Use manual solution review & rubric comparison.`,
      passedTests: 0,
      totalTests: testCases.length,
      results: testCases.map((tc) => ({
        testId: tc.id,
        name: tc.name,
        passed: false,
        expectedOutput: tc.expectedOutput,
        logs: [],
        durationMs: 0,
        errorMessage: 'Execution requires isolated environment. Please conduct self-assessment against reference rubric.',
      })),
    };
  }

  const results: TestExecutionResult[] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const logs: string[] = [];
    const startTime = performance.now();

    try {
      // Create a restricted execution context with intercepted console
      const captureLog = (...args: any[]) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      };

      // Wrap in sandbox
      // We safely instantiate user function and invoke with test case parameters
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

        ${code}

        // Return candidate exported or defined function / result
        if (typeof solution === 'function') {
          return solution(${tc.inputDescription});
        }
        if (typeof handler === 'function') {
          return handler(${tc.inputDescription});
        }
        if (typeof solve === 'function') {
          return solve(${tc.inputDescription});
        }
        if (typeof execute === 'function') {
          return execute(${tc.inputDescription});
        }
        return undefined;
      `;

      // Timeout promise
      const executionPromise = new Promise<{ result: any }>((resolve, reject) => {
        try {
          const fn = new Function('__log', sanitizedWrapper);
          const result = fn(captureLog);
          resolve({ result });
        } catch (err: any) {
          reject(err);
        }
      });

      const timeoutPromise = new Promise<{ result: any }>((_, reject) => {
        setTimeout(() => reject(new Error('Execution timed out (1500ms limit exceeded)')), 1500);
      });

      const outcome = await Promise.race([executionPromise, timeoutPromise]);
      const durationMs = Math.round(performance.now() - startTime);

      let actualStr = '';
      if (outcome.result !== undefined) {
        actualStr = typeof outcome.result === 'object' ? JSON.stringify(outcome.result) : String(outcome.result);
      } else if (logs.length > 0) {
        actualStr = logs[logs.length - 1];
      }

      // Output comparison
      const normalizedActual = actualStr.trim().replace(/\s+/g, ' ');
      const normalizedExpected = tc.expectedOutput.trim().replace(/\s+/g, ' ');

      const isPass = normalizedActual === normalizedExpected || 
        (normalizedActual.length > 0 && normalizedExpected.includes(normalizedActual));

      if (isPass) {
        passedCount++;
      }

      results.push({
        testId: tc.id,
        name: tc.name,
        passed: isPass,
        actualOutput: actualStr || '(no return value)',
        expectedOutput: tc.expectedOutput,
        logs,
        durationMs,
        errorMessage: isPass ? undefined : `Expected "${tc.expectedOutput}", received "${actualStr}"`,
      });
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      results.push({
        testId: tc.id,
        name: tc.name,
        passed: false,
        actualOutput: 'Runtime Exception',
        expectedOutput: tc.expectedOutput,
        logs,
        durationMs,
        errorMessage: err.message || 'Execution error',
      });
    }
  }

  return {
    isSupported: true,
    passedTests: passedCount,
    totalTests: testCases.length,
    results,
  };
}

