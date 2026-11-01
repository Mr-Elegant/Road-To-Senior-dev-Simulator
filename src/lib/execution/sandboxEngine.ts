import {
  SupportedLanguage,
  PracticeTestCase,
  SqlDatabaseSetup,
  CodeExecutionSuiteResult,
} from '@/types/practice';
import { executeJavaScriptSandbox } from './jsSandbox';
import { executeSqlSandbox } from './sqlSandbox';
import { stripTypeScriptTypes } from './typeScriptStripper';

export async function runSandboxedCode(
  language: SupportedLanguage,
  code: string,
  testCases: PracticeTestCase[],
  sqlSetup?: SqlDatabaseSetup[]
): Promise<CodeExecutionSuiteResult> {
  const normLang = language.toLowerCase() as SupportedLanguage;

  // 1. JavaScript Execution (In-browser isolated sandbox)
  if (normLang === 'javascript') {
    const { passedCount, results, durationMs } = await executeJavaScriptSandbox(code, testCases);
    return {
      isConfigured: true,
      language: 'javascript',
      statusMessage: 'Executed in browser client-side sandbox. Zero arbitrary server execution.',
      passedTests: passedCount,
      totalTests: testCases.length,
      results,
      overallDurationMs: durationMs,
      hasErrors: passedCount < testCases.length,
    };
  }

  // 2. TypeScript Execution (Type-stripped client-side execution)
  if (normLang === 'typescript') {
    const transpiledJs = stripTypeScriptTypes(code);
    const { passedCount, results, durationMs } = await executeJavaScriptSandbox(transpiledJs, testCases);
    return {
      isConfigured: true,
      language: 'typescript',
      statusMessage: 'Transpiled and executed in client-side TypeScript sandbox.',
      passedTests: passedCount,
      totalTests: testCases.length,
      results,
      overallDurationMs: durationMs,
      hasErrors: passedCount < testCases.length,
    };
  }

  // 3. SQL Execution (In-browser in-memory SQL engine via AlaSQL)
  if (normLang === 'sql') {
    const { passedCount, results, durationMs } = await executeSqlSandbox(code, testCases, sqlSetup);
    return {
      isConfigured: true,
      language: 'sql',
      statusMessage: 'Executed in client-side relational SQL sandbox (in-memory isolated database).',
      passedTests: passedCount,
      totalTests: testCases.length,
      results,
      overallDurationMs: durationMs,
      hasErrors: passedCount < testCases.length,
    };
  }

  // 4. Unconfigured / Remote Execution Languages (Python, Go, Rust, etc.)
  return {
    isConfigured: false,
    language: normLang,
    statusMessage: `Remote Execution Service Not Configured for ${language.toUpperCase()}. In accordance with security specifications, arbitrary user code is NEVER executed on the application web server. To execute ${language.toUpperCase()}, connect a containerized remote execution cluster (e.g. Firecracker or gVisor sandbox). Please use manual solution review and rubric evaluation.`,
    passedTests: 0,
    totalTests: testCases.length,
    results: testCases.map((tc) => ({
      testId: tc.id,
      name: tc.name,
      passed: false,
      input: tc.inputDescription,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'Execution Service Unconfigured',
      logs: [],
      durationMs: 0,
      errorMessage: `Execution service for ${language} is not configured. Manual solution comparison provided below.`,
    })),
    overallDurationMs: 0,
    hasErrors: true,
  };
}

