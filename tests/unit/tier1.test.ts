import { describe, it, expect, beforeEach } from 'vitest';
import {
  allTier1Questions,
  tier1QuestionMap,
  TIER1_CATEGORIES,
  getTier1QuestionsByCategory,
  getRandomTier1Question,
} from '@/data/tier1';
import { evaluateTier1AnswerWithRubric } from '@/lib/evaluation/tier1Evaluator';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { Tier1Attempt } from '@/types/tier1';

describe('Tier 1 Beginner Interview Track - Questions Catalog', () => {
  it('contains at least 60 original Tier 1 questions', () => {
    expect(allTier1Questions.length).toBeGreaterThanOrEqual(60);
    expect(tier1QuestionMap.size).toBe(allTier1Questions.length);
  });

  it('covers all 6 required categories with at least 10 questions each', () => {
    for (const category of TIER1_CATEGORIES) {
      const questions = getTier1QuestionsByCategory(category);
      expect(
        questions.length,
        `Category "${category}" should have at least 10 questions`
      ).toBeGreaterThanOrEqual(10);
    }
  });

  it('verifies question data completeness and beginner structure', () => {
    for (const q of allTier1Questions) {
      expect(q.id).toBeDefined();
      expect(q.title.length).toBeGreaterThan(10);
      expect(q.difficulty).toBe('Beginner');
      expect(q.tier).toBe('tier-1');
      expect(q.expectedConcepts.length).toBeGreaterThanOrEqual(2);
      expect(q.shortReferenceAnswer.length).toBeGreaterThan(20);
      expect(q.hints.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('retrieves random questions properly with or without category filter', () => {
    const randomAny = getRandomTier1Question();
    expect(randomAny).toBeDefined();
    expect(randomAny.id).toBeDefined();

    const randomJs = getRandomTier1Question('JavaScript Fundamentals');
    expect(randomJs.category).toBe('JavaScript Fundamentals');
  });
});

describe('Tier 1 Beginner Evaluator - Conceptual Rubric Benchmark', () => {
  const sampleQuestion = allTier1Questions.find((q) => q.id === 't1-js-01')!;

  it('evaluates a strong candidate answer with high score and Mastered verdict', () => {
    const strongAnswer =
      'var is function-scoped and hoisted with undefined. let and const are block-scoped. let can be reassigned, whereas const cannot be reassigned after declaration. Both let and const reside in the Temporal Dead Zone before declaration.';

    const result = evaluateTier1AnswerWithRubric(sampleQuestion, strongAnswer);
    expect(result.scoreOutOf100).toBeGreaterThanOrEqual(75);
    expect(result.verdict).toBe('Mastered');
    expect(result.evaluatorType).toBe('rubric-benchmark');
    expect(result.matchedConcepts.length).toBeGreaterThan(0);
    expect(result.encouragement).toContain('Outstanding');
  });

  it('evaluates a partial answer with Review Needed verdict and actionable tips', () => {
    const partialAnswer =
      'var is old and let is block scoped. const cannot be changed.';

    const result = evaluateTier1AnswerWithRubric(sampleQuestion, partialAnswer);
    expect(result.scoreOutOf100).toBeGreaterThanOrEqual(40);
    expect(result.evaluatorType).toBe('rubric-benchmark');
    expect(result.actionableTips.length).toBeGreaterThan(0);
  });

  it('handles empty or minimal input gracefully with supportive encouragement', () => {
    const emptyAnswer = '';
    const result = evaluateTier1AnswerWithRubric(sampleQuestion, emptyAnswer);
    expect(result.scoreOutOf100).toBeGreaterThanOrEqual(15);
    expect(result.verdict).toBe('Needs Practice');
    expect(result.encouragement).toContain('Don’t be discouraged');
  });
});

describe('Tier 1 Progress Persistence', () => {
  beforeEach(async () => {
    await storage.resetTier1Progress();
  });

  it('loads initial empty Tier 1 progress', async () => {
    const progress = await storage.getTier1Progress();
    expect(progress.attempts).toEqual([]);
    expect(progress.bookmarkedQuestionIds).toEqual([]);
    expect(progress.totalScore).toBe(0);
  });

  it('saves Tier 1 attempt and calculates average score without touching senior attempts', async () => {
    const q = allTier1Questions[0];
    const evalResult = evaluateTier1AnswerWithRubric(q, 'Solid understanding of let and var scope.');

    const attempt: Tier1Attempt = {
      id: 'test-t1-att-1',
      questionId: q.id,
      timestamp: new Date().toISOString(),
      candidateAnswer: 'Solid understanding of let and var scope.',
      evaluation: evalResult,
      mode: 'practice',
      timeSpentSeconds: 45,
    };

    const saved = await storage.saveTier1Attempt(attempt);
    expect(saved.attempts.length).toBe(1);
    expect(saved.attempts[0].id).toBe('test-t1-att-1');
    expect(saved.totalScore).toBe(evalResult.scoreOutOf100);

    // Verify senior progress remains isolated
    const mainProgress = await storage.getProgress();
    expect(mainProgress.attempts).toEqual([]); // Senior attempts remain untouched
    expect(mainProgress.tier1Progress?.attempts.length).toBe(1);
  });

  it('toggles Tier 1 bookmarks correctly', async () => {
    const qId = 't1-react-01';
    let bookmarks = await storage.toggleTier1Bookmark(qId);
    expect(bookmarks).toContain(qId);

    bookmarks = await storage.toggleTier1Bookmark(qId);
    expect(bookmarks).not.toContain(qId);
  });
});

