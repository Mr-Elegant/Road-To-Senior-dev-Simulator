import alasql from 'alasql';
import { PGlite } from '@electric-sql/pglite';
import { getDatasetById } from '@/data/sql/datasets';
import {
  SqlDatasetId,
  SqlExecutionOutcome,
  SqlQuestion,
  SqlTestCase,
  IntrospectedTable,
  IntrospectedColumn
} from '@/types/sqlTrack';

/**
 * Statement splitter that respects single and double quotes.
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (inString) {
      current += char;
      if (char === stringChar) {
        if (sql[i + 1] === stringChar) {
          current += sql[++i]; // escaped quote
        } else {
          inString = false;
        }
      }
    } else {
      if (char === "'" || char === '"') {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === ';') {
        if (current.trim().length > 0) {
          statements.push(current.trim());
        }
        current = '';
      } else {
        current += char;
      }
    }
  }
  if (current.trim().length > 0) {
    statements.push(current.trim());
  }
  return statements;
}

/**
 * Runs a SQL query string through PGlite.
 * Non-final statements run via pg.exec; final result query runs via pg.query.
 */
async function runPgLiteStatements(pg: PGlite, sql: string): Promise<any> {
  const stmts = splitSqlStatements(sql);
  let lastResult: any = { rows: [], fields: [] };

  for (let i = 0; i < stmts.length; i++) {
    const s = stmts[i];
    const isFinal = i === stmts.length - 1;
    const isReturningOrSelect = /^\s*(SELECT|WITH|SHOW|EXPLAIN|UPDATE[\s\S]*?RETURNING|DELETE[\s\S]*?RETURNING|INSERT[\s\S]*?RETURNING)/i.test(s);

    if (isFinal && isReturningOrSelect) {
      lastResult = await pg.query(s);
    } else {
      await pg.exec(s);
    }
  }
  return lastResult;
}

/**
 * Executes a promise with an execution timeout guard.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 4000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Query execution timed out after ${timeoutMs}ms.`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Execute a query against a specific dataset in the appropriate engine:
 * - PGlite (WebAssembly) for PostgreSQL dialect
 * - AlaSQL for generic SQL dialect
 */
