import { describe, it, expect } from 'vitest';
import { ALL_SQL_QUESTIONS, getSqlQuestionsByTier, getSqlQuestionById } from '@/data/sql';
import { ALL_SQL_DATASETS, getDatasetById } from '@/data/sql/datasets';
import { evaluateExecutableSql, introspectSchema } from '@/lib/evaluation/sqlEvaluator';

describe('SQL & PostgreSQL Track Remediation and Dialect Engine Tests', () => {
  it('preserves all 120 questions distributed evenly (30 per tier)', () => {
    expect(ALL_SQL_QUESTIONS.length).toBe(120);

    const tier1 = getSqlQuestionsByTier('tier-1');
    const tier2 = getSqlQuestionsByTier('tier-2');
    const tier3 = getSqlQuestionsByTier('tier-3');
    const tier4 = getSqlQuestionsByTier('tier-4');

    expect(tier1.length).toBe(30);
    expect(tier2.length).toBe(30);
    expect(tier3.length).toBe(30);
    expect(tier4.length).toBe(30);
  });

  it('preserves all 3 production datasets with schema and seed definitions', () => {
    expect(ALL_SQL_DATASETS.length).toBe(3);
    const ecommerce = getDatasetById('ecommerce');
    const loanMgmt = getDatasetById('loan_management');
    const saas = getDatasetById('saas_analytics');

    expect(ecommerce).toBeDefined();
    expect(ecommerce?.tables.length).toBeGreaterThanOrEqual(7);
    expect(loanMgmt).toBeDefined();
    expect(loanMgmt?.tables.length).toBeGreaterThanOrEqual(6);
    expect(saas).toBeDefined();
    expect(saas?.tables.length).toBeGreaterThanOrEqual(5);
  });

  describe('Verification of the 13 Previously Failing Exercises (100% Pass Rate)', () => {
    const targetExerciseIds = [
      'sql-t1-08',
      'sql-t2-04',
      'sql-t2-05',
      'sql-t2-06',
      'sql-t2-07',
      'sql-tier3-015',
      'sql-tier3-018',
      'sql-tier3-025',
      'sql-tier3-027',
      'sql-tier4-009',
      'sql-tier4-016',
      'sql-tier4-025',
      'sql-tier4-027'
    ];

    for (const qId of targetExerciseIds) {
      it(`evaluates ${qId} successfully with reference solution`, async () => {
        const q = getSqlQuestionById(qId);
        expect(q).toBeDefined();
        expect(q?.sqlSolution).toBeDefined();

        const outcome = await evaluateExecutableSql(q!.sqlSolution!, q!);
        if (!outcome.allPassed) {
          console.error(`Failed ${qId}:`, JSON.stringify(outcome.testCaseResults, null, 2));
        }
        expect(outcome.allPassed).toBe(true);
        expect(outcome.score).toBe(100);
      }, 15000);
    }
  });

  it('introspects live schema from PGlite WebAssembly engine', async () => {
    const tables = await introspectSchema('ecommerce', 'pglite');
    expect(tables.length).toBeGreaterThanOrEqual(7);

    const productsTable = tables.find((t) => t.name === 'products');
    expect(productsTable).toBeDefined();
    expect(productsTable?.rowCount).toBe(10);
    expect(productsTable?.columns.some((c) => c.name === 'price')).toBe(true);
  });
});

