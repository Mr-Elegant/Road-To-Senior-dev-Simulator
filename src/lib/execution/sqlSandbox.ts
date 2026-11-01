import alasql from 'alasql';
import { PracticeTestCase, SqlDatabaseSetup, ExecutionResultItem } from '@/types/practice';

export async function executeSqlSandbox(
  userQuery: string,
  testCases: PracticeTestCase[],
  sqlSetup?: SqlDatabaseSetup[]
): Promise<{ passedCount: number; results: ExecutionResultItem[]; durationMs: number }> {
  const startTime = performance.now();
  const results: ExecutionResultItem[] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const testStart = performance.now();
    const logs: string[] = [];

    try {
      // 1. Create a fresh in-memory database for complete isolation between test cases
      const dbId = `db_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      alasql(`CREATE DATABASE ${dbId}; USE ${dbId};`);

      // 2. Run DDL & Seed scripts if provided
      if (sqlSetup && sqlSetup.length > 0) {
        for (const setup of sqlSetup) {
          if (setup.schemaSql) {
            alasql(setup.schemaSql);
          }
          if (setup.seedDataSql) {
            alasql(setup.seedDataSql);
          }
        }
      }

      // If test case has individual setup SQL or parameters
      if (tc.inputDescription && tc.inputDescription.trim().startsWith('INSERT')) {
        alasql(tc.inputDescription);
      }

      // 3. Execute Candidate SQL Query
      const queryTrimmed = userQuery.trim().replace(/;+$/, '');
      const queryResult = alasql(queryTrimmed);
      const durationMs = Math.round(performance.now() - testStart);

      const tableData = Array.isArray(queryResult) ? queryResult : [{ result: queryResult }];
      const actualJsonStr = JSON.stringify(tableData);

      // 4. Output verification against expected output
      const normalizedActual = actualJsonStr.trim().replace(/\s+/g, '');
      const normalizedExpected = tc.expectedOutput.trim().replace(/\s+/g, '');

      // Check exact JSON match or partial/normalized match
      let isPass = normalizedActual === normalizedExpected;
      if (!isPass) {
        // Try loose comparison: ignore row order or single scalar comparison
        try {
          const actualParsed = JSON.parse(actualJsonStr);
          const expectedParsed = JSON.parse(tc.expectedOutput);
          if (Array.isArray(actualParsed) && Array.isArray(expectedParsed)) {
            isPass = actualParsed.length === expectedParsed.length &&
              JSON.stringify(actualParsed[0]) === JSON.stringify(expectedParsed[0]);
          }
        } catch {
          isPass = actualJsonStr.includes(tc.expectedOutput.trim());
        }
      }

      if (isPass) passedCount++;

      // Drop temporary in-memory database to free memory
      try {
        alasql(`DROP DATABASE ${dbId};`);
      } catch {}

      results.push({
        testId: tc.id,
        name: tc.name,
        passed: isPass,
        input: tc.inputDescription || 'Standard Database State',
        expectedOutput: tc.expectedOutput,
        actualOutput: actualJsonStr,
        logs: [`Executed query in ${durationMs}ms: returned ${tableData.length} row(s)`],
        durationMs,
        tableData,
        errorMessage: isPass ? undefined : `Query result did not match expected output.`,
      });
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - testStart);
      results.push({
        testId: tc.id,
        name: tc.name,
        passed: false,
        input: tc.inputDescription || 'Database State',
        expectedOutput: tc.expectedOutput,
        actualOutput: 'SQL Execution Error',
        logs,
        durationMs,
        errorMessage: err.message || 'Syntax or evaluation error in SQL statement',
      });
    }
  }

  const overallDuration = Math.round(performance.now() - startTime);
  return { passedCount, results, durationMs: overallDuration };
}

