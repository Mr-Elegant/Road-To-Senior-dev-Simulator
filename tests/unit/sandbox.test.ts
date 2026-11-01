import { describe, it, expect } from 'vitest';
import { executeJavaScriptSandbox } from '@/lib/execution/jsSandbox';
import { stripTypeScriptTypes } from '@/lib/execution/typeScriptStripper';
import { executeSqlSandbox } from '@/lib/execution/sqlSandbox';
import { runSandboxedCode } from '@/lib/execution/sandboxEngine';
import { practiceProblems } from '@/data/practiceProblems';
import { PracticeTestCase, SqlDatabaseSetup } from '@/types/practice';

describe('In-Browser Execution Sandboxes', () => {
  describe('JavaScript Sandbox', () => {
    it('executes user code and passes matching test cases', async () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
      `;
      const testCases: PracticeTestCase[] = [
        {
          id: 'test-1',
          name: 'Simple addition',
          inputDescription: '2, 3',
          expectedOutput: '5',
        },
        {
          id: 'test-2',
          name: 'Negative numbers',
          inputDescription: '-5, 10',
          expectedOutput: '5',
        },
      ];

      const result = await executeJavaScriptSandbox(code, testCases);
      expect(result.passedCount).toBe(2);
      expect(result.results.length).toBe(2);
      expect(result.results[0].passed).toBe(true);
      expect(result.results[0].actualOutput).toBe('5');
    });

    it('identifies mismatched outputs as failed test cases', async () => {
      const buggyCode = `
        function multiply(a, b) {
          return a + b; // Bug: addition instead of multiplication
        }
      `;
      const testCases: PracticeTestCase[] = [
        {
          id: 'test-1',
          name: 'Multiply positive',
          inputDescription: '3, 4',
          expectedOutput: '12',
        },
      ];

      const result = await executeJavaScriptSandbox(buggyCode, testCases);
      expect(result.passedCount).toBe(0);
      expect(result.results[0].passed).toBe(false);
      expect(result.results[0].actualOutput).toBe('7');
      expect(result.results[0].errorMessage).toContain('Expected');
    });

    it('captures intercepted console logs safely', async () => {
      const codeWithLogs = `
        function greet(name) {
          console.log("Processing name:", name);
          return "Hello, " + name;
        }
      `;
      const testCases: PracticeTestCase[] = [
        {
          id: 'test-1',
          name: 'Greeting test',
          inputDescription: '"Alice"',
          expectedOutput: 'Hello, Alice',
        },
      ];

      const result = await executeJavaScriptSandbox(codeWithLogs, testCases);
      expect(result.passedCount).toBe(1);
      expect(result.results[0].logs.some((l) => l.includes('Processing name: Alice'))).toBe(true);
    });

    it('handles syntax errors without crashing', async () => {
      const brokenSyntax = `function broken( { return 42;`;
      const testCases: PracticeTestCase[] = [
        { id: 'test-1', name: 'Syntax test', inputDescription: '', expectedOutput: '42' },
      ];

      const result = await executeJavaScriptSandbox(brokenSyntax, testCases);
      expect(result.passedCount).toBe(0);
      expect(result.results[0].passed).toBe(false);
      expect(result.results[0].errorMessage).toBeTruthy();
    });

    it('terminates hanging asynchronous operations with a timeout guard', async () => {
      const infiniteHang = `
        function hang() {
          return new Promise(() => {}); // Intentionally never resolves
        }
      `;
      const testCases: PracticeTestCase[] = [
        { id: 'test-1', name: 'Timeout test', inputDescription: '', expectedOutput: '1' },
      ];

      const result = await executeJavaScriptSandbox(infiniteHang, testCases);
      expect(result.passedCount).toBe(0);
      expect(result.results[0].passed).toBe(false);
      expect(result.results[0].errorMessage).toContain('Timeout');
    });
  });

  describe('TypeScript Stripper', () => {
    it('strips interface and type definitions and variable types', () => {
      const tsCode = `
        interface User {
          id: string;
          age: number;
        }

        type ID = string | number;

        function getUserName(u: User): string {
          const role: string = "Admin";
          return role;
        }
      `;

      const stripped = stripTypeScriptTypes(tsCode);
      expect(stripped).not.toContain('interface User');
      expect(stripped).not.toContain('type ID');
      expect(stripped).not.toContain('const role: string =');
      expect(stripped).toContain('const role =');
      expect(stripped).toContain('function getUserName');
    });

    it('executes stripped TypeScript through JS sandbox', async () => {
      const tsCode = `
        interface Point {
          x: number;
          y: number;
        }

        function calculateDistance(p1: Point, p2: Point): number {
          const dx: number = p2.x - p1.x;
          const dy: number = p2.y - p1.y;
          return Math.sqrt(dx * dx + dy * dy);
        }
      `;

      const testCases: PracticeTestCase[] = [
        {
          id: 'test-ts-1',
          name: 'Distance 3-4-5 triangle',
          inputDescription: '{ x: 0, y: 0 }, { x: 3, y: 4 }',
          expectedOutput: '5',
        },
      ];

      const stripped = stripTypeScriptTypes(tsCode);
      const result = await executeJavaScriptSandbox(stripped, testCases);
      expect(result.passedCount).toBe(1);
      expect(result.results[0].passed).toBe(true);
      expect(result.results[0].actualOutput).toBe('5');
    });
  });

  describe('SQL Sandbox (AlaSQL In-Memory)', () => {
    const mockDbSetup: SqlDatabaseSetup[] = [
      {
        tableName: 'employees',
        schemaSql: `
          CREATE TABLE employees (
            id INT,
            name STRING,
            department STRING,
            salary INT
          );
        `,
        seedDataSql: `
          INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
          INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 95000);
          INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 85000);
        `,
      },
    ];

    it('creates in-memory database, runs query, and matches relational results', async () => {
      const userSql = `
        SELECT department, COUNT(*) AS employee_count
        FROM employees
        GROUP BY department
        ORDER BY department ASC;
      `;

      const testCases: PracticeTestCase[] = [
        {
          id: 'sql-test-1',
          name: 'Group by department',
          inputDescription: '',
          expectedOutput: JSON.stringify([
            { department: 'Engineering', employee_count: 2 },
            { department: 'Marketing', employee_count: 1 },
          ]),
        },
      ];

      const result = await executeSqlSandbox(userSql, testCases, mockDbSetup);
      expect(result.passedCount).toBe(1);
      expect(result.results[0].passed).toBe(true);
      expect(Array.isArray(result.results[0].tableData)).toBe(true);
    });

    it('reports SQL syntax errors clearly without crashing', async () => {
      const invalidSql = `SELCT * FORM employees;`;
      const testCases: PracticeTestCase[] = [
        { id: 'test-sql-err', name: 'Invalid syntax', inputDescription: '', expectedOutput: '[]' },
      ];

      const result = await executeSqlSandbox(invalidSql, testCases, mockDbSetup);
      expect(result.passedCount).toBe(0);
      expect(result.results[0].passed).toBe(false);
      expect(result.results[0].errorMessage).toBeTruthy();
    });
  });

  describe('Unified Sandbox Engine & Server Safety Policies', () => {
    it('handles supported languages with isConfigured = true', async () => {
      const problem = practiceProblems.find((p) => p.language === 'javascript')!;
      const testCases = problem.testCases.slice(0, 1);

      const result = await runSandboxedCode(
        problem.language,
        problem.starterCode,
        testCases,
        problem.sqlSetup
      );

      expect(result.isConfigured).toBe(true);
      expect(result.language).toBe('javascript');
      expect(result.totalTests).toBe(1);
    });

    it('safely rejects unconfigured languages (e.g. Python) without executing on server', async () => {
      const pythonProblem = practiceProblems.find((p) => p.language === 'python');
      expect(pythonProblem).toBeDefined();

      const result = await runSandboxedCode(
        'python',
        'def solution(): pass',
        pythonProblem?.testCases || []
      );

      expect(result.isConfigured).toBe(false);
      expect(result.hasErrors).toBe(true);
      expect(result.statusMessage).toContain('Execution Service Not Configured');
      expect(result.statusMessage).toContain('application web server');
      expect(result.passedTests).toBe(0);
    });
  });

  describe('Practice Problems Library Consistency', () => {
    it('contains valid practice problems across supported languages with at least 2 test cases and hints', () => {
      expect(practiceProblems.length).toBeGreaterThanOrEqual(5);

      const ids = new Set<string>();
      for (const p of practiceProblems) {
        expect(ids.has(p.id)).toBe(false);
        ids.add(p.id);

        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.starterCode).toBeTruthy();
        expect(p.referenceSolution).toBeTruthy();
        expect(p.hints.length).toBeGreaterThanOrEqual(2);
        expect(p.testCases.length).toBeGreaterThanOrEqual(2);

        if (p.language === 'sql') {
          expect(p.sqlSetup).toBeDefined();
          expect(p.sqlSetup?.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
