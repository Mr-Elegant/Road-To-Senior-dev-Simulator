import { describe, it, expect } from 'vitest';
import {
  ALL_SQL_QUESTIONS,
  TIER1_BEGINNER_QUESTIONS,
  TIER2_INTERMEDIATE_QUESTIONS,
  TIER3_ADVANCED_QUESTIONS,
  TIER4_SENIOR_QUESTIONS,
  getSqlQuestionsByTier,
  getSqlQuestionById,
  getSqlTrackStats
} from '@/data/sql';
import { ALL_SQL_DATASETS, getDatasetById } from '@/data/sql/datasets';
import { runQueryAgainstDataset, evaluateExecutableSql } from '@/lib/evaluation/sqlEvaluator';
import { getOfflineSqlEvaluation, buildSqlEvaluationPrompt } from '@/lib/gemini/sqlPrompts';

describe('SQL & PostgreSQL Track - Question Bank Integrity', () => {
  it('should contain at least 120 total questions distributed evenly across 4 tiers (30 per tier)', () => {
    expect(ALL_SQL_QUESTIONS.length).toBeGreaterThanOrEqual(120);
    expect(TIER1_BEGINNER_QUESTIONS.length).toBe(30);
    expect(TIER2_INTERMEDIATE_QUESTIONS.length).toBe(30);
    expect(TIER3_ADVANCED_QUESTIONS.length).toBe(30);
    expect(TIER4_SENIOR_QUESTIONS.length).toBe(30);
  });

  it('should ensure all questions have unique IDs', () => {
    const ids = ALL_SQL_QUESTIONS.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should ensure all questions have complete required metadata', () => {
    for (const q of ALL_SQL_QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.title).toBeTruthy();
      expect(q.tier).toMatch(/^tier-[1-4]$/);
      expect(q.category).toBeTruthy();
      expect(q.realWorldScenario.length).toBeGreaterThan(15);
      expect(q.questionStatement.length).toBeGreaterThan(15);
      expect(q.expectedConcepts.length).toBeGreaterThanOrEqual(2);
      expect(q.referenceAnswer.length).toBeGreaterThan(30);
      expect(q.hints.length).toBeGreaterThanOrEqual(1);
      expect(q.followUp?.question).toBeTruthy();
      expect(q.followUp?.expectedAnswer).toBeTruthy();
      expect(q.rubric.correctnessWeight).toBeGreaterThan(0);
      expect(q.rubric.criteria.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should cover all 18 specified SQL and PostgreSQL categories', () => {
    const stats = getSqlTrackStats();
    expect(Object.keys(stats.categories).length).toBe(18);
    expect(stats.categories['SQL Fundamentals']).toBeGreaterThan(0);
    expect(stats.categories['Indexes and Query Planning']).toBeGreaterThan(0);
    expect(stats.categories['Isolation Levels and MVCC']).toBeGreaterThan(0);
    expect(stats.categories['Locks and Deadlocks']).toBeGreaterThan(0);
    expect(stats.categories['Backup, Recovery, and Replication']).toBeGreaterThan(0);
  });
});

describe('SQL & PostgreSQL Track - Relational Datasets', () => {
  it('should provide the 3 specified enterprise schemas', () => {
    expect(ALL_SQL_DATASETS.length).toBe(3);
    const ecommerce = getDatasetById('ecommerce');
    const loanMgmt = getDatasetById('loan_management');
    const saas = getDatasetById('saas_analytics');

    expect(ecommerce).toBeDefined();
    expect(loanMgmt).toBeDefined();
    expect(saas).toBeDefined();

    expect(ecommerce?.tables.length).toBe(7);
    expect(loanMgmt?.tables.length).toBe(6);
    expect(saas?.tables.length).toBe(5);
  });

  it('should have valid DDL and seed data for each dataset', () => {
    for (const ds of ALL_SQL_DATASETS) {
      expect(ds.schemaSql).toContain('CREATE TABLE');
      expect(ds.seedSql).toContain('INSERT INTO');
      for (const t of ds.tables) {
        expect(t.columns.length).toBeGreaterThan(1);
        expect(t.columns.some((c) => c.isPrimaryKey)).toBe(true);
      }
    }
  });
});

describe('SQL Evaluator & In-Memory Sandbox', () => {
  it('should execute basic queries against ecommerce dataset', async () => {
    const result = await runQueryAgainstDataset(
      'SELECT id, name, price FROM products ORDER BY price DESC LIMIT 3;',
      'ecommerce'
    );
    expect(result.passed).toBe(true);
    expect(result.rowCount).toBe(3);
    expect(result.columns).toContain('name');
    expect(result.columns).toContain('price');
  });

  it('should execute aggregation and group by against saas_analytics', async () => {
    const result = await runQueryAgainstDataset(
      'SELECT event_name, count(*) AS cnt FROM events GROUP BY event_name;',
      'saas_analytics'
    );
    expect(result.passed).toBe(true);
    expect(result.rowCount).toBeGreaterThan(0);
    expect(result.columns).toContain('cnt');
  });

  it('should return clean error messages on syntax failures without throwing', async () => {
    const result = await runQueryAgainstDataset(
      'SELECT non_existent_column FROM fake_table;',
      'ecommerce'
    );
    expect(result.passed).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should evaluate executable question test cases accurately', async () => {
    const q = getSqlQuestionById('sql-t1-01');
    expect(q).toBeDefined();
    if (q) {
      const outcome = await evaluateExecutableSql(q.sqlSolution || '', q);
      expect(outcome.allPassed).toBe(true);
      expect(outcome.score).toBe(100);
    }
  });
});

describe('Gemini SQL Prompts & Offline Evaluator', () => {
  it('should build structured prompt containing scenario, statement, and rubric', () => {
    const q = getSqlQuestionById('sql-tier3-001')!;
    const prompt = buildSqlEvaluationPrompt(q, 'A B-Tree page split splits 8KB leaf pages 50/50.');
    expect(prompt).toContain('B-Tree Index Internals');
    expect(prompt).toContain('EVALUATION RUBRIC:');
    expect(prompt).toContain('CANDIDATE EXPLANATION / ANSWER:');
  });

  it('should provide deterministic offline scoring when candidate hits expected concepts', () => {
    const q = getSqlQuestionById('sql-tier3-001')!;
    const offlineGood = getOfflineSqlEvaluation(
      q,
      'PostgreSQL B-Tree leaf pages split 50/50 causing write amplification and bloat. Setting fillfactor allows HOT heap updates.'
    );
    expect(offlineGood.scoreOutOf100).toBeGreaterThanOrEqual(70);
    expect(offlineGood.passed).toBe(true);
    expect(offlineGood.strengths.length).toBeGreaterThan(0);

    const offlineBad = getOfflineSqlEvaluation(q, 'I have no idea.');
    expect(offlineBad.scoreOutOf100).toBeLessThan(70);
    expect(offlineBad.passed).toBe(false);
  });
});