export async function runQueryAgainstDataset(
  query: string,
  datasetId?: SqlDatasetId,
  customSetupSql?: string,
  dialect: 'generic-sql' | 'postgresql' = 'generic-sql'
): Promise<SqlExecutionOutcome> {
  const start = performance.now();

  const cleanedQuery = cleanSqlStatement(query);
  if (!cleanedQuery) {
    return {
      passed: false,
      columns: [],
      rows: [],
      rowCount: 0,
      durationMs: 0,
      engineUsed: dialect === 'postgresql' ? 'pglite' : 'alasql',
      error: 'Query is empty. Please enter a valid SQL query.'
    };
  }

  if (dialect === 'postgresql') {
    let pg: PGlite | null = null;
    try {
      pg = new PGlite();

      const executePg = async () => {
        if (!pg) return { rows: [], fields: [] };

        // 1. Seed base dataset
        if (datasetId) {
          const dataset = getDatasetById(datasetId);
          if (dataset) {
            if (dataset.schemaSql) await pg.exec(dataset.schemaSql);
            if (dataset.seedSql) await pg.exec(dataset.seedSql);
          }
        }

        // 2. Custom setup SQL (drop colliding tables first)
        if (customSetupSql && customSetupSql.trim().length > 0) {
          const tableMatches = [...customSetupSql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi)];
          for (const tm of tableMatches) {
            await pg.exec(`DROP TABLE IF EXISTS ${tm[1]} CASCADE;`);
          }
          await pg.exec(customSetupSql);
        }

        // 3. Execute query
        return await runPgLiteStatements(pg, cleanedQuery);
      };

      const result = await withTimeout(executePg(), 4000);
      const durationMs = Math.round((performance.now() - start) * 10) / 10;
      const rows = normalizeResultRows(result.rows || []);
      const columns = rows.length > 0
        ? Object.keys(rows[0])
        : (result.fields ? result.fields.map((f: any) => f.name) : []);

      return {
        passed: true,
        columns,
        rows,
        rowCount: rows.length,
        durationMs,
        engineUsed: 'pglite'
      };
    } catch (err: any) {
      const durationMs = Math.round((performance.now() - start) * 10) / 10;
      return {
        passed: false,
        columns: [],
        rows: [],
        rowCount: 0,
        durationMs,
        engineUsed: 'pglite',
        error: err?.message || 'PostgreSQL execution failed.'
      };
    } finally {
      if (pg) {
        try {
          await pg.close();
        } catch {}
      }
    }
  }

  // AlaSQL execution
  const dbId = `sqldb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  try {
    alasql(`CREATE DATABASE ${dbId}; USE ${dbId};`);

    if (datasetId) {
      const dataset = getDatasetById(datasetId);
      if (dataset) {
        if (dataset.schemaSql) executeMultiStatementSql(dataset.schemaSql);
        if (dataset.seedSql) executeMultiStatementSql(dataset.seedSql);
      }
    }

    if (customSetupSql && customSetupSql.trim().length > 0) {
      executeMultiStatementSql(customSetupSql);
    }

    const rawResult = alasql(cleanedQuery);
    const durationMs = Math.round((performance.now() - start) * 10) / 10;

    const rows = normalizeResultRows(rawResult);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return {
      passed: true,
      columns,
      rows,
      rowCount: rows.length,
      durationMs,
      engineUsed: 'alasql'
    };
  } catch (err: any) {
    const durationMs = Math.round((performance.now() - start) * 10) / 10;
    return {
      passed: false,
      columns: [],
      rows: [],
      rowCount: 0,
      durationMs,
      engineUsed: 'alasql',
      error: err?.message || 'SQL execution failed with an unexpected error.'
    };
  } finally {
    try {
      alasql(`DROP DATABASE ${dbId};`);
    } catch {}
  }
}

/**
 * Evaluates candidate SQL for an executable question against all its test cases.
 */
export async function evaluateExecutableSql(
  candidateSql: string,
  question: SqlQuestion
): Promise<{
  allPassed: boolean;
  score: number;
  engineUsed: 'alasql' | 'pglite';
  testCaseResults: {
    testCaseId: string;
    description: string;
    passed: boolean;
    durationMs: number;
    error?: string;
    actualRows?: Record<string, any>[];
    expectedRows?: Record<string, any>[];
    diffMessage?: string;
  }[];
}> {
  const isPostgres =
    question.executionDialect === 'postgresql' ||
    question.tier === 'tier-3' ||
    question.tier === 'tier-4';

  const engineUsed: 'alasql' | 'pglite' = isPostgres ? 'pglite' : 'alasql';
  const testCases = question.testCases || [];

  if (testCases.length === 0) {
    const outcome = await runQueryAgainstDataset(candidateSql, question.datasetId, undefined, isPostgres ? 'postgresql' : 'generic-sql');
    return {
      allPassed: outcome.passed && !outcome.error,
      score: outcome.passed && !outcome.error ? 100 : 0,
      engineUsed,
      testCaseResults: [
        {
          testCaseId: 'default',
          description: 'Basic Execution and Syntax Verification',
          passed: outcome.passed && !outcome.error,
          durationMs: outcome.durationMs,
          error: outcome.error,
          actualRows: outcome.rows
        }
      ]
    };
  }

  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const start = performance.now();

    if (isPostgres) {
      let pg: PGlite | null = null;
      try {
        pg = new PGlite();

        if (question.datasetId) {
          const dataset = getDatasetById(question.datasetId);
          if (dataset) {
            if (dataset.schemaSql) await pg.exec(dataset.schemaSql);
            if (dataset.seedSql) await pg.exec(dataset.seedSql);
          }
        }

        if (tc.setupSql && tc.setupSql.trim().length > 0) {
          const tableMatches = [...tc.setupSql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi)];
          for (const tm of tableMatches) {
            await pg.exec(`DROP TABLE IF EXISTS ${tm[1]} CASCADE;`);
          }
          await pg.exec(tc.setupSql);
        }

        const cleanedCandidate = cleanSqlStatement(candidateSql);
        const actualRes = await withTimeout(runPgLiteStatements(pg, cleanedCandidate), 4000);
        const actualRows = normalizeResultRows(actualRes.rows || []);

        let expectedRows: Record<string, any>[] = [];
        if (tc.expectedRows) {
          expectedRows = tc.expectedRows;
        } else if (tc.expectedOutputSql) {
          const expRes = await runPgLiteStatements(pg, cleanSqlStatement(tc.expectedOutputSql));
          expectedRows = normalizeResultRows(expRes.rows || []);
        } else if (question.sqlSolution) {
          const expRes = await runPgLiteStatements(pg, cleanSqlStatement(question.sqlSolution));
          expectedRows = normalizeResultRows(expRes.rows || []);
        }

        const diff = compareResultSets(actualRows, expectedRows, tc.orderMatters ?? false);
        const durationMs = Math.round((performance.now() - start) * 10) / 10;

        if (diff.matches) {
          passedCount++;
          results.push({
            testCaseId: tc.id,
            description: tc.description,
            passed: true,
            durationMs,
            actualRows,
            expectedRows
          });
        } else {
          results.push({
            testCaseId: tc.id,
            description: tc.description,
            passed: false,
            durationMs,
            actualRows,
            expectedRows,
            diffMessage: diff.message
          });
        }
      } catch (err: any) {
        const durationMs = Math.round((performance.now() - start) * 10) / 10;
        results.push({
          testCaseId: tc.id,
          description: tc.description,
          passed: false,
          durationMs,
          error: err?.message || 'PostgreSQL execution error'
        });
      } finally {
        if (pg) {
          try {
            await pg.close();
          } catch {}
        }
      }
    } else {
      // AlaSQL evaluation
      const dbId = `sqltc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      try {
        alasql(`CREATE DATABASE ${dbId}; USE ${dbId};`);

        if (question.datasetId) {
          const dataset = getDatasetById(question.datasetId);
          if (dataset) {
            if (dataset.schemaSql) executeMultiStatementSql(dataset.schemaSql);
            if (dataset.seedSql) executeMultiStatementSql(dataset.seedSql);
          }
        }

        if (tc.setupSql && tc.setupSql.trim().length > 0) {
          executeMultiStatementSql(tc.setupSql);
        }

        const cleanedCandidate = cleanSqlStatement(candidateSql);
        const rawActual = alasql(cleanedCandidate);
        const actualRows = normalizeResultRows(rawActual);

        let expectedRows: Record<string, any>[] = [];
        if (tc.expectedRows) {
          expectedRows = tc.expectedRows;
        } else if (tc.expectedOutputSql) {
          const rawExpected = alasql(cleanSqlStatement(tc.expectedOutputSql));
          expectedRows = normalizeResultRows(rawExpected);
        } else if (question.sqlSolution) {
          const rawExpected = alasql(cleanSqlStatement(question.sqlSolution));
          expectedRows = normalizeResultRows(rawExpected);
        }

        const diff = compareResultSets(actualRows, expectedRows, tc.orderMatters ?? false);
        const durationMs = Math.round((performance.now() - start) * 10) / 10;

        if (diff.matches) {
          passedCount++;
          results.push({
            testCaseId: tc.id,
            description: tc.description,
            passed: true,
            durationMs,
            actualRows,
            expectedRows
          });
        } else {
          results.push({
            testCaseId: tc.id,
            description: tc.description,
            passed: false,
            durationMs,
            actualRows,
            expectedRows,
            diffMessage: diff.message
          });
        }
      } catch (err: any) {
        const durationMs = Math.round((performance.now() - start) * 10) / 10;
        results.push({
          testCaseId: tc.id,
          description: tc.description,
          passed: false,
          durationMs,
          error: err?.message || 'Execution error'
        });
      } finally {
        try {
          alasql(`DROP DATABASE ${dbId};`);
        } catch {}
      }
    }
  }

  const allPassed = passedCount === testCases.length;
  const score = Math.round((passedCount / testCases.length) * 100);

  return {
    allPassed,
    score,
    engineUsed,
    testCaseResults: results
  };
}

/**
 * Runtime schema introspection querying the actual live engine.
 */
export async function introspectSchema(
  datasetId: SqlDatasetId,
  engine: 'alasql' | 'pglite' = 'pglite'
): Promise<IntrospectedTable[]> {
  const dataset = getDatasetById(datasetId);
  if (!dataset) return [];

  if (engine === 'pglite') {
    const pg = new PGlite();
    try {
      if (dataset.schemaSql) await pg.exec(dataset.schemaSql);
      if (dataset.seedSql) await pg.exec(dataset.seedSql);

      const tablesRes = await pg.query<{ table_name: string }>(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `);

      const tables: IntrospectedTable[] = [];

      for (const tRow of tablesRes.rows) {
        const tableName = tRow.table_name;
        const countRes = await pg.query<{ count: string | number }>(`SELECT COUNT(*) AS count FROM ${tableName};`);
        const rowCount = Number(countRes.rows[0]?.count || 0);

        const colsRes = await pg.query<{ column_name: string; data_type: string; is_nullable: string }>(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);

        const columns: IntrospectedColumn[] = colsRes.rows.map((c) => ({
          name: c.column_name,
          type: c.data_type.toUpperCase(),
          nullable: c.is_nullable === 'YES'
        }));

        tables.push({
          name: tableName,
          rowCount,
          columns
        });
      }
      return tables;
    } finally {
      await pg.close().catch(() => {});
    }
  }

  // AlaSQL schema introspection fallback
  return dataset.tables.map((t) => ({
    name: t.name,
    rowCount: t.sampleRowCount,
    columns: t.columns.map((c) => ({
      name: c.name,
      type: c.type,
      nullable: true,
      isPrimaryKey: c.isPrimaryKey
    }))
  }));
}

// -----------------------------------------------------------------------------
// Helper Utilities
// -----------------------------------------------------------------------------

function executeMultiStatementSql(sqlString: string): void {
  const statements = sqlString
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      alasql(stmt);
    } catch (e: any) {
      if (
        !stmt.toUpperCase().startsWith('CREATE TABLE') &&
        !stmt.toUpperCase().startsWith('CREATE INDEX')
      ) {
        console.warn('AlaSQL statement warning:', e.message, stmt.substring(0, 50));
      }
    }
  }
}

export function cleanSqlStatement(sql: string): string {
  return sql
    .trim()
    .replace(/^--.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .trim()
    .replace(/;+$/, ''); // Remove trailing semicolons
}

function normalizeResultRows(raw: any): Record<string, any>[] {
  if (raw === undefined || raw === null) return [];
  if (typeof raw === 'number' || typeof raw === 'string' || typeof raw === 'boolean') {
    return [{ value: raw }];
  }
  if (!Array.isArray(raw)) {
    return [raw];
  }
  return raw.map((item) => {
    if (item && typeof item === 'object') {
      const normalized: Record<string, any> = {};
      for (const [key, val] of Object.entries(item)) {
        // Parse numeric strings from postgres COUNT or SUM if needed
        normalized[key.toLowerCase()] = typeof val === 'bigint' ? Number(val) : val;
      }
      return normalized;
    }
    return { value: item };
  });
}

function compareResultSets(
  actual: Record<string, any>[],
  expected: Record<string, any>[],
  orderMatters: boolean
): { matches: boolean; message?: string } {
  if (actual.length !== expected.length) {
    return {
      matches: false,
      message: `Row count mismatch: expected ${expected.length} row(s), but query returned ${actual.length} row(s).`
    };
  }

  if (expected.length === 0 && actual.length === 0) {
    return { matches: true };
  }

  const actualCols = Object.keys(actual[0] || {}).sort();
  const expectedCols = Object.keys(expected[0] || {}).sort();

  if (actualCols.length !== expectedCols.length) {
    return {
      matches: false,
      message: `Column count mismatch: expected columns [${expectedCols.join(', ')}], but got [${actualCols.join(', ')}].`
    };
  }

  const prepareCompareString = (row: Record<string, any>) => {
    const keys = Object.keys(row).sort();
    return keys
      .map((k) => {
        let v = row[k];
        if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) {
          v = Number(Number(v).toFixed(4));
        } else if (typeof v === 'number') {
          v = Number(v.toFixed(4));
        }
        if (v === null || v === undefined) v = 'NULL';
        return `${k}:${v}`;
      })
      .join('|');
  };

  if (orderMatters) {
    for (let i = 0; i < actual.length; i++) {
      const actStr = prepareCompareString(actual[i]);
      const expStr = prepareCompareString(expected[i]);
      if (actStr !== expStr) {
        return {
          matches: false,
          message: `Row ${i + 1} mismatch.\nExpected: ${expStr}\nActual:   ${actStr}`
        };
      }
    }
    return { matches: true };
  } else {
    const actualSorted = actual.map(prepareCompareString).sort();
    const expectedSorted = expected.map(prepareCompareString).sort();

    for (let i = 0; i < actualSorted.length; i++) {
      if (actualSorted[i] !== expectedSorted[i]) {
        return {
          matches: false,
          message: `Content mismatch at sorted index ${i + 1}.\nExpected: ${expectedSorted[i]}\nActual:   ${actualSorted[i]}`
        };
      }
    }
    return { matches: true };
  }
}
